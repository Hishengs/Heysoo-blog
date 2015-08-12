<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<html lang="zh-cn">
<head>
<meta charset="UTF-8">
<meta http-equiv="content-type" content="text/html; charset=UTF-8">
<link rel="icon" type="image/png" href="favicon.ico">
<title><?php echo ((isset($user['username'] ) && ($user['username'] !== ""))?($user['username'] ):"我的主页"); ?></title>
<!-- <link rel="stylesheet" href="/Heysoo/Public/css/bootstrap/bootstrap.min.css"/> -->
<link rel="stylesheet" href="/Heysoo/Public/css/font-awesome/css/font-awesome.min.css"/>
<link rel="stylesheet" href="/Heysoo/Public/css/index.css"/>
<link rel="stylesheet" href="/Heysoo/Public/css/piece/piece.css"/>
<link rel="stylesheet" href="/Heysoo/Public/css/diary/diary.css"/>
<link rel="stylesheet" href="/Heysoo/Public/css/essay/essay.css"/>
<link rel="stylesheet" href="/Heysoo/Public/css/view.css"/>
<!-- <link rel="stylesheet" href="http://cdn.bootcss.com/flat-hs/2.2.2/css/flat-hs.min.css"/> -->
<link rel="stylesheet" href="/Heysoo/Public/bower_components/amazeui/dist/css/amazeui.css"/>
<!-- <link rel="stylesheet" href="/Heysoo/Public/bower_components/semantic/dist/components/dropdown.min.css"/> -->
<link rel="stylesheet" href="/Heysoo/Public/bower_components/lightbox2/dist/css/lightbox.css"/>
<!--<style type="text/css">
	#left_panel{ background-image: url('/Heysoo/Public/img/login_bg.png');}
	#right_panel{ background-image: url('/Heysoo/Public/img/bg_day.png');}
</style>-->
<script src="/Heysoo/Public/bower_components/jquery/dist/jquery.min.js"></script>
<script src="/Heysoo/Public/bower_components/jquery.lazyload/jquery.lazyload.js"></script>
<style type="text/css">
	#left_panel{ background-image: url('/Heysoo/Public/img/login_bg.png');}
	#right_panel{ background-image: url("/Heysoo/Public/img/<?php echo ($user_config['bg_img']); ?>.png");}
</style>
</head>
<body>
<div id="mask"></div>
<!-- 左边侧 个人资料面板 -->
<div id="left_panel">
<div class="user_avatar">
<img class="user_avatar hs-img" src="/Heysoo/Public/img/me.jpg" title="点击修改头像">
</div>
<div class="userName"><?php echo ($user["username"]); ?></div>
<div class="user_signature"><?php echo ((isset($user['signature'] ) && ($user['signature'] !== ""))?($user['signature'] ):'尚未设置签名'); ?></div>
<div class="user_items">

<div class="hs-btn-group hs-btn-group-justify">
    <button type="button" class="hs-btn hs-btn-primary hs-btn-msg" onclick="javascript:hMessage('尚未实现');"><i class="icon-envelope-alt"></i> 消息 <span class="hs-badge hs-badge-danger hs-round">15</span></button>
    <button type="button" class="hs-btn hs-btn-primary" onclick="window.location.href='<?php echo U('Essay/edit_page');?>'"><i class="icon-edit"></i> 发布</button>
    <button type="button" class="hs-btn hs-btn-primary" onclick="javascript:hMessage('尚未实现');"><i class="icon-tags"></i> 标签</button>
</div>

<button class="hs-btn hs-btn-primary hs-btn-block" onclick="javascript:window.location.href='<?php echo U('Index/index');?>'"><i class="icon-random"></i> 首页</button>
<button class="hs-btn hs-btn-primary hs-btn-block" onclick=getPage("<?php echo U('Piece/get_piece_page');?>","content",4)><i class="icon-fire"></i> 我的碎片(<?php echo ((isset($piece_nums ) && ($piece_nums !== ""))?($piece_nums ):0); ?>)</button>
<button class="hs-btn hs-btn-primary hs-btn-block" onclick=getPage("<?php echo U('Essay/get_essay_page');?>","content",2)><i class="icon-font"></i> 我的文章(<?php echo ((isset($essay_nums ) && ($essay_nums !== ""))?($essay_nums ):0); ?>)</button>
<button class="hs-btn hs-btn-primary hs-btn-block" onclick=getPage("<?php echo U('Diary/get_diary_page');?>","content",3)><i class="icon-calendar"></i> 我的日记(<?php echo ((isset($diary_nums ) && ($diary_nums !== ""))?($diary_nums ):0); ?>)</button>

<!-- <button class="hs-btn hs-btn-primary hs-btn-block" onclick=showEditPage("<?php echo U('Action/get_edit_page');?>","essay","content")><i class="icon-pencil"></i> 提笔ajax</button>
<button class="hs-btn hs-btn-primary hs-btn-block" onclick="window.location.href='<?php echo U('Essay/edit_page');?>'"><i class="icon-pencil"></i> 提笔</button> -->

</div>
<div class="hs-btn-group hs-btn-group-justify setting">
<!--  <button class="hs-btn hs-btn-primary hs-btn-block"><i class="icon-wrench"></i> 设置</button>-->
<button class="hs-btn hs-btn-primary" onclick="window.location.href='<?php echo U('Action/logout');?>'"><i class="icon-off"></i> 退出</button>
<button class="hs-btn hs-btn-primary" onclick="javascript:hMessage('尚未实现');"><i class="icon-wrench"></i> 设置</button>
<button class="hs-btn hs-btn-primary" onclick="javascript:hMessage('尚未实现');"><i class="icon-search"></i> 搜索</button>
<button class="hs-btn hs-btn-primary" onclick="hideControlPanel();"><i class="icon-arrow-left"></i> 收起</button>
</div>
</div>

<div id="right_panel">
<div id="content">

<div class="pieces">
<?php if(is_array($pieces)): foreach($pieces as $key=>$piece): ?><div class="piece" id="<?php echo ($piece['id']); ?>">
<div class="piece_left">
<a href="javascript:;" onclick="hMessage('暂时无法访问');" target="_blank"><img class="user_avatar" src="/Heysoo/Public/img/me.jpg" title="访问他/她的主页"/></a>
</div>
<div class="piece_right">
<div class="bg"></div><div class="piece_triangle"></div>
<div class="piece_info">
<span class="piece_user"><a href="javascript:;" onclick="hMessage('暂时无法访问');" target="_blank" class="piece_user"><?php echo ($piece["username"]); ?>  </a></span>&nbsp;
<span class="piece_date"><i class="icon-time"></i> <?php echo date("Y-m-d",strtotime($piece['date']));?></span>
</div>
<div class="piece_content">
<?php echo ($piece["content"]); ?>
</div>
<div class="piece_footer"><i class="icon-tag"></i> 
<?php $tags = $piece['tag']; ?> 
<?php if(is_array($tags)): foreach($tags as $key=>$tag): ?><a href="javascript:tag('<?php echo ($tag); ?>');" class="tag" style="text-decoration:none;"><?php echo ($tag); ?></a>&nbsp;<?php endforeach; endif; ?>
<span class="piece_footer_right"><a href="javascript:showPieceCmt('<?php echo ($piece['id']); ?>');"><i class="icon-comment-alt" title="评论"></i></a></span>
</div>
</div>
</div><?php endforeach; endif; ?>
</div>

<button type="button" class="hs-btn hs-btn-primary hs-btn-block load_more" onclick="loadPieces();"><i class="icon-arrow-down"></i> 加载更多</button>

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
</script>
<!-- <script src="/Heysoo/Public/js/require.js" data-main="main"></script> -->
<script src="/Heysoo/Public/bower_components/lightbox2/dist/js/lightbox.js"></script>
<!-- <script src="/Heysoo/Public/bower_components/amazeui/dist/js/amazeui.js"></script> -->
<script src="/Heysoo/Public/editor/Kindeditor.js" ></script>
<script src="/Heysoo/Public/editor/lang/zh_CN.js"></script>
<script src="/Heysoo/Public/js/jqpaginator.min.js"></script>
<script src="/Heysoo/Public/js/index.js"></script>
<script src="/Heysoo/Public/js/pages.js"></script>
<script src="/Heysoo/Public/js/piece.js"></script> 
</html>