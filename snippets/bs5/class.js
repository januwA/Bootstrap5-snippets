const fs = require("fs");

const json = require("./class.json");
const outpath = "./class-out.json";

const colors = [
  "primary",
  "secondary",
  "success",
  "danger",
  "warning",
  "info",
  "light",
  "dark",
  "body",
  "muted",
  "white",
  "black-50",
  "white-50",
];
const bg = [
  "primary",
  "secondary",
  "success",
  "danger",
  "warning",
  "info",
  "light",
  "dark",
  "white",
  "transparent",
];
const btnColor = [
  "primary",
  "secondary",
  "success",
  "danger",
  "warning",
  "info",
  "light",
  "dark",
];
const breakpoint = ["xs", "sm", "md", "lg", "xl", "xxl"];
const bgToken = "<bg>";
const colorToken = "<color>";
const btnColorToken = "<btnColor>";
const exp = /\${\d:[a-zA-Z\d-]+}/;

let keys = Object.keys(json);
for (const k of keys) {
  let v = json[k];
  const optiosn = [];

  if (v.description?.includes("|")) {
    const item = v.description.split("|");
    for (const $_ of item) {
      if ($_ === colorToken) {
        optiosn.push(...colors);
      } else if ($_ === btnColorToken) {
        optiosn.push(...btnColor);
      } else if ($_ === bgToken) {
        optiosn.push(...bg);
      } else if (/\d+~\d+/.test($_)) {
        let [i, end] = $_.split("~");
        i = parseInt(i);
        end = parseInt(end);
        for (; i <= end; i++) optiosn.push(i);
      } else {
        optiosn.push($_);
      }
    }
  } else if (/\d+~\d+/.test(v.description)) {
    let [i, end] = v.description.split("~");
    i = parseInt(i);
    end = parseInt(end);
    for (; i <= end; i++) optiosn.push(i);
  } else if (v.description === colorToken) {
    optiosn.push(...colors);
  } else if (v.description === bgToken) {
    optiosn.push(...bg);
  } else if (v.description === btnColorToken) {
    optiosn.push(...btnColor);
  }

  if (optiosn.length) {
    v.body = v.body.replace(exp, `\${1|${optiosn}|}`);
    v.description = "";
  }

  //  添加 breakpoint
  if (/<breakpoint>/.test(v.prefix)) {
    breakpoint.forEach((b) => {
      json[`${k} ${b}`] = {
        prefix: v.prefix.replace(/<breakpoint>/gi, b),
        body: v.body.replace(/<breakpoint>/gi, b),
        description: "",
      };
    });
    v.prefix = v.prefix.replace(/-<breakpoint>/gi, "");
    v.body = v.body.replace(/-<breakpoint>/gi, "");
  }
}
keys = Object.keys(json);

// breakpoint
for (const k of keys) {
  let v = json[k];
  if (/<breakpoint>/.test(v.prefix)) {
    breakpoint.forEach((b) => {
      json[`${k} ${b}`] = {
        prefix: v.prefix.replace(/<breakpoint>/gi, b),
        body: v.body.replace(/<breakpoint>/gi, b),
        description: "",
      };
    });
    delete json[k];
  }
}

fs.writeFileSync(outpath, JSON.stringify(json, null, "  "));
