import { exists, urlToFileName } from "../spider/utils.js";
import { getPageLinks } from "../spider_v2/utils.js";
import { readFile } from "node:fs";
import { download } from "../cleaned_spider/spider.js";

const spidering=new Set()

export function spider(url,maxDepth,queue){
  if(spidering.has(url)){
    return
  }

  spidering.add(url)
  queue.pushTask(done=>{
    spiderTask(url,maxDepth,queue,done)
  })

}

function spiderLinks(currentUrl, body, maxDepth, queue) {
  if (maxDepth === 0) {
    return;
  }

  const links = getPageLinks(currentUrl, body);
  if (links.length === 0) {
    return;
  }
  for (const liunk of links) {
    spider();
  }
}

function spiderTask(url, maxDepth, queue, cb) {
  const filename = urlToFileName(url);

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
        spiderLinks(url, fileContent, maxDepth, queue);
        return cb();
      });
    }

    download(url, filename, (err, fileContent) => {
      if (err) {
        return cb(err);
      }

      if (filename.endsWith(".html")) {
        spiderLinks(url, fileContent.toString("utf8"), maxDepth, queue);
        return cb();
      }

      return cb();
    });
  });
}
