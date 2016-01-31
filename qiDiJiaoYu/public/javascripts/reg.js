window.onload=function(){
  $('ul.nav > li').removeClass('active');
  $('#navReg').addClass('active');

  enbaleRegButton(false)
}
function enbaleRegButton( enable ) {
  if( enable ) {
    $('#regButton').removeAttr('disabled');
    showErrorInfo('')
  } else {
    $('#regButton').attr('disabled',"true");
  }
}
function check_email()
{
  var str = $('#email').val();
  var result=str.match(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/);
  if(result==null || str.length <= 0 ){
    showErrorInfo('邮箱地址格式错误！')
    return false;
  }
  enbaleRegButton(true)
  return true;
}
function check_password()
{
  var strPassword = $('#password').val();
  if(strPassword.length <= 4 ){
    showErrorInfo('密码长度不能小于4位！')
    return false;
  }
  var strPassword2 = $('#password-repeat').val();
  if( strPassword !== strPassword2) {
    showErrorInfo('两次输入密码不一致！')
    return false;
  }
  return true;
}

function check_user()
{
  var str = $('#username').val();
  if(str.length <= 4 ){
    showErrorInfo('用户名长度不能小于4位！')
    return false;
  }
  return true;
}

function showErrorInfo(str){
  if( str.length > 0 ){
    document.getElementById("emailInfo").innerHTML = '<p>' + str + '</p>';
    document.getElementById("emailInfo").className = "alert alert-error";
  } else {
    document.getElementById("emailInfo").innerHTML = '';
    document.getElementById("emailInfo").className = "";
  }

}

function check() {
  if( check_user() && check_password() && check_email() ) {
    return true
  }
     return false
}