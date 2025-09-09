const search = document.querySelector("#search");
const tags = document.querySelector(".tags");
const result = document.querySelector(".result");

const tagSet = new Set(["all"]);
data.forEach((x) => {
  if (x.title) {
    tagSet.add(x.url.split("/")[1]);
  }
});
for (let tag of tagSet) {
  const span = document.createElement("button");
  span.textContent = tag;
  tags.appendChild(span);
}
tags.addEventListener("click", function (event) {
  if (event.target.tagName === "BUTTON") {
    const text = event.target.textContent;
    search.value = text === "all" ? "" : text;
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
    data
      .filter(
        (d) => (d.title && d.title.includes(query)) || d.url.includes(query),
      )
      .map((x) => ({ ...x, catagory: x.url.split("/")[1] }))
      .sort((a, b) => (a.catagory < b.catagory ? 1 : -1))
      .forEach((x, i, a) => {
        const prevCatagory = a[i - 1]?.catagory;
        if (x.catagory !== prevCatagory) {
          const p = document.createElement("p");
          p.textContent = x.catagory;
          result.appendChild(p);
        }
        const link = document.createElement("a");
        link.href = "." + x.url;
        link.textContent = x.title;
        result.appendChild(link);
      });
  }
});
