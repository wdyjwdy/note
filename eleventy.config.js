import { HtmlBasePlugin, IdAttributePlugin } from "@11ty/eleventy";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";

export default async function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("imgs");
  eleventyConfig.addPassthroughCopy("src");

  eleventyConfig.addPlugin(HtmlBasePlugin);
  eleventyConfig.addPlugin(IdAttributePlugin, { slugify: getSlugify });
  eleventyConfig.addPlugin(syntaxHighlight, { init: getInit });

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
      const [a, b] = e.split("#");
      return `<p><span>${a}</span><span>${b}</span></p>`;
    })
    .join("");
  return `<div class="examples">${examples}</div>`;
}

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
