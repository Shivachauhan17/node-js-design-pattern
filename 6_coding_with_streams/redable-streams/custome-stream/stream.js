import {Readable} from "node:stream"
import {Chance} from "chance"

const chance=new Chance()

export class RandomStream extends Readable{
    constructor(options){
        super(options)
        this.emittedBytes=0
    }

    _read(size){
        const chunk=chance.string({length:size})
        this.push(chunk,'utf8')//pushes to internal buffer
        this.emittedBytes+=chunk.length
        //terminate with a likelihood of 5
        if(chance.bool({likelihood:5})){
            this.push(null)
        }
    }
}
