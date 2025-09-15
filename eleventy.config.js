import { HtmlBasePlugin, IdAttributePlugin } from "@11ty/eleventy";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";

export default async function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("imgs");
  eleventyConfig.addPassthroughCopy("src");
  eleventyConfig.addPlugin(HtmlBasePlugin);
  eleventyConfig.addPlugin(IdAttributePlugin, { slugify: getSlugify });
  eleventyConfig.addPlugin(syntaxHighlight, { init: getInit });
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
  const headings = html
    .matchAll(/<h[2-3][^>]*>(.*?)<\/h([2-3])>/g)
    .map((x) => ({ text: x[1], level: x[2] }));
  const items = [...headings]
    .map(({ text, level }) => {
      return level === "2"
        ? `<li><a href="#${text}">${text}</a></li>`
        : `<ul><li><a href="#${text}">${text}</a></li></ul>`;
    })
    .join("");
  return `<ul class="toc">${items}</ul>`;
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
