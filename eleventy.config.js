import fs from 'fs';
import path from 'path';
import Nunjucks from 'nunjucks'; 

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
import inlinePhoto from './src/_includes/components/shortcodes/inlinePhoto.js';
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

  // Set Nunjucks environment
  const nunjucksEnvironment = new Nunjucks.Environment(

    // Specify the directories where your templates reside.
    new Nunjucks.FileSystemLoader(["./", "_includes", "layouts"]),

    // Apply rendering options
    { 
      lstripBlocks: true,
      trimBlocks: true,
    }
  );

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

  // Add a slugify filter
  eleventyConfig.addFilter("slugify", function(text) {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
  });

  // Passthrough items
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/assets/styles/override.css");
  eleventyConfig.addPassthroughCopy("src/assets/styles/aboutstyle.css");
  eleventyConfig.addPassthroughCopy("src/assets/img");
  eleventyConfig.addPassthroughCopy("src/assets/js");
  eleventyConfig.addPassthroughCopy('src/_redirects');
  eleventyConfig.addPassthroughCopy("src/inlinePhotos");

  // Add the "stories" collection for dynamic menu generation
  eleventyConfig.addCollection("stories", function (collectionApi) {
    return collectionApi.getFilteredByGlob("./src/stories/*.md");
  });

  // Add separate collections for English and Spanish stories
  eleventyConfig.addCollection("storiesEN", function (collectionApi) {
    const stories = collectionApi.getFilteredByGlob("./src/stories/en/*.md");
    stories.forEach(story => {
      // Generate slug from title if not present
      if (!story.data.slug) {
        story.data.slug = eleventyConfig.getFilter("slugify")(story.data.title);
      }
      // Set translationKey if not present (used for language switching)
      if (!story.data.translationKey) {
        story.data.translationKey = story.data.slug;
      }
    });
    return stories;
  });
  
  eleventyConfig.addCollection("storiesES", function (collectionApi) {
    const stories = collectionApi.getFilteredByGlob("./src/stories/es/*.md");
    stories.forEach(story => {
      // Generate slug from Spanish title if not present
      if (!story.data.slug) {
        story.data.slug = eleventyConfig.getFilter("slugify")(story.data.title);
      }
    });
    return stories;
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
  eleventyConfig.addAsyncShortcode("inlinePhoto", inlinePhoto);
  eleventyConfig.addShortcode("photoExperience", photoExperience);

  // Run after build to create JSON files from photo stories
  eleventyConfig.on('eleventy.after', async ({ dir }) => {
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
      const frontmatter = (await import('js-yaml')).default.load(yaml);
      const id = frontmatter.id || file.replace(/\.md$/, '');
      const jsonPath = path.join(outputDir, `${id}.json`);

      // Adjust photo paths to match the new structure
      if (frontmatter.photos) {
        frontmatter.photos = frontmatter.photos.map(photo => ({
          ...photo,
          src: photo.src.replace('/assets/img/', '/photoStories/')
        }));
      }

      fs.writeFileSync(jsonPath, JSON.stringify(frontmatter, null, 2));
      console.log(`Created JSON file: ${jsonPath}`);
    }

    // Create JSON files for inline photos
    const inlinePhotosDir = path.join(process.cwd(), 'src/inlinePhotos');
    const inlinePhotosFiles = fs.existsSync(inlinePhotosDir) ? 
      fs.readdirSync(inlinePhotosDir).filter(f => f.endsWith('.md')) : [];

    const inlineOutputDir = path.join(dir.output, 'inlinePhotos');
    if (!fs.existsSync(inlineOutputDir)) {
      fs.mkdirSync(inlineOutputDir, { recursive: true });
    }

    // Process each inline photo file
    for (const file of inlinePhotosFiles) {
      const filePath = path.join(inlinePhotosDir, file);
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const match = /^---\n([\s\S]+?)\n---/m.exec(content);
        if (!match) {
          console.log(`No frontmatter found in ${file}, skipping`);
          continue;
        }
        
        const yaml = match[1];
        const frontmatter = (await import('js-yaml')).default.load(yaml);
        
        // Use the story ID as the filename (cleaner than the long filename)
        const storyId = frontmatter.en?.story || file.replace(/\.md$/, '').replace(/^map-story-|-photos.*$/g, '');
        const jsonPath = path.join(inlineOutputDir, `${storyId}.json`);
        
        fs.writeFileSync(jsonPath, JSON.stringify(frontmatter, null, 2));
        console.log(`Created inline photos JSON file: ${jsonPath}`);
      } catch (error) {
        console.error(`Error processing ${file}:`, error);
      }
    }
  });

  // Apply Nunjuks environment config
  eleventyConfig.setLibrary("njk", nunjucksEnvironment);

  return {
    dir: {
      input: "src", // Source files
      includes: "_includes", // Includes folder
      output: "dist", // Output folder
    },
  };
} // End function


