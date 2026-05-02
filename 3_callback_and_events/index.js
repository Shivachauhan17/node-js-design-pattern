import { EventEmitter } from "node:events";
import { readFile } from "node:fs";
import { get } from "node:https";

// simple observer pattern  implementation to search  for a pattern
//in multiiple files
function findRegex(files, regex) {
  const emitter = new EventEmitter();

  for (const file of files) {
    readFile(file, "utf8", (err, content) => {
      if (err) {
        emitter.emit("error", err);
      }
      emitter.emit("fileread", file);
      try {
        const matches = content.match(regex);
        if (matches) {
          for (let match of matches) {
            emitter.emit("match", file, match);
          }
        }
      } catch (e) {
        emitter.emit("error", e);
      }
    });
  }

  return emitter;
}

// findRegex(["test.txt", "test2.txt"], /\bnoob\b/i)
//   .on("error", (err) =>
//     console.error("while readind th filee error occured:", err),
//   )
//   .on("fileread", (file) => console.log("fileread success: ", file))
//   .on("match", (file, match) =>
//     console.log("found match: ", match, ", in file: ", file),
//   );

//making observable objects via extending event emitters \
class FindRegex extends EventEmitter {
  constructor(regex) {
    super();
    this.regex = regex;
    this.files = [];
  }

  addFile(file) {
    this.files.push(file);
    return this;
  }

  find() {
    for (const file of this.files) {
      readFile(file, "utf8", (err, content) => {
        if (err) {
          this.emit("error", err);
        }
        this.emit("fileread", file);
        try {
          const matches = content.match(this.regex);
          if (matches) {
            for (let match of matches) {
              this.emit("match", file, match);
            }
          }
        } catch (e) {
          this.emit("error", e);
        }
      });
    }
    return this;
  }
}

const findR = new FindRegex(/\bnoob\b/i);

// findR
//   .addFile("test.txt")
//   .addFile("test2.txt")
//   .find()
//   .on("error", (err) =>
//     console.error("while readind th filee error occured:", err),
//   )
//   .on("fileread", (file) => console.log("fileread success: ", file))
//   .on("match", (file, match) =>
//     console.log("found match: ", match, ", in file: ", file),
//   );

//commbining a callback and  a EventEmitter ttoimplement  a progressive dowload of a file
function download(url, cb) {
  const emitter = new EventEmitter();

  const req = get(url, (resp) => {
    const chunks = [];
    let downloadedBytes = 0;

    const fileSize = Number.parseInt(resp.headers["content-length"], 10);

    resp.on("error",(err)=> cb(err));

    resp.on("data", (chunk) => {
      chunks.push(chunk);
      downloadedBytes += chunk.length;
      emitter.emit("progress", downloadedBytes, fileSize);
    });
    resp.on("end", () => {
      const data = Buffer.concat(chunks);
      cb(null, data);
    });
  });

  req.on("error", (err) => {
    console.error("error occured  while making request:", err);
  });

  return emitter;
}

download(
  "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  (err, data) => {
    if (err) {
      console.error("error in the response: ", err);
    }
    console.log("download complete: ", data);
  },
).on("progress", (downloaded, total) => {
  console.log(
    `${downloaded}/${total}` + `(${((downloaded / total) * 100).toFixed(2)}%)`,
  );
});
