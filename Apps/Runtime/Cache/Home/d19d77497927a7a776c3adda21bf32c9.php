<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>注册</title>
<!-- <link rel="stylesheet" href="/ThinkPHP/Public/css/bootstrap/bootstrap.min.css"/> -->
<link rel="stylesheet" href="/ThinkPHP/Public/bower_components/amazeui/dist/css/amazeui.css"/>
<link rel="stylesheet" href="/ThinkPHP/Public/css/font-awesome/css/font-awesome.min.css"/>
<link rel="stylesheet" href="/ThinkPHP/Public/css/register.css"/>
</head>
<style>
body{ background-image:url("/ThinkPHP/Public/img/login_bg.jpg"); }
</style>
<body>

<div class="bg">
<div class="register_panel">

<div id="avatar">
<img class="avatar_img" src="/ThinkPHP/Public/img/lion.png"/>
</div>
<div class="title">Heysoo</div>
<form action="<?php echo U('Action/do_register');?>" class="hs-form register_form" method="post">

<div class="hs-input-group hs-input-group-primary">
<span class="hs-input-group-label">用户名</span>
<input class="userName form-control" name="userName"  type="text" placeholder="用户名" title="用户名">
</div>

<div class="hs-input-group hs-input-group-primary">
<span class="hs-input-group-label">邮箱</span>
<input class="email form-control" name="email"  type="text" placeholder="邮箱" title="邮箱">
</div>

<div class="hs-input-group hs-input-group-primary">
<span class="hs-input-group-label">密码</span>
<input class="passwd form-control"  name="passwd" type="password" placeholder="6位以上密码" title="密码">
</div>

<div class="hs-input-group hs-input-group-primary">
<span class="hs-input-group-label">确认密码</span>
<input class="passwd-again form-control"  name="passwd-again" type="password" placeholder="确认密码" title="确认密码">
</div>

<?php if($register_invite_code_on == true): ?><div class="hs-input-group hs-input-group-primary">
<span class="hs-input-group-label">邀请码</i></span>
<input class="inviteCode form-control" name="inviteCode"  type="text" placeholder="邀请码" title="向已注册用户索取邀请码">
</div><?php endif; ?>

<?php if($register_verify_code_on == true): ?><div class="hs-input-group hs-input-group-primary">
<span class="hs-input-group-label">验证码</span>
<input class="verify_code form-control" name="verify_code"  type="text" placeholder="填写以下验证码" title="验证码">
</div>
<div class="verify_code">
	<img class="verify_code_img" src="<?php echo U('Action/create_verify_code');?>" title="点击更换验证码" onclick=javascript:this.src="<?php echo U('Action/create_verify_code');?>">
</div><?php endif; ?>

<button type="submit" class="hs-btn hs-btn-primary hs-btn-block register">注  册</button>
<button type="button" class="hs-btn hs-btn-primary hs-btn-block login" onclick="window.location.href='<?php echo U('Action/login');?>'">登  录</button>
</form>
</div>
</div>

</body>
</html>