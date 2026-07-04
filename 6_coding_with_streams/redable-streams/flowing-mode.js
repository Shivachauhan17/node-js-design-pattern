process.stdin.setEncoding('utf8');

process.stdin
    .on('data',(chunk)=>{
        console.log('new Data available')
        //type will be printed as string instead of object
        console.log(`Chunk read (${chunk.length}) bytes:"${typeof chunk}"`)
    })
    .on('end', () => console.log('End of stream'))