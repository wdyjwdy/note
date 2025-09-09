const search = document.querySelector("#search");
const result = document.querySelector(".result");
search.addEventListener("keydown", function (event) {
  if (event.code === "Enter") {
    result.innerHTML = "";
    const query = this.value;
    data
      .filter((d) => d.title && d.title.includes(query))
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
