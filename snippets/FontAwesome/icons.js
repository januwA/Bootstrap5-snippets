const fs = require("fs");

Array.prototype.logLength = function () {
  console.log(this.length);
  return this;
};

const json = {
  "Font Awesome CDN link": {
    prefix: "ifa-cnd",
    body:
      '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css" />',
    description: "Font Awesome CDN: https://cdnjs.com/libraries/font-awesome",
  },
  "Font Awesome class text": {
    prefix: ".ifa",
    body: "fa-${1:a}",
    description:
      "rotate-90|rotate-180|rotate-270|flip-horizontal|flip-vertical|spin|pulse|xs|sm|lg|2x",
  },
  "Font Awesome Free": {
    prefix: "ifa-free",
    body: '<i class="fa${2|s,r,l,d,b|} fa-${1:a}"></i>',
    description: fs
      .readdirSync("./FontData/free")
      .reduce((acc, it) => {
        return acc.concat(
          JSON.parse(fs.readFileSync(`./FontData/free/${it}`).toString())
        );
      }, [])
      .logLength()
      .map((it) => it.name)
      .join("|"),
  },
  "Font Awesome Pro": {
    prefix: "ifa-pro",
    body: '<i class="fa${2|s,r,l,d,b|} fa-${1:a}"></i>',
    description: fs
      .readdirSync("./FontData/pro")
      .reduce((acc, it) => {
        return acc.concat(
          JSON.parse(fs.readFileSync(`./FontData/pro/${it}`).toString())
        );
      }, [])
      .logLength()
      .map((it) => it.name)
      .join("|"),
  },
};

const outpath = "./icons-out.json";

const exp = /\${(\d):[a-zA-Z\d-]+}/;

let keys = Object.keys(json);
for (const k of keys) {
  let v = json[k];
  if (v.description?.includes("|")) {
    const optiosn = v.description.split("|");
    v.body = v.body.replace(exp, `\${$1|${optiosn}|}`);
    v.description = "";
  }
}
fs.writeFileSync(outpath, JSON.stringify(json, null, "  "));
