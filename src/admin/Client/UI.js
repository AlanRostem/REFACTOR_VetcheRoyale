const UI ={
  createTable(json, props, parent = "body"){
      let table = $("<table class='table table-hover' cellspacing='0' width='100%'/>");
      let thead = $("<thead/>");
      table.append(thead);
      let tr = $("<tr/>");
      thead.append(tr);

      for (let pro of props)
          tr.append($("<th class='th-sm'/>").append(pro));

      let tbody = $("<tbody/>");
      table.append(tbody);

      for (let key in json){
          let tr = $("<tr/>");
          tbody.append(tr);
          for (let pro of props){
              let td = $("<td class='th-sm'/>").append(json[key][pro]);
              tr.append(td);
          }
      }

      $(parent).append(table);
  }
};

export default UI;