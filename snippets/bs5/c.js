const path = require("path");
const fs = require("fs");

const json = require("./class.json");

const themes = [
  "primary",
  "secondary",
  "success",
  "danger",
  "warning",
  "info",
  "light",
  "dark",
  "white",
];
const colors = "<color>";
const exp = /\${\d:[a-zA-Z\d-]+}/;

const keys = Object.keys(json);
for (const k of keys) {
  let v = json[k];

  if (v.description?.includes("|")) {
    const item = v.description.split("|");
    for (const $_ of item) {
      if ($_ === colors) {
        themes.forEach((color) => {
          json[`${k} ${color}`] = {
            prefix: v.prefix + color,
            body: v.body.replace(exp, color),
            description: "",
          };
        });
      } else if (/\d+~\d+/.test($_)) {
        let [i, end] = $_.split("~");
        i = parseInt(i);
        end = parseInt(end);
        for (; i <= end; i++) {
          json[`${k} ${i}`] = {
            prefix: v.prefix + i,
            body: v.body.replace(exp, i),
            description: "",
          };
        }
      } else {
        json[`${k} ${$_}`] = {
          prefix: v.prefix + $_,
          body: v.body.replace(exp, $_),
          description: "",
        };
      }
      delete json[k];
    }
  }

  if (/\d+~\d+/.test(v.description)) {
    let [i, end] = v.description.split("~");
    i = parseInt(i);
    end = parseInt(end);
    for (; i <= end; i++) {
      json[`${k} ${i}`] = {
        prefix: v.prefix + i,
        body: v.body.replace(exp, i),
        description: "",
      };
    }
    delete json[k];
  }

  if (v.description === colors) {
    themes.forEach((color) => {
      json[`${k} ${color}`] = {
        prefix: v.prefix + color,
        body: v.body.replace(exp, color),
        description: "",
      };
    });
    delete json[k];
  }
}

fs.writeFileSync("./class-out.json", JSON.stringify(json));
