import { exists, urlToFileName } from "../spider/utils.js";
import { getPageLinks } from "../spider_v2/utils.js";
import { readFile } from "node:fs";
import { download } from "../cleaned_spider/spider.js";

const spidering = new Set();

function spiderLinks(currentUrl, body, maxDepth, cb) {
  console.log("spiderLinks:", { currentUrl, maxDepth });

  if (maxDepth === 0) {
    return process.nextTick(cb);
  }

  const links = getPageLinks(currentUrl, body);

  if (links.length === 0) {
    return process.nextTick(cb);
  }

  let completed = 0;
  let hasErros = false;

  function done(err) {
    if (err) {
      hasErros = true;
      return cb(err);
    }
    if (++completed === links.length && !hasErros) {
      return cb();
    }
  }

  for (const link of links) {
    spider(link, maxDepth - 1, done);
  }
}

export function spider(url, maxDepth, cb) {
  if (spidering.has(url)) {
    return process.nextTick(cb);
  }
  spidering.add(url);

  const filename = urlToFileName(url);

  //race condition may occur here
  exists(filename, (err, alreadyExists) => {
    if (err) {
      return cb(err);
    }
    if (alreadyExists) {
      if (!filename.endsWith(".html")) {
        return cb();
      }
      return readFile(filename, "utf8", (err, fileContent) => {
        if (err) {
          return cb(err);
        }
        return spiderLinks(url, fileContent, maxDepth, cb);
      });
    }

    download(url, filename, (err, fileContent) => {
      if (err) {
        return cb(err);
      }
      if (filename.endsWith(".html")) {
        return spiderLinks(url, fileContent.toString("utf8"), maxDepth, cb);
      }
      return cb();
    });
  });
}
