export function delay(milliseconds) {
    //the executor function passed to the promise constructor
    //will be executed synchronusly as soon as promise is created
    //on contray of this will be the lazy promise
  return new Promise((resolve, _reject) => {
    setTimeout(() => {
      resolve(Date.now());
    }, milliseconds);
  });
}


export async function playingWithDelays(){
    console.log(`Delaying...`,Date.now())

    const timeAfterOneSec=await delay(1000)
    console.log(timeAfterOneSec)
    const timeAfterThreeSeconds=await delay(3000)
    console.log(timeAfterThreeSeconds)
    return 'done'
}


// promise way function call
playingWithDelays()
    .then(value=>{
        console.log(`After 4 seconds: ${value}`)
    })


//I.I.F.E.(Immediately invoked function expression) way
//we used to do it when we didn't had top level await
// (async=>{
//     const result = await playingWithDelays() 
//     console.log(`After 4 seconds: ${result}`)
// })()

//with top level await way
// const result=await playingWithDelays()
// console.log(`After 4 seconds: ${result}`)