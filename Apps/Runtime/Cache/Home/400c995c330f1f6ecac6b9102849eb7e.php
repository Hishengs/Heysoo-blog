<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<html lang="zh-cn" ng-app="Index" ng-controller="c_index">
<head>
<base href="/Heysoo/Home/Index/">
<meta charset="UTF-8">
<meta http-equiv="content-type" content="text/html; charset=UTF-8">
<link rel="hs-icon" type="image/png" href="favicon.ico">
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
<div id="mask"></div>
<div id="hMessage-mask"></div>

<div id="left-panel">
<div class="user-avatar">
<img class="user-avatar hs-img" src="/Heysoo/Public/img/me.jpg" title="点击修改头像">
</div>
<div class="userName"><?php echo ($user["username"]); ?></div>
<div class="user-signature"><?php echo ((isset($user['signature'] ) && ($user['signature'] !== ""))?($user['signature'] ):'尚未设置签名'); ?></div>
<div class="user-items">

<div class="hs-btn-group hs-btn-group-justify">
    <button type="button" class="hs-btn hs-btn-primary hs-btn-msg" onclick="javascript:hMessage('尚未实现');"><i class="hs-hs-icon-envelope-alt"></i> 消息 <span class="hs-badge hs-badge-danger hs-round">15</span></button>
    <!-- <button type="button" class="hs-btn hs-btn-primary" onclick="window.location.href='<?php echo U('Essay/edit_page');?>'"><i class="hs-icon-edit"></i> 发布</button> -->
    <button type="button" class="hs-btn hs-btn-primary" ng-click="edit()"><i class="hs-icon-edit"></i> 发布</button>
    <button type="button" class="hs-btn hs-btn-primary" onclick="javascript:hMessage('尚未实现');"><i class="hs-icon-tags"></i> 标签</button>
</div>

<button class="hs-btn hs-btn-primary hs-btn-block" onclick="javascript:window.location.href='<?php echo U('Index/index');?>'"><i class="hs-icon-random"></i> 首页</button>
<button class="hs-btn hs-btn-primary hs-btn-block" ng-click="getPage('piece')"><i class="hs-icon-fire"></i> 我的碎片(<?php echo ((isset($piece_nums ) && ($piece_nums !== ""))?($piece_nums ):0); ?>)</button>
<button class="hs-btn hs-btn-primary hs-btn-block" ng-click="getPage('essay')"><i class="hs-icon-font"></i> 我的文章(<?php echo ((isset($essay_nums ) && ($essay_nums !== ""))?($essay_nums ):0); ?>)</button>
<button class="hs-btn hs-btn-primary hs-btn-block" onclick=getPage("<?php echo U('Diary/get_diary_page');?>","content",3)><i class="hs-icon-calendar"></i> 我的日记(<?php echo ((isset($diary_nums ) && ($diary_nums !== ""))?($diary_nums ):0); ?>)</button>

</div>
<div class="hs-btn-group hs-btn-group-justify setting">
<button class="hs-btn hs-btn-primary" onclick="window.location.href='<?php echo U('Action/logout');?>'"><i class="hs-icon-off"></i> 退出</button>
<button class="hs-btn hs-btn-primary" onclick="javascript:hMessage('尚未实现');"><i class="hs-icon-wrench"></i> 设置</button>
<button class="hs-btn hs-btn-primary" onclick="javascript:hMessage('尚未实现');"><i class="hs-icon-search"></i> 搜索</button>
<button class="hs-btn hs-btn-primary" onclick="hideControlPanel();"><i class="hs-icon-arrow-left"></i> 收起</button>
</div>
</div>

<div id="right-panel">
<div id="content" ng-controller="c_content">
<div ui-view="content">
<div class="pieces">
<?php if(is_array($pieces)): foreach($pieces as $key=>$piece): ?><div class="piece" id="<?php echo ($piece['piece_id']); ?>">
<div class="piece-left">
<a href="javascript:;" onclick="hMessage('暂时无法访问');" target="_blank"><img class="user-avatar" src="/Heysoo/Public/img/me.jpg" title="访问他/她的主页"/></a>
</div>
<div class="piece-right">
<div class="bg"></div><div class="piece-triangle"></div>
<div class="piece-info">
<span class="piece-user"><a href="javascript:;" onclick="hMessage('暂时无法访问');" target="_blank" class="piece-user"><?php echo ($piece["username"]); ?>  </a></span>&nbsp;&nbsp;发布于
<span class="piece-date"><i class="icon-time"></i> <?php echo date("Y-m-d",strtotime($piece['date']));?></span>
</div>
<div class="piece-content">
<?php echo ($piece["content"]); ?>
</div>
<div class="piece-footer"><i class="icon-tag"></i> 
<?php $tags = $piece['tag']; ?> 
<?php if(is_array($tags)): foreach($tags as $key=>$tag): ?><a href="javascript:tag('<?php echo ($tag); ?>');" class="tag" style="text-decoration:none;"><?php echo ($tag); ?></a>&nbsp;<?php endforeach; endif; ?>
<span class="piece-footer-right"><a href="javascript:showPieceCmt('<?php echo ($piece['piece_id']); ?>');"><i class="icon-comment-alt" title="评论"></i></a></span>
</div>
</div>
</div><?php endforeach; endif; ?>

<div ng-include="'/Heysoo/Public/templates/Index/pieces.html'" ></div>

<div ui-view></div>
</div>
<!-- <button type="button" class="hs-btn hs-btn-primary hs-btn-block load-more" onclick="loadPieces();"><i class="icon-arrow-down"></i> 加载更多</button> -->

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
</script>
<script src="/Heysoo/Public/js/dist/plugins.js"></script>
<script src="/Heysoo/Public/js/dist/angular.js"></script>
<script src="/Heysoo/Public/js/dist/index.js"></script>
<script src="/Heysoo/Public/js/app.js"></script>
<script src="/Heysoo/Public/editor/epiceditor/js/epiceditor.min.js"></script>
</html>