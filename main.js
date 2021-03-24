var http = require('http');
var fs = require('fs');
var url = require('url');

var app = http.createServer(function(request,response){
    var __url = request.url;
    var queryData = url.parse(__url,true).query;
    var pathname = url.parse(__url,true).pathname;


    if (pathname === '/') {
        if(queryData.id === undefined ) {
            fs.readdir('./data',function(err,fileList){
                var title = 'Welcome'
                var description = "hello Node.js"
                var list = '<ul>'
                for (let list_i = 0; list_i < fileList.length; list_i++) {
                    const fileName = fileList[list_i].toUpperCase()
                    list += `<li><a href="?id=${fileName}">${fileName}</a></li>`
                }
                list += '</ul>'

                var template = `
                <!doctype html>
                <html>
                <head>
                <title>WEB1 - ${title}</title>
                <meta charset="utf-8">
                </head>
                <body>
                <h1><a href="/">WEB</a></h1>
                ${list}
                
                <h2>${title}</h2>
                <p><a href="https://www.w3.org/TR/html5/" target="_blank" title="html5 speicification">
                <img src="coding.jpg" width="100%">
                </p><p style="margin-top:45px;">
                ${description}
                </p>
                </body>
                </html>
                `;
                response.writeHead(200);
                response.end(template);
            })
            

        } else {
        fs.readFile(`data/${queryData.id}`,'utf-8',function(err,description){
            var title = queryData.id;
            var template = `
            <!doctype html>
            <html>
            <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
            </head>
            <body>
            <h1><a href="/">WEB</a></h1>
            <ol>
                <li><a href="?id=html">HTML</a></li>
                <li><a href="?id=css">CSS</a></li>
                <li><a href="?id=JavaScript">JavaScript</a></li>
            </ol>
            <h2>${title}</h2>
            <p><a href="https://www.w3.org/TR/html5/" target="_blank" title="html5 speicification">Hypertext Markup Language (HTML)</a> is the standard markup language for <strong>creating <u>web</u> pages</strong> and web applications.Web browsers receive HTML documents from a web server or from local storage and render them into multimedia web pages. HTML describes the structure of a web page semantically and originally included cues for the appearance of the document.
            <img src="coding.jpg" width="100%">
            </p><p style="margin-top:45px;">
            ${description}
            </p>
            </body>
            </html>
            `;
            response.writeHead(200);
            response.end(template);
        })  
    }  
    } else {
        response.writeHead(404);
        response.end('Not found');
    }
    


});
app.listen(3000);