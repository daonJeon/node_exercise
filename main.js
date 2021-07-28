var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var path = require('path')

var template = require('./lib/template.js')
var template2 = require('./lib/template2.js')
var mimeType = {//확장자에 따라서 content-type header 값을 동적으로 생성
  //html  단일 페이지 뿐만 아니라 모든 정적요소 불러오기 위함
  ".ico": "image/x-icon",
  ".html": "text/html",
  ".txt ": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".png": "image/png",
  ".jpg": "image/jpeg"
}

var app = http.createServer(function(request,response){
  var _url = request.url;
  var ext = path.parse(_url).ext
  var publicPath = path.join(__dirname, "./public")
  
  if(Object.keys(mimeType).includes(ext)) {//mine Type 딕셔너리로 있을 경우
    fs.readFile(`${publicPath}${_url}`,(err,data)=> {
      if(err) {
        response.statusCode = 404;
        response.end('Not found')
      } else {
        response.statusCode = 200
        response.setHeader("Content-Type", mimeType[ext])//응답을 화면으로 보여줌
        response.end(data)
      }
    })
    
  } else {
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      if(queryData.id === undefined){//첫화면 
        fs.readdir('./data', function(error, filelist){
          var pageTitle = 'Main';
          var title = '클릭한 공지사항 제목이 보입니다';
          var description = '클릭한 공지사항 내용이 보입니다. ';
          var fileInfo= []
          
          if(filelist== undefined) return 
          else {
            filelist.forEach(function(file) {
              fs.stat('./data/' + file, function (err, stats) {     
                createDate = new Date( stats.birthtimeMs );
                fileInfo.push({ fileDate:createDate.ymdhms(), fileName:file });
              })  
            });

            setTimeout(function(){
              var list = template.list(fileInfo);
              var html = template.structure(pageTitle, title, list, 
              `<div class="content"><h2>${title}</h2>${description}</div>`,
              `<a href="/create" class="btn blue">create</a>`);

              response.writeHead(200);
              response.end(html);
            },10)
            
          }
          
        });
      } else {
        fs.readdir('./data', function(error, filelist) {
          console.log(path.parse(queryData.id))
          var filteredId = path.parse(queryData.id).base          

            fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
              console.log(queryData.id)
                var fileNum = queryData.id;                
                var title = filteredId
                var fileInfo= []
          
                filelist.forEach(function(file) {
                  fs.stat('./data/' + file, function (err, stats) {                          
                    createDate = new Date( stats.birthtimeMs );
                    fileInfo.push({ fileDate:createDate.ymdhms(), fileName:file });
                  })
        
                  setTimeout(function(){
                    var list = template.list(fileInfo);
                    var html = template.structure(title, list, `
                    <div class="content">
                    <h2>${title}</h2>
                    <pre>
                    ${description}
                    </pre>
                    </div>`,
                    `
                      <a href="/create" class="btn blue">create</a> 
                      <a href="/update?id=${fileNum}" class="btn blue">update</a> 
                      <form action="delete_process" method="post" onsubmit="" class="inlineForm">
                        <input type="hidden" name="id" value="${title}">
                        <input type="submit" class="btn blue" value="delete">
                      </form>
      
                    `);
                    
                    response.writeHead(200);
                    response.end(html);
                  },100)
                });

            });
          });     
      }
    } else if(pathname === '/create'){
      fs.readdir('./data', function(error, filelist){
        var pageTitle = 'Notice create'; 
        var title = 'Notice - create';        
        var fileInfo= []
        
        if(filelist.length > 0 ){
          filelist.forEach(function(file) {
            fs.stat('./data/' + file, function (err, stats) {
              createDate = new Date( stats.birthtimeMs );
              fileInfo.push({ fileDate:createDate.ymdhms(), fileName:file });
            })
          });           
        }
        setTimeout(function(){
          var list = template.list(fileInfo);
          var html = template.structure(pageTitle, title, list, `
          <form action="/create_process" method="post">
            <div class="input-area">
              <div class="inp-txt">
                <input type="text" title="등록 넘버" name="fileNum" placeholder="등록 넘버">
              </div>          
              <div class="inp-txt">
                <input type="text" title="글제목" name="title" placeholder="기사 제목 입력">
              </div>          
              <div class="inp-txt">
                <input type="text" title="날짜" name="date" placeholder="기사 발행 날짜 입력">
              </div>                            
              <div class="inp-txt">
                <input type="text" title="날짜" name="subtitle" placeholder="소제목 입력">
              </div>                            
              <div class="inp-txt">
                <input type="text" title="이미지소스" name="imgSrc" placeholder="이미지소스">
              </div>                            

              <textarea name="description" id="" class="textarea" title="글 내용" placeholder="기사 내용 입력"></textarea>            
              <span class="inp-chk">
                <input type="checkbox" id="chk1" class="check" name="sourceChk">
                <label for="chk1">출처 보이기</label>
              </span>
              <span class="inp-txt">
                <input type="text" name="sourceName">
              </span>
              <input type="submit" class="btn blue" value="공지사항 등록">    
              </div>
            </div>
            </form>
              `,``);
          
          response.writeHead(200);
          response.end(html);
        },100)
        
      })
    } else if(pathname === '/create_process'){//Post 방식으로 보낸 데이터를 Node js에서 불러오기!!
      var body = '';
      request.on('data',function(data){//
          body += data;
      })//node js로 접속 들어올때마다 콜백 함수로 node 호출
      request.on('end',function(){          
          var post = qs.parse(body);
          var fileNum = post.fileNum;
          var title = post.title;
          var date = post.date;
          var subtitle = post.subtitle;
          var imgSrc = post.imgSrc;
          var description = post.description;
          console.log(sourceChk)
          var sourceChk = post.sourceChk;
          var sourceName = post.sourceName;
          var html = template2.structure(fileNum,title, date, subtitle, imgSrc, description, sourceChk, sourceName);
          fs.writeFileSync(`data/news-cnt-${fileNum}`,`${html}`,'utf8',
          function(err){
            response.writeHead(302, {Location:`/?id=news-cnt-${fileNum}`});
            response.end(html);
          })      
      })
  
    } else if(pathname === '/update'){//업데이트 했을 때 보여지는 화면
      fs.readdir('./data', function(error, filelist) {
        var filteredId = path.parse(queryData.id).base
        fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
            var pageTitle = 'Notice Update';
            var title = queryData.id;
            var fileInfo= []
            filelist.forEach(function(file) {
              fs.stat('./data/' + file, function (err, stats) {                          
                createDate = new Date( stats.birthtimeMs );
                fileInfo.push({ fileDate:createDate.ymdhms(), fileName:file });
              })
    
              setTimeout(function(){
                var list = template.list(fileInfo);
                var fileNum = post.fileNum;
                var title = post.title;
                var date = post.date;
                var subtitle = post.subtitle;
                var description = post.description;

                var html = template2.structure(pageTitle, title, list,          
                  `
                  <form action="/update_process" method="post">
                    <input type="hidden" name="id" value="${fileNum}">
                    <div class="input-area">
                    <div class="inp-txt">
                      <input type="text" title="글제목" name="title" placeholder="기사 제목 입력" value="${title}">
                      </div>          
                      <textarea name="description" id="" class="textarea" title="글 내용" placeholder="기사 내용 입력">${description}</textarea>
                      <input type="submit" class="btn blue" value="공지사항 수정">    
                    </div>
                  </div>
                  </form>
                `,``);
                
                response.writeHead(200);
                response.end(html);
              },100)
            });
            //form 입력 후 데이터를 어디로 보낼 것인가
            
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
        var fileNum = post.fileNum;
        var title = post.title;
        var date = post.date;
        var subtitle = post.subtitle;
        var description = post.description;
  
        fs.rename(`data/${fileNum}`,`data/${title}`,function(error){
          fs.writeFile(`data/${fileNum}`, description,'utf8',
          function(err){
            response.writeHead(302, {Location:`/?id=${fileNum}`});
            response.end();
          })     
        })
      })
    } else if(pathname === '/delete_process'){ 
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          var id = post.id;
          var filteredId = path.parse(id).base;
          fs.unlink(`data/${filteredId}`, function(error){
            response.writeHead(302, {Location: `/`});
            response.end();
          })
      });
  
    } else {
      response.writeHead(404);
      response.end('Not found');
    }
    
  }
 
  Date.prototype.ymdhms = function() {
    var year = this.getFullYear().toString();        
    var month = (this.getMonth() + 1).toString();        
    var date = this.getDate().toString();        
    return `${year}/${month[1] ? month : "0" + month[0]}/${date[1] ? date : "0" + date[0]}`;    
 }

});
app.listen(3000);
