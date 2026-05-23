import { urlToFileName } from "../../4_async_pattern_with_callbacks/spider/utils";
import { exists } from "./utils";
import { readFile } from "node:fs/promises";

function spiderLinks(currentUrl, body, maxDepth) {
  let promise = Promise.resolve();
  if (maxDepth === 0) {
    return promise;
  }
  const links = getPageLinks(currentUrl, body);

  for (const link of links) {
    promise = promise.then(() => spider(link, maxDepth - 1));
  }

  return promise;
}

//returning promise chain to the caller
//this just don't  download the file
//but also exposes the content of it to the caller
export function download(url, filename) {
  console.log(`Downloading ${url} into ${filename}`);

  return get(url).then((content) => saveFile(filename, content));
}

export function spider(url, maxDepth) {
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
      return
    });
  });
}
