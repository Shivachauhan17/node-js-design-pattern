import { delay } from "../promises/delay.js"


export async function playingWithDelays(){
    console.log(`Delaying...`,Date.now())

    const timeAfterOneSec=await delay(1000)
    console.log(timeAfterOneSec)
    const timeAfterThreeSeconds=await delay(3000)
    console.log(timeAfterThreeSeconds)
    return 'done'
}


//promise way function call
// playingWithDelays()
//     .then(value=>{
//         console.log(`After 4 seconds: ${value}`)
//     })


//I.I.F.E. way
// (async=>{
//     const result = await playingWithDelays() 
//     console.log(`After 4 seconds: ${result}`)
// })()

//with top level await way
const result=await playingWithDelays()
console.log(`After 4 seconds: ${result}`)