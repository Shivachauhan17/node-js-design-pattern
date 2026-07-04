import { createServer } from "node:http";
import Chance from "chance";

const  CHUNK_SIZE=16*1024-1

const chance=Chance()
const server = createServer((_req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    let backPressureCount=0
    let byteSent=0
    function generateMore(){
        do{
            const randomChunk=chance.string({length:CHUNK_SIZE})
            const shouldContinue=res.write(`${randomChunk}\n`)
            byteSent+=CHUNK_SIZE
            if(!shouldContinue){
                console.warn(`back-pressure ${++backPressureCount}`)
                return res.once('drain', generateMore)
            }
        }while (chance.bool({ likelihood: 95 }))
        res.end('\n\n')
    }
    generateMore()
    res.on("finish", () => console.log("All data sent"));
});

const port = 3000;

server.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
});
