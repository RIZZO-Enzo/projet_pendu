const files = require("./files.js")
const api = require("./api.js")
const http = require("http")

http.createServer(function(request, response) {
    var urlRequest = request.url 
    const urlSplit = urlRequest.split('/')

    if (urlSplit [1]=="favicon.ico"){
        response.writeHead(200,{"Content-Type":"image/x-icon"})
        response.end()
        return
    }
    if (urlSplit[1]=="api") api.manage(request, response )
    else files.manage(request, response )
}).listen(8000)

