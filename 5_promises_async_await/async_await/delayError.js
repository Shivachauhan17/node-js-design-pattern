export function delayError(milliseconds) {
  return new Promise((_resolve, reject) => {
    setTimeout(() => {
      reject(new Error(`Error after ${milliseconds}ms`));
    }, milliseconds);
  });
}


// delayError(3000)
//     .then(
//         result=>console.log(`onFullfilled called with result:${result}`),
//         err=>console.log(`on Rejected Error Received:${err}`)
//     )