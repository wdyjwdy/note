import { HtmlBasePlugin, IdAttributePlugin } from "@11ty/eleventy";

export default async function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("imgs");
  eleventyConfig.addPassthroughCopy("styles.css");
  eleventyConfig.addPassthroughCopy("search.js");
  eleventyConfig.addPassthroughCopy("icon.svg");

  eleventyConfig.addPlugin(HtmlBasePlugin);
  eleventyConfig.addPlugin(IdAttributePlugin, {
    slugify: getSlugify,
  });

  eleventyConfig.addPairedShortcode("forms", getForms);
  eleventyConfig.addPairedShortcode("examples", getExamples);
}

export const config = {
  pathPrefix: "/note/",
};

function getForms(content) {
  const forms = content
    .split("\n")
    .filter((f) => f)
    .map((f) => `<span>${f}</span>`)
    .join("");
  return `<div class="forms">${forms}</div>`;
}

function getExamples(content) {
  const examples = content
    .split("\n")
    .filter((e) => e)
    .map((e) => {
      const [text, trans] = e.split("#");
      return `<p><span>${text}</span><span>${trans}</span></p>`;
    })
    .join("");
  return `<div class="examples">${examples}</div>`;
}

function getSlugify(text) {
  return text;
}
