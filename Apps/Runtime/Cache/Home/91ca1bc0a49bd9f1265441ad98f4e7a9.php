<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<html ng-app="User" ng-controller="c_user">
<head>
<meta charset="UTF-8">
<title><?php echo ($user["username"]); ?>的主页</title>
<link rel="stylesheet" href="/Heysoo/Public/bower/fontawesome/css/font-awesome.min.css"/>
<link rel="stylesheet" href="/Heysoo/Public/bower/lightbox2/dist/css/lightbox.css"/>
<link rel="stylesheet" href="/Heysoo/Public/css/dist/plugins.css"/>
<link rel="stylesheet" href="/Heysoo/Public/css/dist/index.css"/>
<style type="text/css">
	#left-panel{ background-image: url('/Heysoo/Public/img/login_bg.png');}
</style>
</head>
<body>
<div id="mask" ng-show="mask_show">
	<div ui-view="mask"></div>
</div>
<div id="hMessage-mask"></div>
<!-- 左边侧 个人资料面板 -->
<div id="left-panel">
<div class="user-avatar">
<img class="user-avatar hs-img" src="/Heysoo/Public/img/lion.png">
</div>
<div class="userName"><?php echo ($user["username"]); ?></div>
<div class="user-signature"><?php echo ($user["signature"]); ?></div>
<div class="user-items">

<?php if($isSelf != 1): ?><div class="hs-btn-group hs-btn-group-justify">
    <button type="button" class="hs-btn hs-btn-primary btn-follow" ng-click="follow('<?php echo ($user["username"]); ?>')" ng-bind-html="follow_btn_html | trustHtml"></button>
    <button type="button" class="hs-btn hs-btn-primary btn-send-msg"><i class="hs-icon-envelope-o"></i> 发消息</button>
</div><?php endif; ?>

<button class="hs-btn hs-btn-primary hs-btn-block"><i class="hs-icon-fire"></i> 碎片(<?php echo ((isset($piece_nums ) && ($piece_nums !== ""))?($piece_nums ):0); ?>)</button>
<button class="hs-btn hs-btn-primary hs-btn-block"><i class="hs-icon-font"></i> 文章(<?php echo ((isset($essay_nums ) && ($essay_nums !== ""))?($essay_nums ):0); ?>)</button>
<button class="hs-btn hs-btn-primary hs-btn-block"><i class="hs-icon-calendar"></i> 日记(<?php echo ((isset($diary_nums ) && ($diary_nums !== ""))?($diary_nums ):0); ?>)</button>

</div>

</div>

<div id="right-panel">
<div id="content">


</div>
</div>

<!-- 回到顶部 -->
<a href="javascript:gotoTop();" id="backTop"><i class="icon-arrow-up"></i> 回到顶部</a>
</body>
<script>
	var load_essays_path = "<?php echo U('Essay/load_essays');?>";
	var public_path = "/Heysoo/Public";
	var editor_basePath = "/Heysoo/Public/editor/";
	var getTokenPath = "<?php echo U('Action/get_qiniu_token');?>";
	var home_path = "/Heysoo";
</script>
<script src="/Heysoo/Public/js/dist/plugins.js"></script>
<script src="/Heysoo/Public/js/dist/angular.js"></script>
<script src="/Heysoo/Public/js/dist/index.js"></script>
<script src="/Heysoo/Public/js/angular/user.js"></script>
</html>