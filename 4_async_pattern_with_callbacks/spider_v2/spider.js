import { exists, urlToFileName } from "../spider/utils.js";
import { getPageLinks } from "./utils.js";
import {readFile} from "node:fs"
import{download} from "../cleaned_spider/spider.js"

function spiderLinks(currentUrl, body, maxDepth, cb) {
  console.log("spiderLinks:",{currentUrl,maxDepth})
  
  if (maxDepth === 0) {
    return process.nextTick(cb);
  }

  const links = getPageLinks(currentUrl, body);
  
  if (links.length === 0) {
    return process.nextTick(cb);
  }

  function interate(index) {
    if (index === links.length) {
      return cb();
    }
    spider(links[index], maxDepth - 1, (err) => {
      if (err) {
        return cb(err);
      }
      interate(index + 1);
    });
  }

  interate(0);
}

export function spider(url, maxDepth, cb) {
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
