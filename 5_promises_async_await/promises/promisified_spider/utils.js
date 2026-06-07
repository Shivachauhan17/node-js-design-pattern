import { constants } from "node:fs";
import { access } from "node:fs/promises";
import { mkdirp } from "mkdirp";
import { join, extname } from "node:path";
import { Parser } from "htmlparser2";
import slug from "slug";

export function exists(filePath) {
  return access(filePath, constants.F_OK)
    .then(() => true)
    .catch((err) => {
      if (err.code == "ENOENT") {
        return false;
      }
      throw err;
    });
}

export function get(url) {
  return (
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Failed to fetch ${response.url}:${response.statusText}`,
          );
        }

        return response.arrayBuffer();
      })
      //each promise can execute differently for example
      //this one executes synchronusly when promise2 is fullfilled
      .then((content) => Buffer.from(content))
  );
}

export function urlToFilename(url) {
  const parsedUrl = new URL(url);
  const urlComponents = parsedUrl.pathname.split("/");
  const originalFileName = urlComponents.pop();
  const urlPath = urlComponents
    .filter((component) => component !== "")
    .map((component) => slug(component, { remove: null }))
    .join("/");
  const basePath = join(parsedUrl.hostname, urlPath);
  const missingExtension =
    !originalFileName || extname(originalFileName) === "";
  if (missingExtension) {
    return join(basePath, originalFileName, "index.html");
  }

  return join(basePath, originalFileName);
}

export const recursiveMkdir = mkdirp;

export function getPageLinks(currentUrl, body) {
  const url = new URL(currentUrl);
  const internalLinks = [];
  const parser = new Parser({
    onopentag(name, attribs) {
      if (name === "a" && attribs.href) {
        const newUrl = new URL(attribs.href, url);
        if (
          newUrl.hostname === url.hostname &&
          newUrl.pathname !== url.pathname
        ) {
          internalLinks.push(newUrl.toString());
        }
      }
    },
  });
  parser.end(body);

  return internalLinks;
}
