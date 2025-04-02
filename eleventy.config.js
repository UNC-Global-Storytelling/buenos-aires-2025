import fs from 'fs';
import path from 'path';

import cssnano from 'cssnano';
import postcss from 'postcss';
import tailwindcss from '@tailwindcss/postcss';
import markdownIt from "markdown-it";

export default function (eleventyConfig) {
  // Compile Tailwind before Eleventy processes the files
  eleventyConfig.on('eleventy.before', async () => {
    const tailwindInputPath = path.resolve('./src/assets/styles/index.css');
    const tailwindOutputPath = './dist/assets/styles/index.css';

    const cssContent = fs.readFileSync(tailwindInputPath, 'utf8');

    const outputDir = path.dirname(tailwindOutputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const result = await processor.process(cssContent, {
      from: tailwindInputPath,
      to: tailwindOutputPath,
    });

    fs.writeFileSync(tailwindOutputPath, result.css);
  });

  const processor = postcss([
    // Compile Tailwind
    tailwindcss(),

    // Minify Tailwind CSS
    cssnano({
      preset: 'default',
    }),
  ]);

  // Set up a markdown library
  const markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true
  });
  
  eleventyConfig.setLibrary("md", markdownLibrary);
  
  // Add markdown filter
  eleventyConfig.addFilter("markdown", function(content) {
    return markdownLibrary.render(content);
  });

  // Passthrough items
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/assets/styles/override.css");

  // Add the "stories" collection for dynamic menu generation
  eleventyConfig.addCollection("stories", function (collectionApi) {
    return collectionApi.getFilteredByGlob("./src/stories/*.md");
  });

  return {
    dir: {
      input: "src", // Source files
      includes: "_includes", // Includes folder
      output: "dist", // Output folder
    },
  };
} // End function
