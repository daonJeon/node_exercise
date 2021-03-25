var http = require('http');
var fs = require('fs');
var url = require('url');

var app = http.createServer(function(request,response){
    var __url = request.url;
    var queryData = url.parse(__url,true).query;
    var pathname = url.parse(__url,true).pathname;

    function templateHTML (title,list,body) {
        return `
        <!doctype html>
        <html>
        <head>
        <title>WEB1 - ${title}</title>
        <meta charset="utf-8">
        </head>
        <body>
        <h1><a href="/">WEB</a></h1>
        ${list}
        ${body}
        </p>
        </body>
        </html>
        `
    }

    function templateLIST (fileList) {
        var list = '<ul>'
        for (let list_i = 0; list_i < fileList.length; list_i++) {
            const fileName = fileList[list_i].toUpperCase()
            list += `<li><a href="?id=${fileName}">${fileName}</a></li>`
        }
        list += '</ul>'
        return list;
    }

    if (pathname === '/') {
        if(queryData.id === undefined ) {
            fs.readdir('./data',function(err,fileList){
                var title = 'Welcome'
                var description = "hello Node.js"
                var list = templateLIST (fileList)

                var template = templateHTML(title,list,`<h2>${title}</h2>${description}`)
                response.writeHead(200);
                response.end(template);
            })
            

        } else {
        fs.readFile(`data/${queryData.id}`,'utf-8',function(err,description){
            fs.readdir('./data',function(err,fileList){
                var title = queryData.id;
                var list = templateLIST (fileList)
    
                var template = templateHTML(title,list,description)
                response.writeHead(200);
                response.end(template);
            })
        })  
    }  
    } else {
        response.writeHead(404);
        response.end('Not found');
    }
    


});
app.listen(3000);