<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<html lang="zh-cn">
<head>
<meta charset="UTF-8">
<meta http-equiv="content-type" content="text/html; charset=UTF-8">
<link rel="icon" type="image/png" href="favicon.ico">
<title><?php echo ((isset($user['username'] ) && ($user['username'] !== ""))?($user['username'] ):"我的主页"); ?></title>
<!-- <link rel="stylesheet" href="/ThinkPHP/Public/css/bootstrap/bootstrap.min.css"/> -->
<link rel="stylesheet" href="/ThinkPHP/Public/css/font-awesome/css/font-awesome.min.css"/>
<link rel="stylesheet" href="/ThinkPHP/Public/css/index.css"/>
<link rel="stylesheet" href="/ThinkPHP/Public/css/piece/piece.css"/>
<link rel="stylesheet" href="/ThinkPHP/Public/css/diary/diary.css"/>
<link rel="stylesheet" href="/ThinkPHP/Public/css/essay/essay.css"/>
<link rel="stylesheet" href="/ThinkPHP/Public/css/view.css"/>
<!-- <link rel="stylesheet" href="http://cdn.bootcss.com/flat-hs/2.2.2/css/flat-hs.min.css"/> -->
<link rel="stylesheet" href="/ThinkPHP/Public/bower_components/amazeui/dist/css/amazeui.css"/>
<!-- <link rel="stylesheet" href="/ThinkPHP/Public/bower_components/semantic/dist/components/dropdown.min.css"/> -->
<link rel="stylesheet" href="/ThinkPHP/Public/bower_components/lightbox2/dist/css/lightbox.css"/>
<!--<style type="text/css">
	#left_panel{ background-image: url('/ThinkPHP/Public/img/login_bg.png');}
	#right_panel{ background-image: url('/ThinkPHP/Public/img/bg_day.png');}
</style>-->
<script src="/ThinkPHP/Public/bower_components/jquery/dist/jquery.min.js"></script>
<script src="/ThinkPHP/Public/bower_components/jquery.lazyload/jquery.lazyload.js"></script>
<style type="text/css">
	#left_panel{ background-image: url('/ThinkPHP/Public/img/login_bg.png');}
	#right_panel{ background-image: url("/ThinkPHP/Public/img/<?php echo ($user_config['bg_img']); ?>.png");}
</style>
</head>
<body>
<div id="mask"></div>
<!-- 左边侧 个人资料面板 -->
<div id="left_panel">
<div class="user_avatar">
<img class="user_avatar hs-img" src="/ThinkPHP/Public/img/me.jpg" title="点击修改头像">
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

<div class="essay_edit">
<div class="essay_edit_header"><!-- <p class="bg-primary">发布</p> --></div>
<form class="hs-form essay_edit_form" method="post" action="<?php echo U('Action/deal_post');?>">
	<!-- <input class="form-control essay_title" type="text" name="title" title="标题" placeholder="标题"> -->
	<div class="hs-input-group hs-input-group-primary">
	  <span class="hs-input-group-label">标题 <i class="hs-icon-font"></i></span>
	  <input type="text" class="form-control title" aria-describedby="basic-addon1" name="title" title="标题" placeholder="标题">
	</div>
	<!-- <input class="form-control essay_tag" type="text" name="tag" title="标签" placeholder="标签"> -->
	<div class="hs-input-group hs-input-group-primary">
	  <span class="hs-input-group-label">标签 <i class="hs-icon-tag"></i></span>
	  <input type="text" class="form-control tag" aria-describedby="basic-addon1" name="tag" title="标签" placeholder="标签">
	</div>

	<div class="hs-input-group hs-input-group-primary">
		<span class="hs-input-group-label">类型 <i class="hs-icon-bookmark"></i></span>
		<select class="hs-select type" name="type" title="发布类型" placeholder="发布类型">
			<option value="piece">碎片</option>
			<option value="essay">文章</option>
			<option value="diary">日记</option>
		</select>
	</div>

	<div class="hs-input-group hs-input-group-primary">
		<span class="hs-input-group-label">可见性 <i class="hs-icon-eye"></i></span>
		<select class="hs-select visible" name="visible" title="可见性" placeholder="可见性">
			<option value="1">所有人可见</option>
			<option value="2">好友可见</option>
			<option value="3">仅自己可见</option>
		</select>
	</div>

	<textarea id="essay_editor" name="content"></textarea>
	<div class="essay_edit_footer">
		<div class="essay_edit_footer_note"><i class="icon-tag"></i> 转载的文章请在底部注明转载出处或链接，图片如若超过大小请在线进行 压缩 后上传</div>
		<div class="essay_edit_footer_operation"></div>
		<button class="hs-btn hs-btn-primary essay_submit" type="submit">发 布</button>
	</div>
</form>
</div>
<link rel="stylesheet" href="/ThinkPHP/Public/css/edit.css"/>
<script type="text/javascript">
	var basePath = "/ThinkPHP/Public/editor/";
	var getTokenPath = "<?php echo U('Action/get_qiniu_token');?>";
</script>
<script src="/ThinkPHP/Public/editor/Kindeditor.js?v=xxx" ></script>
<script src="/ThinkPHP/Public/editor/lang/zh_CN.js"></script>
<script>
        KindEditor.ready(function(K) {
        	var options = {
        		width:'100%',
        		height:'400px',
        		basePath:basePath,
        		themeType:'simple',
        		items:[ 
					'|','forecolor', 'hilitecolor', 'fontname' ,'bold', 'fontsize',
					'italic', 'underline', '|', 'justifyleft', 'justifycenter', 'justifyright',
				   'justifyfull', '|', 'subscript',
				   'superscript', 'removeformat', '|', 'image', 'multiimage',
					'emoticons','|', 'link', 'unlink', 'fullscreen',
					'preview', '|'
						],
        	};
            window.editor = K.create('#essay_editor',options);
        });
</script>

</div>
</div>
<!-- 回到顶部 -->
<a href="javascript:gotoTop();" id="backTop"><i class="icon-arrow-up"></i> 回到顶部</a>
</body>
<script>
	//var PUBLIC = "/ThinkPHP/Public";
	var load_essays_path = "<?php echo U('Essay/load_essays');?>";
	var public_path = "/ThinkPHP/Public";
	var editor_basePath = "/ThinkPHP/Public/editor/";
	//console.log(load_essays_path);
</script>
<!-- <script src="/ThinkPHP/Public/js/require.js" data-main="main"></script> -->
<script src="/ThinkPHP/Public/bower_components/lightbox2/dist/js/lightbox.js"></script>
<script src="/ThinkPHP/Public/bower_components/amazeui/dist/js/amazeui.js"></script>
<script src="/ThinkPHP/Public/editor/Kindeditor.js" ></script>
<script src="/ThinkPHP/Public/editor/lang/zh_CN.js"></script>
<script src="/ThinkPHP/Public/js/jqpaginator.min.js"></script>
<script src="/ThinkPHP/Public/js/index.js"></script>
<script src="/ThinkPHP/Public/js/pages.js"></script>
<script src="/ThinkPHP/Public/js/piece.js"></script> 
</html>