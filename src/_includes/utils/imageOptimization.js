import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Cache to avoid processing the same image multiple times
const processedImages = new Map();

export async function optimizeImage(src, alt, options = {}) {
  const {
    widths = [400, 800, 1200],
    quality = 90, // Higher quality for photojournalism
    formats = ['webp', 'jpeg'],
    outputDir = './dist/img/',
    urlPath = '/img/'
  } = options;

  // Find the original image path
  const inputPath = src.startsWith('/') 
    ? path.join(process.cwd(), 'src', src) 
    : path.join(process.cwd(), 'src', src);

  if (!fs.existsSync(inputPath)) {
    console.warn(`Image not found: ${inputPath}`);
    return `<img src="${src}" alt="${alt || ''}" loading="lazy">`;
  }

  // Create cache key
  const cacheKey = `${inputPath}-${widths.join('-')}-${quality}-${formats.join('-')}`;
  
  // Return cached result if available
  if (processedImages.has(cacheKey)) {
    return processedImages.get(cacheKey);
  }

  // Ensure output directory exists
  const outputDirPath = path.join(process.cwd(), outputDir);
  if (!fs.existsSync(outputDirPath)) {
    fs.mkdirSync(outputDirPath, { recursive: true });
  }

  const imageName = path.basename(inputPath, path.extname(inputPath));
  const metadata = await sharp(inputPath).metadata();
  
  // Only create sizes smaller than the original
  const filteredWidths = widths.filter(w => w <= metadata.width);
  
  // Generate images for each width and format
  const imageVariants = [];
  
  for (const format of formats) {
    for (const width of filteredWidths) {
      const filename = `${imageName}-${width}.${format}`;
      const outputPath = path.join(outputDirPath, filename);
      const publicPath = path.join(urlPath, filename);
      
      // Skip if already generated
      if (!fs.existsSync(outputPath)) {
        try {
          await sharp(inputPath)
            .resize(width)
            [format]({
              quality: format === 'jpeg' ? quality : undefined,
              quality: format === 'webp' ? quality : undefined,
            })
            .toFile(outputPath);
        } catch (err) {
          console.error(`Error processing image ${inputPath} at width ${width}:`, err);
          continue;
        }
      }
      
      imageVariants.push({
        path: publicPath,
        width,
        format
      });
    }
  }

  // Group by format
  const variantsByFormat = {};
  for (const variant of imageVariants) {
    if (!variantsByFormat[variant.format]) {
      variantsByFormat[variant.format] = [];
    }
    variantsByFormat[variant.format].push(variant);
  }

  // Create the HTML
  let html = `<picture>`;
  
  // Add source elements for each format except jpeg
  for (const format of formats) {
    if (format !== 'jpeg' && variantsByFormat[format]) {
      const srcset = variantsByFormat[format]
        .map(v => `${v.path} ${v.width}w`)
        .join(', ');
      
      html += `
        <source 
          type="image/${format}" 
          srcset="${srcset}" 
          sizes="(max-width: 768px) 100vw, 800px">`;
    }
  }
  
  // Add the fallback img (jpeg)
  if (variantsByFormat['jpeg']) {
    const srcset = variantsByFormat['jpeg']
      .map(v => `${v.path} ${v.width}w`)
      .join(', ');
    
    const smallestJpeg = variantsByFormat['jpeg']
      .sort((a, b) => a.width - b.width)[0];
    
    html += `
      <img 
        src="${smallestJpeg.path}" 
        srcset="${srcset}" 
        sizes="(max-width: 768px) 100vw, 800px" 
        alt="${alt || ''}" 
        loading="lazy" 
        decoding="async">`;
  } else {
    // Fallback to original if no jpeg variants
    html += `<img src="${src}" alt="${alt || ''}" loading="lazy">`;
  }
  
  html += `</picture>`;
  
  // Cache the result
  processedImages.set(cacheKey, html);
  
  return html;
}