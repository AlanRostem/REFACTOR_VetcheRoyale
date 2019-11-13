const UI ={
  createTable(json, props, clickable = false, parent = "body"){
      let table = $("<table class='table table-hover table-striped table-bordered' cellspacing='0' width='100%'/>");
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

          if (clickable)
              $(tr).click(function() {
                  window.location = '#' + key;
              });

          for (let pro of props)
              tr.append($("<td class='th-sm'/>").append(json[key][pro]));
      }

      $(parent).append(table);
  }
};

export default UI;