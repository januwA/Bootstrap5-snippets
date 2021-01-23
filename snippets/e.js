const path = require("path");
const fs = require("fs");

const exampleDir =
  "C:\\Users\\ajanuw\\Downloads\\bootstrap-5.0.0-beta1-examples";

const dl = fs.readdirSync(exampleDir);
const json = {};

for (const fn of dl) {
  if (fn === "assets") continue;
  const description = `Example ${fn}`;
  const prefix = `b5-example-${fn}`;
  let body = fs
    .readFileSync(path.join(exampleDir, fn, "index.html"))
    .toString("utf-8")
    .replace(
      /\.\.\/assets\/dist\/css\/bootstrap(\.rtl)?\.min\.css/gi,
      "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.0.0-beta1/css/bootstrap$1.min.css"
    )
    .replace(
      /\.\.\/assets\/dist\/js\/bootstrap\.bundle\.min\.js/,
      "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.0.0-beta1/js/bootstrap.bundle.min.js"
    )
    .replace(
      /\.\.\/assets\/brand\/bootstrap-logo(-white)?\.svg/gi,
      "https://ajanuw.gallerycdn.vsassets.io/extensions/ajanuw/bs5/0.2.0/1611331450106/Microsoft.VisualStudio.Services.Icons.Default"
    )
    .replace(/<link\s+href="([^"]*)".*\/?>/gi, function (match, g1) {
      g1 = g1?.trim();
      if (g1 && !g1.startsWith("http")) {
        const asp = path.join(exampleDir, fn, g1);
        return `<style>
        ${fs.readFileSync(asp)}
        </style>`;
      }
      return match;
    })
    .replace(
      /<script\s+src="([^"]*)"[^>]*>\s*<\/script>/gi,
      function (match, g1) {
        g1 = g1?.trim();
        if (g1 && !g1.startsWith("http")) {
          const asp = path.join(exampleDir, fn, g1);
          return `<script>
        ${fs.readFileSync(asp)}
        </script>`;
        }
        return match;
      }
    );
  json[description] = {
    prefix: prefix,
    body: [body],
    description: description,
  };
}

fs.writeFileSync("./bs5/examples-out.json", JSON.stringify(json));
