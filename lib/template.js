module.exports = {
  structure: function (pageTitle, title, list, body, control){
    return `
      <!doctype html>
      <html>
      <head>
      <meta charset="utf-8">
      <title>${pageTitle}</title>
      <link type="text/css" rel="stylesheet" href="./css/style.css"/>
      </head>
      <body>        
        <div id="wrap">
          <div class="main-box">
            <h1 class="main-title">메인<span class="sub">게시판 리스트</span></h1>
              ${list}
            
              ${body}
            
            <div class="btn-group">
              ${control}      
            </div>
          </div>
        </div>
      </body>
      </html>
      `;
  },
  //공지사항 리스트를 table 형태로 불러옵니다.
  list : function (fileInfo) {
    var list = '';
        list += `
        <div class="tbl-type01">
        <table>
          <caption>요청관리 테이블</caption>
            <colgroup>
              <col style="width:16%">
              <col style="width:auto">
              <col style="width:20%">
            </colgroup>
            <thead>
              <tr>
                <th scope="col">구분</th>
                <th scope="col">파일 제목</th>
                <th scope="col">날짜</th>
               </tr>
            </thead>
            <tbody>`
            if (fileInfo.length == 0) list += `<tr><td colspan="3">데이터가 없습니다.</td></tr>`;
            else {
              fileInfo.forEach(function(file,file_i) {
                list += `<tr><td>${file_i+1}</td><td class="left"><a href="/?id=${file.fileName}">${file.fileName}</a></td><td>${file.fileDate}</td></tr>`;
              })
            }
            list +=`</tbody>            
          </table>
          </div>`

    return list;
  }

  
}