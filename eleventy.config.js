import { HtmlBasePlugin, IdAttributePlugin } from "@11ty/eleventy";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import mermaid from "./src/plugin.js";

export default async function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("imgs");
  eleventyConfig.addPassthroughCopy("src");
  eleventyConfig.addPlugin(HtmlBasePlugin);
  eleventyConfig.addPlugin(IdAttributePlugin, { slugify: getSlugify });
  eleventyConfig.addPlugin(syntaxHighlight, { init: getInit });
  eleventyConfig.addPlugin(mermaid);
  eleventyConfig.addLiquidFilter("toc", getToc);
  eleventyConfig.addCollection("categories", getCategories);
  eleventyConfig.addCollection("pages", getPages);
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

function getToc(html) {
  const regex = /<h([2-3])[^>]*>(.*?)<\/h\1>/g;
  let result = [];
  let tmp = [];
  for (const [, level, text] of html.matchAll(regex)) {
    const li = `<li><a href="#${text}">${text}</a></li>`;
    if (level === "3") {
      tmp.push(li);
    } else {
      if (tmp.length) {
        result.push(`<ul>${tmp.join("")}</ul>`);
        tmp = [];
      }
      result.push(li);
    }
  }
  if (tmp.length) {
    result.push(`<ul>${tmp.join("")}</ul>`);
  }
  return `<ul class="toc">${result.join("")}</ul>`;
}

function getCategories(api) {
  const categories = api
    .getAll()
    .map((x) => x.data.category)
    .filter((x) => x);
  const set = new Set(categories);
  return [...set];
}

function getPages(api) {
  const categories = api
    .getAll()
    .map((x) => ({
      title: x.data.title,
      category: x.data.category,
      keys: x.data.keys,
      url: x.url,
    }))
    .filter((x) => x.category)
    .sort((a, b) => (a.category < b.category ? 1 : -1));
  return categories;
}
