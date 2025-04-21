import fs from 'fs';
import path from 'path';
import { optimizeImage } from '../../utils/imageOptimization.js';

export default async function inlinePhoto(storySlug, photoOrder, lang = "en") {
  try {
    // Process at build time
    const inlinePhotosDir = path.join(process.cwd(), 'src/inlinePhotos');
    let photoData = null;
    
    // Read all JSON files in the inlinePhotos directory
    if (fs.existsSync(inlinePhotosDir)) {
      const files = fs.readdirSync(inlinePhotosDir).filter(f => f.endsWith('.json'));
      
      // Look for a file that has a storyId matching our storySlug
      for (const file of files) {
        const content = fs.readFileSync(path.join(inlinePhotosDir, file), 'utf8');
        const data = JSON.parse(content);
        
        if (data.storyId === storySlug) {
          photoData = data;
          break;
        }
      }
    }
    
    // If no photo data was found, show an error
    if (!photoData) {
      return `<p class="inline-photo-error">No photos found for story "${storySlug}"</p>`;
    }
    
    // Get all photos and find the one with the specified order
    const photos = photoData.photos || [];
    const photo = photos.find(p => p.order === parseInt(photoOrder, 10));
    
    if (!photo) {
      return `<p class="inline-photo-error">Photo with order ${photoOrder} not found in story "${storySlug}"</p>`;
    }
    
    // Get language-specific caption and alt text
    const caption = lang === "es" ? (photo.caption_es || photo.caption_en) : photo.caption_en;
    const altText = lang === "es" ? (photo.alt_es || photo.alt_en) : photo.alt_en;
    
    // Apply optimization to generate responsive image HTML
    const optimizedImageHtml = await optimizeImage(photo.photo, altText, {
      widths: [400, 800, 1200],
      quality: 90,
      formats: ['webp', 'jpeg']
    });
    
    // Return the full figure with optimized image
    return `
      <figure class="inline-photo">
        ${optimizedImageHtml}
        <figcaption class="inline-photo-caption">${caption || ''}</figcaption>
      </figure>
    `;
    
  } catch (error) {
    console.error(`Error rendering inline photo for ${storySlug}:`, error);
    return `<p class="inline-photo-error">Error loading photo: ${error.message}</p>`;
  }
}