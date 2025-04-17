import fs from 'fs';
import path from 'path';

import cssnano from 'cssnano';
import postcss from 'postcss';
import tailwindcss from '@tailwindcss/postcss';
import markdownIt from 'markdown-it';
import video from './src/_includes/components/shortcodes/video.js';
import timeline from './src/_includes/components/shortcodes/timelineBueno.js';
import dumpingFlourish from './src/_includes/components/shortcodes/dumpingFlourish.js';
import separationFlourish from './src/_includes/components/shortcodes/separationFlourish.js';
import gigGenially from './src/_includes/components/shortcodes/gigGenially.js';
import pullQuote from './src/_includes/components/shortcodes/pullQuote.js';
import photoExperience from './src/_includes/components/shortcodes/photoExperience.js';
import {EleventyRenderPlugin} from '@11ty/eleventy';
import { EleventyI18nPlugin } from '@11ty/eleventy';

//import configs for plugins
import configI18n from './src/config/plugins/i18n.js'

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
    breaks: false,
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
  eleventyConfig.addPassthroughCopy("src/assets/styles/aboutstyle.css");
  eleventyConfig.addPassthroughCopy("src/assets/img");
  eleventyConfig.addPassthroughCopy("src/assets/js");

  // Add the "stories" collection for dynamic menu generation
  eleventyConfig.addCollection("stories", function (collectionApi) {
    return collectionApi.getFilteredByGlob("./src/stories/*.md");
  });

  // Plug in sections
  eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.addPlugin(EleventyI18nPlugin, configI18n);

  // Add shortcodes
  eleventyConfig.addShortcode("video", video);
  eleventyConfig.addShortcode("timeline", timeline);
  eleventyConfig.addShortcode("dumpingFlourish", dumpingFlourish);
  eleventyConfig.addShortcode("separationFlourish", separationFlourish);
  eleventyConfig.addShortcode("gigGenially", gigGenially);
  eleventyConfig.addShortcode("pullQuote", pullQuote);
  eleventyConfig.addShortcode("photoExperience", photoExperience);

  // Run after build to create JSON files from photo stories
  eleventyConfig.on('eleventy.after', async ({ dir }) => {
    // Get all photoStories from the collection API
    const inputDir = path.join(process.cwd(), 'src/photoStories');
    const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.md'));

    const outputDir = path.join(dir.output, 'photoStories');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    for (const file of files) {
      const filePath = path.join(inputDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const match = /^---\n([\s\S]+?)\n---/m.exec(content);
      if (!match) continue;
      const yaml = match[1];
      // Parse YAML front matter
      const frontmatter = (await import('js-yaml')).default.load(yaml);
      const id = frontmatter.en?.id || file.replace(/\.md$/, '');
      const jsonPath = path.join(outputDir, `${id}.json`);
      const { photos, ...locales } = frontmatter;
      const jsonData = { ...locales, photos };
      fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2));
      console.log(`Created JSON file: ${jsonPath}`);
    }
  });

  return {
    dir: {
      input: "src", // Source files
      includes: "_includes", // Includes folder
      output: "dist", // Output folder
    },
  };
} // End function
