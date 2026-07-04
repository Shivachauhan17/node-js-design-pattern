process.stdin
    .on('readable',()=>{
        let chunk
        while((chunk=process.stdin.read())!==null){
            console.log(`Chunk read (${chunk.length} bytes):"${chunk.toString()}"`)
        }
    })
    .on('end',()=>console.log('End of stream'))