const search = document.querySelector("#search");
const tags = document.querySelector(".tags");
const result = document.querySelector(".result");

const pages = data.filter((x) => x.category);
const categories = new Set(pages.map((x) => x.category));

for (let category of categories) {
  const span = document.createElement("button");
  span.textContent = category;
  tags.appendChild(span);
}

tags.addEventListener("click", function (event) {
  if (event.target.tagName === "BUTTON") {
    search.value = event.target.textContent;
    const enterEvent = new KeyboardEvent("keydown", {
      key: "Enter",
      code: "Enter",
      bubbles: true,
    });
    search.dispatchEvent(enterEvent);
  }
});

search.addEventListener("keydown", function (event) {
  if (event.code === "Enter") {
    result.innerHTML = "";
    const query = this.value;
    pages
      .filter(
        (x) =>
          x.title.includes(query) ||
          x.category === query ||
          x.keys.includes(query),
      )
      .sort((a, b) => (a.category < b.category ? 1 : -1))
      .forEach((x, i, a) => {
        const prevCategory = a[i - 1]?.category;
        if (x.category !== prevCategory) {
          const p = document.createElement("p");
          p.textContent = x.category;
          result.appendChild(p);
        }
        const link = document.createElement("a");
        link.href = "." + x.url;
        link.textContent = x.title;
        result.appendChild(link);
      });
  }
});
