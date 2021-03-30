var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

function templateHTML(title, list, body, control){
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
    ${control}
    ${body}
    </body>
    </html>
    `;
}

function templateLIST(filelist) {
  var list = '<ul>';
  for (var list_i = 0; list_i < filelist.length; list_i++) {    
    list += `<li><a href="/?id=${filelist[list_i]}">${filelist[list_i]}</a></li>`;
  }
  list += '</ul>';
  return list;
}

var app = http.createServer(function(request,response){
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  if(pathname === '/'){
    if(queryData.id === undefined){
      fs.readdir('./data', function(error, filelist){
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = templateLIST(filelist);
        var template = templateHTML(title, list, `<h2>${title}</h2>${description}`,`<a href="/create">create</a>`);
        response.writeHead(200);
        response.end(template);
      });
    } else {
        fs.readdir('./data', function(error, filelist) {
            fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
                var title = queryData.id;
                var list = templateLIST(filelist);
                var template = templateHTML(title, list, `
                <h2>${title}</h2>${description}`,`<a href="/create">create</a> <a href="/update?id=${title}">update</a>`);
                response.writeHead(200);
                response.end(template);
            });
        });     
    }
  } else if(pathname === '/create'){
    fs.readdir('./data', function(error, filelist){
      var title = 'WEB - create';
      var list = templateLIST(filelist);//이 부분 오타 매서드명 오타 
      var template = templateHTML(title, list, `
          <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
        `,``);
      response.writeHead(200);//성공
      response.end(template);
    });
  } else if(pathname === '/create_process'){//Post 방식으로 보낸 데이터를 Node js에서 불러오기!!
    var body = '';
    request.on('data',function(data){//
        body += data;
    })//node js로 접속 들어올때마다 콜백 함수로 node 호출
    request.on('end',function(){
        var post = qs.parse(body);
        var title = post.title;
        var description = post.description;
        fs.writeFile(`data/${title}`, description,'utf8',
        function(err){
          response.writeHead(302, {Location:`/?id=${title}`});
          response.end();
        })      
    })

  } else if(pathname === '/update'){
    fs.readdir('./data', function(error, filelist) {
      fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
          var title = queryData.id;
          var list = templateLIST(filelist);
          //form 입력 후 데이터를 어디로 보낼 것인가
          var template = templateHTML(title, list, `
          <h2>${title}</h2>${description}`,
          `
          <form action="/update_process" method="post">
            <input type="hidden" name="id" value="${title}">
            <p><input type="text" name="title" placeholder="title" value="${title}"></p>
            <p>
              <textarea name="description" placeholder="description">${description}</textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
        `);
          response.writeHead(200);
          response.end(template);
      });
    });   
  }else {
    response.writeHead(404);
    response.end('Not found');
  }



});
app.listen(3000);