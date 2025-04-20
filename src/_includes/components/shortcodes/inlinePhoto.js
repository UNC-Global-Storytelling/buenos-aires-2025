import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { optimizeImage } from '../../utils/imageOptimization.js';

export default async function inlinePhoto(storySlug, photoOrder, lang = "en") {
  try {
    // Process at build time
    const inlinePhotosDir = path.join(process.cwd(), 'src/inlinePhotos');
    let photoData = null;
    
    // First try to find a JSON file for this story (for cached data)
    const jsonPath = path.join(process.cwd(), 'dist/inlinePhotos', `${storySlug}.json`);
    if (fs.existsSync(jsonPath)) {
      photoData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    } else {
      // If not found in JSON, look through Markdown files
      if (fs.existsSync(inlinePhotosDir)) {
        const files = fs.readdirSync(inlinePhotosDir).filter(f => f.endsWith('.md'));
        
        for (const file of files) {
          const content = fs.readFileSync(path.join(inlinePhotosDir, file), 'utf8');
          const match = /^---\n([\s\S]+?)\n---/m.exec(content);
          if (!match) continue;
          
          const frontmatter = yaml.load(match[1]);
          if (frontmatter.en?.story === storySlug) {
            photoData = frontmatter;
            break;
          }
        }
      }
    }
    
    // If no photo data was found, show an error
    if (!photoData) {
      return `<p class="inline-photo-error">No photos found for story "${storySlug}"</p>`;
    }
    
    // Get the photos for the specified language
    const photos = photoData[lang]?.photos || photoData.en?.photos || [];
    
    // Find the photo with the specified order
    const photo = photos.find(p => p.order === parseInt(photoOrder, 10));
    
    if (!photo) {
      return `<p class="inline-photo-error">Photo with order ${photoOrder} not found in story "${storySlug}"</p>`;
    }
    
    // Get the photo details
    const photoSrc = photo.photo;
    const caption = lang === "es" ? photo.caption_es : photo.caption_en;
    const altText = lang === "es" ? photo.alt_es : photo.alt_en;
    
    // Apply optimization to generate responsive image HTML
    const optimizedImageHtml = await optimizeImage(photoSrc, altText, {
      widths: [400, 800, 1200],
      quality: 90,
      formats: ['webp', 'jpeg']
    });
    
    // Return the full figure with optimized image
    return `
      <figure class="inline-photo">
        ${optimizedImageHtml}
        <figcaption class="inline-photo-caption">${caption}</figcaption>
      </figure>
    `;
    
  } catch (error) {
    console.error(`Error rendering inline photo for ${storySlug}:`, error);
    return `<p class="inline-photo-error">Error loading photo: ${error.message}</p>`;
  }
}