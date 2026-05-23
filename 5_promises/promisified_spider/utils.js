import { constants } from "node:fs";
import { access } from "node:fs/promises";

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
  return fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error(`Failed to fetch ${response.url}:${response.statusText}`);
    }

    return response.arrayBuffer()
  })
  .then(content=>Buffer.from(content))
}
