
import { urlToFileName } from "../../4_async_pattern_with_callbacks/spider/utils.js";
import { exists } from "../promisified_spider/utils.js";
import { readFile } from "node:fs/promises";
import { saveFile } from "../../4_async_pattern_with_callbacks/cleaned_spider/spider.js";
import { getPageLinks } from "../../4_async_pattern_with_callbacks/spider_v2/utils.js";
import { download } from "../promisified_spider/spider.js";


function spiderLinks(currentUrl, body, maxDepth) {
  console.debug(`spiderLinks(${currentUrl}, ${maxDepth})`)
  if (maxDepth === 1) {
    return Promise.resolve();
  }
  const links = getPageLinks(currentUrl, body);
  console.debug(`links:${links.length}`)
  const promises=links.map(link=>spider(link,maxDepth-1))
  return Promise.all(promises)
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
