export default function (eleventyConfig) {
  const highlighter = eleventyConfig.markdownHighlighter;
  eleventyConfig.addMarkdownHighlighter((str, lang) => {
    if (lang === "mermaid") {
      return `<div class="mermaid">${str}</div>`;
    }
    return highlighter(str, lang);
  });
}
