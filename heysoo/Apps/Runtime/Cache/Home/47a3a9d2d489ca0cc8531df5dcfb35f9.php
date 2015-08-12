<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>登录</title>
<link rel="stylesheet" href="/ThinkPHP/Public/css/bootstrap/bootstrap.min.css"/>
<link rel="stylesheet" href="/ThinkPHP/Public/css/font-awesome/css/font-awesome.min.css"/>
<link rel="stylesheet" href="/ThinkPHP/Public/css/login.css"/>
</head>
<style>
body{ background-image:url("/ThinkPHP/Public/img/login_bg.jpg"); }
</style>
<body>

<div class="bg">
<div class="login_panel">
<div id="avatar">
<img class="avatar_img" src="/ThinkPHP/Public/img/lion.png"/>
</div>
<div class="title">Heysoo</div>
<div class="signature"></div>
<form action="<?php echo U('Action/do_login');?>" class="login_form" method="post">

<div class="input-group">
<span class="input-group-addon">用户名</span>
<input class="userName form-control" name="userName"  type="text" placeholder="用户名" title="用户名">
</div>

<div class="input-group">
<span class="input-group-addon">密码</span>
<input class="passwd form-control"  name="passwd" type="password" placeholder="密码" title="密码">
</div>

<?php if($verify_code_on == true): ?><div class="input-group">
<span class="input-group-addon">验证码</span>
<input class="verify_code form-control" name="verify_code"  type="text" placeholder="请填写以下验证码" title="验证码">
</div>
<div class="verify_code">
	<img class="verify_code_img" src="<?php echo U('Action/create_verify_code');?>" title="点击更换验证码" onclick=javascript:this.src="<?php echo U('Action/create_verify_code');?>">
</div><?php endif; ?>
<button type="submit" class="btn btn-primary btn-block login">登   录</button>
</form>
<div class="operation">
<button type="button" class="btn btn-primary btn-block register" onclick="window.location.href='<?php echo U('Action/register');?>'">注  册</button>
<!--<button type="button" class="btn btn-primary btn-block passwd_forgot">忘记密码</button>
<input type="checkbox" class="passwd_remember" name="passwd_remember"> 记住密码-->
</div>
</div>
</div>

</body>
</html>