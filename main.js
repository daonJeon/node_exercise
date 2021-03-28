var http = require("http");
var fs = require("fs");
var url = require("url");

function templateHTML(title, list, body) {
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
    <a href="/create">create</a>
    ${body}
    </body>
    </html>
    `;
}

function templateLIST(fileList) {
  var list = "<ul>";
  for (let list_i = 0; list_i < fileList.length; list_i++) {
    const fileName = fileList[list_i].toUpperCase();
    list += `<li><a href="?id=${fileName}">${fileName}</a></li>`;
  }
  list += "</ul>";
  return list;
}

var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;

  if (pathname === "/") {
      console.log(pathname)
    if (queryData.id === undefined) {
      fs.readdir("./data", function (err, fileList) {
        var title = "Welcome";
        var description = "hello Node.js";
        var list = templateLIST(fileList);

        var template = templateHTML(
          title,
          list,
          `<h2>${title}</h2>${description}`
        );
        response.writeHead(200);
        response.end(template);
      });
    } else {
        fs.readdir("./data", function (err, fileList) {
            fs.readFile(`data/${queryData.id}`, "utf-8", function (err, description) {
                var title = queryData.id;
                var list = templateLIST(fileList);
    
                var template = templateHTML(title, list, `<h2>${title}</h2>${description}`);
                response.writeHead(200);
                response.end(template);
            });
        });
     
    }
  } else if(pathname === '/create'){
    fs.readdir("./data", function (error, filelist) {
      var title = "WEB - create";
      var list = templateList(filelist);
      var template = templateHTML(
        title,
        list,
        `
          <form action="http://localhost:3000/process_create" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
        `
      );
      response.writeHead(200);
      response.end(template);
    });
  } else {
    response.writeHead(404);
    response.end("Not found");
  }
});
app.listen(3000);
