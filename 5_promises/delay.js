function delay(milliseconds) {
    //the executor function passed to the promise constructore
    //will be executed synchronusly as soon as promise is created
    //on contray of this will be the lazy promise
  return new Promise((resolve, _reject) => {
    setTimeout(() => {
      resolve(Date.now());
    }, milliseconds);
  });
}

console.log(`start time: ${Date.now()}`)
delay(3000).then((dt)=>{
    console.log(`datetime when promise resolved: ${dt}`)
})