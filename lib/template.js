module.exports = {
    structure: function (title, list, body, control){
      return `
        <!doctype html>
        <html>
        <head>
        <title>WEB2 - ${title}</title>
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
    },
    list : function (filelist) {
      var list = '<ul>';
      for (var list_i = 0; list_i < filelist.length; list_i++) {    
        list += `<li><a href="/?id=${filelist[list_i]}">${filelist[list_i]}</a></li>`;
      }
      list += '</ul>';
      return list;
    }
  
    
  }