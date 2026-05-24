import { exists, recursiveMkdir, urlToFileName, get } from "../spider/utils.js";
import { writeFile } from "node:fs";
import { dirname } from "node:path";

export function saveFile(filename, content, cb) {
  recursiveMkdir(dirname(filename), (err) => {
    if (err) {
      return cb(err);
    }
    writeFile(filename, content, cb);
  });
}

export function download(url, filename, cb) {
  get(url, (err, content) => {
    if (err) {
      return cb(err);
    }
    //the reason we are wrapping callbacks before passing to the
    //next function in heirachty for the purpose of reusability
    //because we want the next function to deal with only the information
    //which it should be concerned about nothing more than that
    //though computationally it adds a bit of overhead (just microscopic)
    saveFile(filename, content, (err) => {
      if (err) {
        return cb(err);
      }
      cb(null, content);
    });
  });
}

export function spider(url, cb) {
  const filename = urlToFileName(url);

  exists(filename, (err, alreadyExists) => {
    if (err) {
      return cb(err);
    } else if (alreadyExists) {
      return cb(null, filename, false);
    }
    console.log(`Downloading ${url} into ${filename}`);
    download(url, filename, (err) => {
      if (err) {
        return cb(err);
      }
      cb(null, filename, true);
    });
  });
}
