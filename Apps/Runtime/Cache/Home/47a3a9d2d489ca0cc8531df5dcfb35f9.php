<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>登录</title>
<!-- <link rel="stylesheet" href="/Heysoo/Public/css/bootstrap/bootstrap.min.css"/> -->
<link rel="stylesheet" href="/Heysoo/Public/bower_components/amazeui/dist/css/amazeui.css"/>
<link rel="stylesheet" href="/Heysoo/Public/css/font-awesome/css/font-awesome.min.css"/>
<link rel="stylesheet" href="/Heysoo/Public/css/login.css"/>
<script src="/Heysoo/Public/bower_components/jquery/dist/jquery.min.js"></script>
</head>
<style>
body,div.login_panel{ background-image:url("/Heysoo/Public/img/bg_night2.png"); }
button.login,button.register,span.hs-input-group-label{background-image: url("/Heysoo/Public/img/bg_night2.png");} 
span.hs-input-group-label{ background:transparent;}
</style>
<script>
	jQuery(function($){
		console.log('点击狮子图片');
		$("img.avatar_img").on('click',function(){
			$(this).css({
				'width':'400px',
				'height':'400px',
				'border-radius':'200px'
			});
			setTimeout(function(){
				$("img.avatar_img").css({
					'width':'80px',
					'height':'80px',
					'border-radius':'40px'
				});
			},1000);
		});
	});
</script>
<body>

<div class="bg">
<div class="login_panel">
<div id="avatar">
<img class="avatar_img" src="/Heysoo/Public/img/lion.png"/>
</div>
<div class="title">Heysoo</div>
<div class="slogan">每个人就是一个世界</div>
<form action="<?php echo U('Action/do_login');?>" class="hs-form login_form" method="post">

<div class="hs-input-group hs-input-group-primary">
<span class="hs-input-group-label">用户名</span>
<input class="userName form-control" name="userName"  type="text" placeholder="用户名" title="用户名">
</div>

<div class="hs-input-group hs-input-group-primary">
<span class="hs-input-group-label">密码</span>
<input class="passwd form-control"  name="passwd" type="password" placeholder="密码" title="密码">
</div>

<?php if($verify_code_on == true): ?><div class="hs-input-group hs-input-group-primary">
<span class="hs-input-group-label">验证码</span>
<input class="verify_code form-control" name="verify_code"  type="text" placeholder="请填写以下验证码" title="验证码">
</div>
<div class="verify_code">
	<img class="verify_code_img" src="<?php echo U('Action/create_verify_code');?>" title="点击更换验证码" onclick=javascript:this.src="<?php echo U('Action/create_verify_code');?>">
</div><?php endif; ?>
<button type="submit" class="hs-btn hs-btn-primary hs-btn-block login">登   录</button>
</form>
<div class="operation">
<button type="button" class="hs-btn hs-btn-primary hs-btn-block register" onclick="window.location.href='<?php echo U('Action/register');?>'">注  册</button>
<!--<button type="button" class="btn btn-primary btn-block passwd_forgot">忘记密码</button>
<input type="checkbox" class="passwd_remember" name="passwd_remember"> 记住密码-->
</div>
</div>
</div>

</body>
</html>