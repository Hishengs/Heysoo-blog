<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<html lang="zh-cn" ng-app="Index" ng-controller="c_index">
<head>
<base href="/Heysoo/">
<meta charset="UTF-8">
<meta http-equiv="content-type" content="text/html; charset=UTF-8">
<link rel="icon" type="image/png" href="/Heysoo/Public/img/favicon.ico">
<title><?php echo ((isset($user['username'] ) && ($user['username'] !== ""))?($user['username'] ):"我的主页"); ?></title>
<link rel="stylesheet" href="/Heysoo/Public/bower/fontawesome/css/font-awesome.min.css"/>
<link rel="stylesheet" href="/Heysoo/Public/bower/lightbox2/dist/css/lightbox.css"/>
<link rel="stylesheet" href="/Heysoo/Public/css/dist/plugins.css"/>
<link rel="stylesheet" href="/Heysoo/Public/css/dist/index.css"/>
<style type="text/css">
	#left-panel{ background-image: url('/Heysoo/Public/img/login_bg.png');}
	body{ background-image: url("/Heysoo/Public/img/<?php echo ($user_config['bg_img']); ?>.png");}
</style>
</head>
<body>
<div id="mask" ng-show="mask_show">
	<div ui-view="mask"></div>
</div>
<div id="hMessage-mask"></div>

<div id="left-panel" ng-controller="c_sidePanel" ng-dblclick="toggleSidePanel()">
<div class="user-avatar">
<img class="user-avatar hs-img" ng-src="{{avatar}}" title="点击修改头像">
</div>
<div class="userName">{{user.username}}</div>
<div class="user-signature">{{user.signature}}</div>
<div class="user-items">

<div class="hs-btn-group hs-btn-group-justify">
    <button type="button" class="hs-btn hs-btn-primary hs-btn-msg" ng-click="showMessage()"><i class="hs-icon-envelope-o"></i> 消息 <span class="hs-badge hs-badge-warning hs-radius">{{unread_msg_num}}</span></button>
    <button type="button" class="hs-btn hs-btn-primary" ng-click="edit()"><i class="hs-icon-edit"></i> 发布</button>
    <button type="button" class="hs-btn hs-btn-primary" ng-click="showFollow()"><i class="hs-icon-user"></i> 关注</button>
</div>

<button class="hs-btn hs-btn-primary hs-btn-block" onclick="javascript:window.location.href='<?php echo U('Index/index');?>'"><i class="hs-icon-random"></i> 首页</button>
<button class="hs-btn hs-btn-primary hs-btn-block" ng-click="getPage('piece')"><i class="hs-icon-fire"></i> 我的碎片({{piece_nums}})</button>
<button class="hs-btn hs-btn-primary hs-btn-block" ng-click="getPage('essay')"><i class="hs-icon-font"></i> 我的文章({{essay_nums}})</button>
<button class="hs-btn hs-btn-primary hs-btn-block" onclick=getPage("<?php echo U('Diary/get_diary_page');?>","content",3)><i class="hs-icon-calendar"></i> 我的日记({{diary_nums}})</button>

</div>
<div class="hs-btn-group hs-btn-group-justify setting">
<button class="hs-btn hs-btn-primary" onclick="window.location.href='<?php echo U('Action/logout');?>'"><i class="hs-icon-off"></i> 退出</button>
<button class="hs-btn hs-btn-primary" ng-click="showSetting()"><i class="hs-icon-wrench"></i> 设置</button>
<button type="button" class="hs-btn hs-btn-primary" ng-click="showTag()"><i class="hs-icon-tags"></i> 标签</button>
<button class="hs-btn hs-btn-primary" ng-click="showSearch()"><i class="hs-icon-search"></i> 搜索</button>
<button class="hs-btn hs-btn-primary" onclick="hideControlPanel();"><i class="hs-icon-arrow-left"></i> 收起</button>
</div>
</div>

<div id="right-panel">
<div id="content">
<div ui-view="content" class="content-view">
<div ng-include="'/Heysoo/Public/templates/Index/index.html'"></div>
</div>
</div>
</div>
<!-- 回到顶部 -->
<a href="javascript:gotoTop();" id="backTop"><i class="hs-icon-arrow-up"></i> 回到顶部</a>
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
<script src="/Heysoo/Public/js/dist/app.js"></script> 
</html>