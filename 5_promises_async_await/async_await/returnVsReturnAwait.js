import { delayError } from "./delayError.js";


async function erroNotCaught(){
    try{
        return delayError(1000)
    }
    catch(err){
        console.error('Error caught by the async function:'+err.message)
    }
}


erroNotCaught()
    .catch(err=>console.error(`error caught by the caller:${err.message}`))


async function errorCaught(){
    
}