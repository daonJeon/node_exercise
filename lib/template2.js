module.exports = {
  structure: function (fileNum,title, date, subtitle, imgSrc, description, sourceChk, sourceName){
    return `     
    <div class="tbl type2">
    <table>
        <caption></caption>
        <colgroup>
            <col style='width:auto'/>
            <col style='width:18%'/>
        </colgroup>
        <thead>
            <tr>
                <th scope='col'><strong>${title}</strong></th>
                <th scope='col' class="txt-c">${date}</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="news-cnt" colspan="2">
                    <div class="pop-cnt">
                        <p class="mb15">
                            <strong>${subtitle}</strong>
                        </p>
                        <p class="img"><img src="/pc/images/news/img_news-${fileNum}.png" alt="${imgSrc}"></p>
                    </div>

                    <div class="pop-cnt">
                    <pre>
                    ${description}
                    </pre>
                    ${sourceChk.length>0? "<strong>■ 관련 이미지 및 기사 출처 :"+ sourceName +"</strong>":""}
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
</div>
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
            fileInfo.forEach(function(file,file_i) {
                list += `<tr><td>${file_i+1}</td><td class="left"><a href="/?id=${file.fileName}">${file.fileName}</a></td><td>${file.fileDate}</td></tr>`;
              })
            list +=`</tbody>            
          </table>
          </div>`

    return list;
  }

  
}