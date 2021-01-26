let free_type = "free";
let pro_type = "pro";

(function getFonts(type, page = 0) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "text/plain");
  let params = `query=&hitsPerPage=1000&page=${page}&facets=["type","categories","styles","membership.free","membership.pro","changes"]&facetFilters=[["type:icon"],["membership.${type}:solid","membership.${type}:regular","membership.${type}:brands"]]`;
  var raw = `{"params":"${encodeURI(params)}"}`;
  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(
    "https://m19dxw5x0q-dsn.algolia.net/1/indexes/fontawesome_com-5.15.2/query?x-algolia-agent=Algolia%20for%20JavaScript%20(3.35.1)%3B%20Browser&x-algolia-application-id=M19DXW5X0Q&x-algolia-api-key=c79b2e61519372a99fa5890db070064c",
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => {
      console.log(result.hits.length);
      if (result.hits.length) {
        getFonts(type, page + 1);
        let data = new Blob([JSON.stringify(result.hits)], {
          type: "application/text",
        });
        let dl = document.createElement("a");
        dl.href = window.URL.createObjectURL(data);
        dl.download = `fontawesome-${type}-all-${page}.json`;
        dl.click();
      }
    })
    .catch((error) => console.log("error", error));
})(free_type);
