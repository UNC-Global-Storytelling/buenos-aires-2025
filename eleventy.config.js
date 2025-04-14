import fs from 'fs';
import path from 'path';

import cssnano from 'cssnano';
import postcss from 'postcss';
import tailwindcss from '@tailwindcss/postcss';
import markdownIt from "markdown-it";
import video from "./src/_includes/components/shortcodes/video.js";
import timeline from "./src/_includes/components/shortcodes/timelineBueno.js";
import dumpingFlourish from "./src/_includes/components/shortcodes/dumpingFlourish.js";
import separationFlourish from "./src/_includes/components/shortcodes/separationFlourish.js";
import gigGenially from "./src/_includes/components/shortcodes/gigGenially.js";
import {EleventyRenderPlugin} from "@11ty/eleventy";

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
  eleventyConfig.addPassthroughCopy("src/assets/img");

  // Add the "stories" collection for dynamic menu generation
  eleventyConfig.addCollection("stories", function (collectionApi) {
    return collectionApi.getFilteredByGlob("./src/stories/*.md");
  });

  // Plug in sections
  eleventyConfig.addPlugin(EleventyRenderPlugin);


  // Add shortcodes
  eleventyConfig.addShortcode("video", video);
  eleventyConfig.addShortcode("timeline", timeline);
  eleventyConfig.addShortcode("dumpingFlourish", dumpingFlourish);
  eleventyConfig.addShortcode("separationFlourish", separationFlourish);
  eleventyConfig.addShortcode("gigGenially", gigGenially);

  return {
    dir: {
      input: "src", // Source files
      includes: "_includes", // Includes folder
      output: "dist", // Output folder
    },
  };
} // End function
