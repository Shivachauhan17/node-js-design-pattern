import { Parser } from "htmlparser2"


export function getPageLinks(currentUrl,body){
    
    const url=new URL(currentUrl)
    const internalLinks=[]
    const parser=new Parser({
        onopentag(name,attribs){
            if(name==="a" && attribs.href){
                const newUrl=new URL(attribs.href,url)
                if(
                    newUrl.hostname===url.hostname &&
                    newUrl.pathname!==url.pathname
                ){
                    internalLinks.push(newUrl.toString())
                }
            }
        }
    })
    parser.end(body)
    return internalLinks
}