import { randomBytes } from "node:crypto";

export function promisify(callbackBasedFn) {
  return function promisifiedFn(...args) {
    return new Promise((resolve, reject) => {
      const newArgs = [
        ...args,
        (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve(result);
        },
      ];
      callbackBasedFn(...newArgs);
    });
  };
}

const promisifiedRndmBytes = promisify(randomBytes);

promisifiedRndmBytes(100)
  .then((buffer) => {
    console.log(`received result  in buffer: ${buffer.toString("hex")}`);
  })
  .then(undefined, (err) => {
    console.log("following error occured");
  });

