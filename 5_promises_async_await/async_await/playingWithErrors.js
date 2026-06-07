import { delayError } from "./delayError.js"


async function playingWithErrors(throwSyncError){
    try{
        if(throwSyncError){
            throw new Error(`This is asynchronus error.`)
        }
        await delayError(3000)
    }
    catch(err){
        console.log(`we have an error:${err.message}`)
    }
    finally{
        console.log('Done.')
    }
}

playingWithErrors(false)