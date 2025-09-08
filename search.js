const search = document.querySelector("#search");
const result = document.querySelector("#result");
search.addEventListener("keydown", function (event) {
  if (event.code === "Enter") {
    result.innerHTML = "";
    const query = this.value;
    console.log(data);
    data
      .filter((d) => d.title.includes(query))
      .forEach((x) => {
        const link = document.createElement("a");
        link.href = "." + x.url;
        link.textContent = x.title;
        result.appendChild(link);
      });
  }
});
