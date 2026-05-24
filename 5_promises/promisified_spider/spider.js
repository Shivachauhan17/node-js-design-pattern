import { urlToFileName } from "../../4_async_pattern_with_callbacks/spider/utils.js";
import { exists, get } from "./utils.js";
import { readFile } from "node:fs/promises";
import { saveFile } from "../../4_async_pattern_with_callbacks/cleaned_spider/spider.js";
import { getPageLinks } from "../../4_async_pattern_with_callbacks/spider_v2/utils.js";

function spiderLinks(currentUrl, body, maxDepth) {
  console.debug(`spiderLinks(${currentUrl}, ${maxDepth})`)
  if (maxDepth === 1) {
    return;
  }
  const links = getPageLinks(currentUrl, body);

  return links.reduce(
    (prev, link) => prev.then(() => spider(link, maxDepth - 1)),
    Promise.resolve(),
  );
}

//returning promise chain to the caller
//this just don't  download the file
//but also exposes the content of it to the caller
export function download(url, filename) {
  console.log(`Downloading ${url} into ${filename}`);

  return get(url).then((content) =>
    saveFile(filename, content, (err) => {
      if (err) throw Error("error in saveFile.");
      return
    }),
  );
}

export function spider(url, maxDepth) {
  console.debug(`spider(${url}, ${maxDepth})`)
  const filename = urlToFileName(url);

  return exists(filename).then((alreadyExists) => {
    if (alreadyExists) {
      if (!filename.endsWith(".html")) {
        return;
      }
      return readFile(filename, "utf8").then((fileContent) => {
        spiderLinks(url, fileContent, maxDepth);
      });
    }

    return download(url, filename).then((fileContent) => {
      if (filename.endsWith(".html")) {
        spiderLinks(url, fileContent, maxDepth);
      }
      return;
    });
  });
}
