import { Readable } from "node:stream";
import Chance from "chance"; // v1.1.12
const chance = new Chance();
let emittedBytes = 0;
const randomStream = new Readable({
  read(size) {
    const chunk = chance.string({ length: size });
    this.push(chunk, "utf8");
    emittedBytes += chunk.length;
    if (chance.bool({ likelihood: 5 })) {
      this.push(null);
    }
  },
});
