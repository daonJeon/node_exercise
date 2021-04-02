var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

var template = require('./lib/template.js')


var app = http.createServer(function(request,response){
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  if(pathname === '/'){
    if(queryData.id === undefined){
      fs.readdir('./data', function(error, filelist){
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = template.list(filelist);
        var html = template.structure(title, list, `<h2>${title}</h2>${description}`,`<a href="/create">create</a>`);
        response.writeHead(200);
        response.end(html);
      });
    } else {
        fs.readdir('./data', function(error, filelist) {
            fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
                var title = queryData.id;
                var list = template.list(filelist);
                var html = template.structure(title, list, `
                <h2>${title}</h2>${description}`,
                `
                  <a href="/create">create</a> 
                  <a href="/update?id=${title}">update</a> 
                  <form action="delete_process" method="post" onsubmit="">
                    <input type="hidden" name="id" value="${title}">
                    <input type="submit" value="delete">
                  </form>

                `);
                response.writeHead(200);
                response.end(html);
            });
        });     
    }
  } else if(pathname === '/create'){
    fs.readdir('./data', function(error, filelist){
      var title = 'WEB - create';
      var list = template.list(filelist);//이 부분 오타 매서드명 오타 
      var html = template.structure(title, list, `
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
      response.end(html);
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

  } else if(pathname === '/update'){//업데이트 했을 때 보여지는 화면
    fs.readdir('./data', function(error, filelist) {
      fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
          var title = queryData.id;
          var list = template.list(filelist);
          //form 입력 후 데이터를 어디로 보낼 것인가
          var html = template.structure(title, list,          
          `
          <form action="/update_process" method="post">
            <input type="hidden" name="id" value="${title}"><!--업데이트 될 데이터가 쉉될수 있으므로 hidden 에 저장-->
            <p><input type="text" name="title" placeholder="title" value="${title}"></p>
            <p>
              <textarea name="description" placeholder="description">${description}</textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
        `,`<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
        );
          response.writeHead(200);
          response.end(html);
      });
    });   
  } else if(pathname === '/update_process'){
    var body = '';
    //request 객체에 이벤트 리스너를 등록해서 다른 스트림에 파이프로 연결 
    //스트림의 data와 end 이벤트에 이벤트 리스너 등록
    //스트림 : 스트리밍 데이터로 작업하기 위한 추상적인 인터페이스 
    //입 출력 기기나 프로세스, 파일 등 어디로 가는지, 어디에서 왔는지 상관없이 통일된 방식으로 데이터를 다루기 위한 가상의 개념 
    //노드에서 사용하는 많은 오브젝트들이 stream object 임. 
    //http 서버의 request나 process.stdout 도 스트림 인스턴스
    // 스트림들은 읽을 수 있거나 쓸 수 있거나, 혹은 둘다 가능 
    request.on('data',function(data){
      body += data;
    })
    request.on("end",function(){
      var post = qs.parse(body)      
      var id = post.id;
      var title = post.title;
      var description = post.description;

      fs.rename(`data/${id}`,`data/${title}`,function(error){
        fs.writeFile(`data/${title}`, description,'utf8',
        function(err){
          response.writeHead(302, {Location:`/?id=${title}`});
          response.end();
        })     
      })
    })
  } else if(pathname === '/delete_process'){ 
    var body = '';
    request.on('data',function(data){
      body += data;
    })

    request.on("end",function(){
      var post = qs.parse(body)      
      var id = post.id;
      var title = post.title;
      var description = post.description;

      fs.unlink(`data/${id}`,function(error){
        response.writeHead(302, {Location:`/?id=${title}`});
        response.end();   
      })
    })
  } else {
    response.writeHead(404);
    response.end('Not found');
  }



});
app.listen(3000);