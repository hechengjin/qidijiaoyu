function confirmDel(){
  if(window.confirm('你确定要删除吗？')){
    return true;
  }else{
    return false;
  }
}

function recordDelete(recordID){

  if(confirmDel()){
    var postData ={id: recordID};
    var postjsonStr = JSON.stringify(postData);
    $.ajax({
      type: 'POST',
      url: '/recordDelete',
      contentType: "application/json; charset=utf-8",
      data: postjsonStr,
      success: function(data){
        console.log("recordDelete: " + data.username )
        window.location =  '/u/' + data.username;
      },
      error: function (message) {
        console.log("error:" + message)
      }
    });
  }
}

function recordQueryForModify(recordID){
  var postData ={id: recordID};
  var postjsonStr = JSON.stringify(postData);
  $.ajax({
    type: 'POST',
    url: '/recordQueryForModify',
    contentType: "application/json; charset=utf-8",
    data: postjsonStr,
    success: function(data){
      alert(Object.keys(data) + " " + Object.keys(data.post) + " "+ data.post.id );
      window.location = "/publish?post="+data.post;
    },
    error: function (message) {
    },
    //dataType: 'json'
  });
}

