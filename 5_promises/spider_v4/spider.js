import { urlToFileName } from "../../4_async_pattern_with_callbacks/spider/utils.js";
import { exists } from "../promisified_spider/utils.js";
import { readFile } from "node:fs/promises";
import { saveFile } from "../../4_async_pattern_with_callbacks/cleaned_spider/spider.js";
import { getPageLinks } from "../../4_async_pattern_with_callbacks/spider_v2/utils.js";
import { download } from "../promisified_spider/spider.js";
import { TaskQueue } from "./taskQueue.js";

const spidering = new Set();

function spiderLinks(currentUrl, body, maxDepth, queue) {
  if (maxDepth === 1) {
    return Promise.resolve();
  }
  const links = getPageLinks(currentUrl, body);
  for (const link of links) {
    if (!spidering.has(link)) {
      queue.pushTask(() => spider(link, maxDepth - 1, queue));
      spidering.add(link);
    }
  }
}

export function spider(url, maxDepth, queue) {
  const filename = urlToFileName(url);

  return exists(filename).then((alreadyExists) => {
    if (alreadyExists) {
      if (!filename.endsWith(".html")) {
        return;
      }
      return readFile(filename, "utf8").then((fileContent) => {
        spiderLinks(url, fileContent, maxDepth, queue);
      });
    }

    return download(url, filename).then((fileContent) => {
      if (filename.endsWith(".html")) {
        return spiderLinks(url, fileContent.toString("utf8"), maxDepth, queue);
      }
      return;
    });
  });
}
