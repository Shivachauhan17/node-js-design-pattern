import { EventEmitter } from "node:events";
import { readFile } from "node:fs";

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
    //if emit would have been synchronus 
    //event would have emittedd before it's handler get registered
    ///it would have been a zalgo condition
    process.nextTick(()=>this.emit("started", this.files));
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

findR
  .addFile("test.txt")
  .addFile("test2.txt")
  .find()
  .on("started", (files) => {
    console.log("file provided in the input are: ", files);
  })
  .on("error", (err) =>
    console.error("while readind th filee error occured:", err),
  )
  .on("fileread", (file) => console.log("fileread success: ", file))
  .on("match", (file, match) =>
    console.log("found match: ", match, ", in file: ", file),
  );
