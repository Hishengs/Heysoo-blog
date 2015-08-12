<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link rel="icon" type="image/png" href="favicon.ico">
<title><?php echo ((isset($user['username'] ) && ($user['username'] !== ""))?($user['username'] ):"我的主页"); ?></title>
<!-- <link rel="stylesheet" href="/ThinkPHP/Public/css/bootstrap/bootstrap.min.css"/> -->
<link rel="stylesheet" href="/ThinkPHP/Public/css/font-awesome/css/font-awesome.min.css"/>
<link rel="stylesheet" href="/ThinkPHP/Public/css/index.css"/>
<link rel="stylesheet" href="/ThinkPHP/Public/css/piece/piece.css"/>
<link rel="stylesheet" href="/ThinkPHP/Public/css/diary/diary.css"/>
<link rel="stylesheet" href="/ThinkPHP/Public/css/essay/essay.css"/>
<!-- <link rel="stylesheet" href="http://cdn.bootcss.com/flat-hs/2.2.2/css/flat-hs.min.css"/> -->
<link rel="stylesheet" href="/ThinkPHP/Public/bower_components/amazeui/dist/css/amazeui.css"/>
<!-- <link rel="stylesheet" href="/ThinkPHP/Public/bower_components/semantic/dist/components/dropdown.min.css"/> -->
<link rel="stylesheet" href="/ThinkPHP/Public/bower_components/lightbox2/dist/css/lightbox.css"/>
<style type="text/css">
	#left_panel{ background-image: url('/ThinkPHP/Public/img/login_bg.jpg');}
	#right_panel{ background-image: url('/ThinkPHP/Public/img/bg.jpg');}
</style>
</head>
<body>
<!-- 左边侧 个人资料面板 -->
<div id="left_panel">
<div class="user_avatar">
<img class="user_avatar hs-img" src="/ThinkPHP/Public/img/me.jpg" title="点击修改头像">
</div>
<div class="userName"><?php echo ($user["username"]); ?></div>
<div class="user_signature"><?php echo ((isset($user['signature'] ) && ($user['signature'] !== ""))?($user['signature'] ):'尚未设置签名'); ?></div>
<div class="user_items">

<div class="hs-btn-group hs-btn-group-justify">
    <button type="button" class="hs-btn hs-btn-primary hs-btn-msg"><i class="icon-envelope-alt"></i> 消息</button>
    <button type="button" class="hs-btn hs-btn-primary" onclick="window.location.href='<?php echo U('Essay/edit_page');?>'"><i class="icon-edit"></i> 发布</button>
    <button type="button" class="hs-btn hs-btn-primary"><i class="icon-tags"></i> 标签</button>
</div>

<button class="hs-btn hs-btn-primary hs-btn-block" onclick=getPage("<?php echo U('Index/get_index_page');?>","content",1)><i class="icon-random"></i> 首页</button>
<button class="hs-btn hs-btn-primary hs-btn-block" onclick=getPage("<?php echo U('Piece/get_piece_page');?>","content",4)><i class="icon-fire"></i> 我的碎片(<?php echo ((isset($piece_nums ) && ($piece_nums !== ""))?($piece_nums ):0); ?>)</button>
<button class="hs-btn hs-btn-primary hs-btn-block" onclick=getPage("<?php echo U('Essay/get_essay_page');?>","content",2)><i class="icon-font"></i> 我的文章(<?php echo ((isset($essay_nums ) && ($essay_nums !== ""))?($essay_nums ):0); ?>)</button>
<button class="hs-btn hs-btn-primary hs-btn-block" onclick=getPage("<?php echo U('Diary/get_diary_page');?>","content",3)><i class="icon-calendar"></i> 我的日记(<?php echo ((isset($diary_nums ) && ($diary_nums !== ""))?($diary_nums ):0); ?>)</button>

<!-- <button class="hs-btn hs-btn-primary hs-btn-block" onclick=showEditPage("<?php echo U('Action/get_edit_page');?>","essay","content")><i class="icon-pencil"></i> 提笔ajax</button>
<button class="hs-btn hs-btn-primary hs-btn-block" onclick="window.location.href='<?php echo U('Essay/edit_page');?>'"><i class="icon-pencil"></i> 提笔</button> -->

</div>
<div class="hs-btn-group hs-btn-group-justify setting">
<!--  <button class="hs-btn hs-btn-primary hs-btn-block"><i class="icon-wrench"></i> 设置</button>-->
<button class="hs-btn hs-btn-primary"><i class="icon-wrench"></i> 设置</button>
<button class="hs-btn hs-btn-primary" onclick="window.location.href='<?php echo U('Action/logout');?>'"><i class="icon-off"></i> 退出</button>
<button class="hs-btn hs-btn-primary" onclick="hideControlPanel();"><i class="icon-arrow-left"></i> 收起</button>
</div>
</div>

<div id="right_panel">
<div id="content">

<div class="hs-alert hs-alert-block" style="border-radius:0; " data-hs-alert>
	<button type="button" class="hs-close">&times;</button>
    该模块尚未实现，敬请期待！
</div>
<!--<script type="text/javascript">
	hMessage("该模块尚未实现，敬请期待！",3000);
</script>-->

</div>
</div>
<!-- 回到顶部 -->
<a href="javascript:gotoTop();" id="backTop"><i class="icon-arrow-up"></i> 回到顶部</a>
</body>
<script>
	//var PUBLIC = "/ThinkPHP/Public";
	var load_essays_path = "<?php echo U('Essay/load_essays');?>";
	var public_path = "/ThinkPHP/Public";
	//console.log(load_essays_path);
</script>
<!-- <script src="/ThinkPHP/Public/js/require.js" data-main="main"></script> -->
<script src="/ThinkPHP/Public/bower_components/jquery/dist/jquery.min.js"></script>
<script src="/ThinkPHP/Public/bower_components/lightbox2/dist/js/lightbox.js"></script>
<script src="/ThinkPHP/Public/bower_components/amazeui/dist/js/amazeui.js"></script>
<script src="/ThinkPHP/Public/js/index.js"></script>
<script src="/ThinkPHP/Public/js/pages.js"></script>
<script src="/ThinkPHP/Public/js/piece.js"></script> 
</html>