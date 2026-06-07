import { readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import {
  recursiveMkdir,
  exists,
  get,
  getPageLinks,
  urlToFilename,
} from "../promisified_spider/utils.js";

const spidering = new Set();

function spiderLinks(currentUrl, body, maxDepth, queue) {
  if (maxDepth === 0) {
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

function saveFile(filename, content) {
  return recursiveMkdir(dirname(filename))
    .then(() => writeFile(filename, content))
    .then(() => content);
  // we don't need this catch because if writeFile throws error
  //then's in between are already skipped javascript will automatically pass
  //it to the catch in last
}

//returning promise chain to the caller
//this just don't  download the file
//but also exposes the content of it to the caller
export function download(url, filename) {
  console.log(`Downloading ${url} into ${filename}`);

  return get(url).then((content) => saveFile(filename, content));
}

export function spider(url, maxDepth, queue) {
  const filename = urlToFilename(url);

  return exists(filename).then((alreadyExists) => {
    if (alreadyExists) {
      if (!filename.endsWith(".html")) {
        return;
      }
      return readFile(filename, "utf8").then((fileContent) =>
        spiderLinks(url, fileContent, maxDepth, queue),
      );
    }

    return download(url, filename).then((fileContent) => {
      if (filename.endsWith(".html")) {
        return spiderLinks(url, fileContent.toString("utf8"), maxDepth, queue);
      }
      return;
    });
  });
}
