window.onload=function(){
  if(isModOper()) {
    initModInfo();
  }

}

var subRecordModIndex = -1;

function isModOper(){
  if(typeof post === "object" && post !== undefined) {
    return true;
  }
  return false;
}


function initModInfo() {
  $("#title").val(post.title);
  $("#content").val(post.content);
  $("#attachment").val(post.attachment);
  $("#remarks").val(post.remarks);
  subItemsArray = post.records;
  RefashSubItems();
}



function recordPublish(){
  var contentTransformation =  $("#content").val().replace(/\r\n/g,"<br>").replace(/\n/g,"<br>").replace(/\n/g,"<br>").replace(/ /g, "&nbsp;").replace("/\t/g", "&nbsp;&nbsp;&nbsp;&nbsp;").replace(/\"/g, "");
  var postData ={id:post.id, title: $("#title").val(), content:contentTransformation, attachment:$("#attachment").val(), remarks: $("#remarks").val(), records:subItemsArray};
  var postjsonStr = JSON.stringify(postData);

  if( isModOper() ) { //修改操作
    $.ajax({
      type: 'POST',
      url: '/recordModify',
      //contentType:'application/json',
      contentType: "application/json; charset=utf-8",
      data: postjsonStr,
      success: function(data){
        console.log("recordModify success:"  + data.username)
        window.location =  '/u/' + data.username;
      },
      error: function (message) {
      },
      dataType: 'json'
    });
  } else {  //添加操作
    $.ajax({
      type: 'POST',
      url: '/recordAdd',
      //contentType:'application/json',
      contentType: "application/json; charset=utf-8",
      //Content-Type: 'application/json',
      //data: { title: $("#title").val(), content: $("#content").val(), attachment: $("#attachment").val(),
      //      remarks: $("#remarks").val() },//, records:JSON.stringify(subItemsArray)
      data: postjsonStr,
      success: function(data){
        window.location =  '/u/' + data.username;
      },
      error: function (message) {
      },
      dataType: 'json'
    });
  }
}

function AddSubRecord(){
  subRecordModIndex = -1;
  popupDiv("pop-div");
}

var subItemsArray =[];

function SubRecordSubmit(){
  var contentTransformation = $("#popContent").val().replace(/\r\n/g,"<br>").replace(/\n/g,"<br>").replace(/\n/g,"<br>").replace(/ /g, "&nbsp;").replace("/\t/g", "&nbsp;&nbsp;&nbsp;&nbsp;").replace(/\"/g, "");
  console.log(contentTransformation)
  if( subRecordModIndex === -1 ){ //添加
    var maxId = 0;
    if( subItemsArray.length > 0 ){
      var subItemsIdArray = subItemsArray.map(x => x.id);
      maxId = Math.max.apply(null, subItemsIdArray);
    }

    subItemsArray.push({id:maxId+1, title:$("#popTitle").val(),
      content:contentTransformation,
      attachment:$("#popAttachment").val(),
      remarks:$("#popRemarks").val()});
  } else { //修改
    subItemsArray[subRecordModIndex].title = $("#popTitle").val();
    subItemsArray[subRecordModIndex].content = contentTransformation;
    subItemsArray[subRecordModIndex].attachment = $("#popAttachment").val();
    subItemsArray[subRecordModIndex].remarks = $("#popRemarks").val();
  }

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


function itemModify(itemid){
  AddSubRecord();

  var itemIndex = subItemsArray.findIndex(function(value, index, arr) {
    return value.id == itemid;
  });
  subRecordModIndex = itemIndex;
  if( itemIndex !== -1 ){
    $("#popTitle").val(subItemsArray[itemIndex].title);
    $("#popContent").val(subItemsArray[itemIndex].content);
    $("#popAttachment").val(subItemsArray[itemIndex].attachment);
    $("#popRemarks").val(subItemsArray[itemIndex].remarks);
  }
}

function itemDelete(itemid){
  var itemIndex = subItemsArray.findIndex(function(value, index, arr) {
    return value.id == itemid;
  });

  if( itemIndex !== -1 ){
    subItemsArray.splice(itemIndex,1);
  }
  RefashSubItems();
}

function AddTableRow(item)
{
  var subTable = document.getElementById("subitemsTable");   //取得自定义的表对象
  var newRow = subTable.insertRow(subTable.rows.length);                        //添加行
  //newRow.onclick = selCurRow(newRow);
  var newCellID = newRow.insertCell(newRow.cells.length);                     //添加列
  var newCellTitle = newRow.insertCell(newRow.cells.length);
  var newCellContent = newRow.insertCell(newRow.cells.length);
  var newCellAttachment = newRow.insertCell(newRow.cells.length);
  var newCellRemarks = newRow.insertCell(newRow.cells.length);
  var newCellOperatorMod = newRow.insertCell(newRow.cells.length);
  var newCellOperatorDel = newRow.insertCell(newRow.cells.length);
  newCellID.innerHTML = item.id;          //添加数据
  newCellTitle.innerHTML = item.title.length > 15 ? item.title.substr(0,15) + '...' : item.title;
  newCellContent.innerHTML =  item.content.length > 15 ? item.content.substr(0,15) + '...' : item.content;
  newCellAttachment.innerHTML = item.attachment.length > 15 ? item.attachment.substr(0,15) + '...' : item.attachment;
  newCellRemarks.innerHTML = item.remarks.length > 15 ? item.remarks.substr(0,15) + '...' : item.remarks;

  newCellOperatorMod.innerHTML = "<button class='btn btn-success' >修改</button>";
  newCellOperatorMod.getElementsByTagName('button')[0].onclick = function () {
    var tr=$(this).parents('tr');
    //alert(tr.html());
    var rowNum = $('tr').index(tr);
    var colNum = 0; //tr.find('td').index($(this).parents('td'));
    //var value = $('#subitemsTable').rows[rowNum].cells[colNum].innerHTML;
    var value = document.getElementById("subitemsTable").rows[rowNum].cells[colNum].innerText;
    itemModify(value);
    //subTable.tBodies[0].removeChild(this.parentNode.parentNode);
  }
  newCellOperatorMod.style.width="60px";

  newCellOperatorDel.innerHTML = "<button class='btn btn-success' >删除</button>";
  newCellOperatorDel.getElementsByTagName('button')[0].onclick = function () {
    var tr=$(this).parents('tr');
    //alert(tr.html());
    var rowNum = $('tr').index(tr);
    var colNum = 0; //tr.find('td').index($(this).parents('td'));
    //var value = $('#subitemsTable').rows[rowNum].cells[colNum].innerHTML;
    var value = document.getElementById("subitemsTable").rows[rowNum].cells[colNum].innerText;
    itemDelete(value);
    //subTable.tBodies[0].removeChild(this.parentNode.parentNode);
  }
  newCellOperatorDel.style.width="60px";



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