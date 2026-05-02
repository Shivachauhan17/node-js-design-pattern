import { EventEmitter } from "node:events";

function ticker(num, cb) {
  const emitter = new EventEmitter();
  let count = 0;
  const start = Date.now();

  function play() {
    const now = Date.now();
    const elapsedtime = now-start;
    if (elapsedtime >= num) {
      return cb(count);
    } else {
      setTimeout(() => {
        emitter.emit("tick",elapsedtime);
        count++;
        play();
      }, 50);
    }
  }

  //just giving time to handlers to be registered
  process.nextTick(play)

  return emitter;
}

ticker(200, (count) => {
  console.log("Total time called:", count);
}).on("tick", (elapsedtime) => {
  console.log("elapsed timeP:", elapsedtime);
});
