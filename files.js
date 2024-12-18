const path = require ("path")
const fs = require ("fs")
const pathFront = "./Front"
const url= require("url")
const mimeTypes = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.md': 'text/plain',
    'default': 'application/octet-stream'
}
nameIndex="index.html"

function manageRequest(request, response) {
    let pathName = pathFront + url.parse(request.url).pathname
    if(fs.statSync(pathName).isDirectory()){
        pathName+="/"+nameIndex
    }
    fs.exists(pathName, function(exist){
        if (exist==false) {
            fs.readFile("./404.html",function(error,data){
                if (error){
                    response.end("il y a une erreur le fichier n'est pas lisiblee");
                }
                else{
                    response.setHeader('Content-type',mimeTypes[fileExtension]);
                    response.end(data)
                }
            })
        }
        else {
            fs.readFile(pathName, function(error, data){
                if (error==true){
                    return response.end(`can not read the file`)
                }
                else{
                    const fileExtension = path.parse(pathName).ext
                    const mimeType = mimeTypes[fileExtension]
                    response.setHeader('Content-type', mimeType)
                    response.end(data)
                }
            })
        }
    })

}

exports.manage = manageRequest