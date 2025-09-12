import { HtmlBasePlugin, IdAttributePlugin } from "@11ty/eleventy";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";

export default async function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("imgs");
  eleventyConfig.addPassthroughCopy("src");
  eleventyConfig.addPlugin(HtmlBasePlugin);
  eleventyConfig.addPlugin(IdAttributePlugin, { slugify: getSlugify });
  eleventyConfig.addPlugin(syntaxHighlight, { init: getInit });
}

export const config = {
  pathPrefix: "/note/",
};

function getSlugify(text) {
  return text;
}

function getInit({ Prism }) {
  Prism.languages.example = {
    comment: {
      pattern: /#.*/,
      greedy: true,
      inside: {
        sharp: {
          pattern: /#/g,
        },
      },
    },
  };
}
