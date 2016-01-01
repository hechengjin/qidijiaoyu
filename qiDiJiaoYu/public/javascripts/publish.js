function recordAdd(){
  //{title:document.getElementById('title').value,content:document.getElementById('content').value}
//alert(JSON.stringify(subItemsArray))
  //var postData ={title: $("#title").val()};
  //var postjsonStr = JSON.stringify(postData);
  $.ajax({
    type: 'POST',
    url: '/recordAdd',
    data: { title: $("#title").val(), content: $("#content").val(), attachment: $("#attachment").val(),
          remarks: $("#remarks").val() },//, records:JSON.stringify(subItemsArray)
    //data: postjsonStr,
    data: { title: $("#title").val() },
    success: function(data){   },
    dataType: 'text'
  });

}

function AddSubRecord(){
  popupDiv("pop-div");
}
var subItemsArray =[];

function SubRecordSubmit(){
  //alert($("#popTitle").val());
  subItemsArray.push({id:subItemsArray.length+1, title:$("#popTitle").val(),
    content:$("#popContent").val(),
    attachment:$("#popAttachment").val(),
    remarks:$("#popRemarks").val()});
  RefashSubItems();
  hideDiv('pop-div');
}

function RefashSubItems(){
  ClearSubItemsTable();
  for( var i = 0; i < subItemsArray.length; i++ ){
    AddTableRow(subItemsArray[i]);
  }
}

function ClearSubItemsTable(){
  $("#subitemsTable tr:gt(0)").remove();//删除除第一行以为的所有的行
}

function AddTableRow(item)
{
  var subTable = document.getElementById("subitemsTable");   //取得自定义的表对象
  var newRow = subTable.insertRow(subTable.rows.length);                        //添加行
  var newCellID = newRow.insertCell(newRow.cells.length);                     //添加列
  var newCellTitle = newRow.insertCell(newRow.cells.length);
  var newCellContent = newRow.insertCell(newRow.cells.length);
  var newCellAttachment = newRow.insertCell(newRow.cells.length);
  var newCellRemarks = newRow.insertCell(newRow.cells.length);
  newCellID.innerHTML = item.id;          //添加数据
  newCellTitle.innerHTML = item.title.length > 15 ? item.title.substr(0,15) + '...' : item.title;
  newCellContent.innerHTML =  item.content.length > 15 ? item.content.substr(0,15) + '...' : item.content;
  newCellAttachment.innerHTML = item.attachment.length > 15 ? item.attachment.substr(0,15) + '...' : item.attachment;
  newCellRemarks.innerHTML = item.remarks.length > 15 ? item.remarks.substr(0,15) + '...' : item.remarks;
  //NewCell1.class="className";      //设置样式
  //NewCell1.style.height="100px";  //设置样式的高度

}



function popupDiv(div_id) {
  var div_obj = $("#"+div_id);
  var windowWidth = document.documentElement.clientWidth;
  var windowHeight = document.documentElement.clientHeight;
  var popupHeight = div_obj.height();
  var popupWidth = div_obj.width();
//添加并显示遮罩层
  $("<div id='mask'></div>").addClass("mask")
    .width(windowWidth * 0.99)
    .height(windowHeight * 0.99)
    .click(function() {hideDiv(div_id); })
    .appendTo("body")
    .fadeIn(200);
  div_obj.css({"position": "absolute"})
    .animate({left: windowWidth/2-popupWidth/2,
      top: windowHeight/2-popupHeight/2, opacity: "show" }, "slow");
}

function hideDiv(div_id) {
  $("#mask").remove();
  $("#" + div_id).animate({left: 0, top: 0, opacity: "hide" }, "slow");
}