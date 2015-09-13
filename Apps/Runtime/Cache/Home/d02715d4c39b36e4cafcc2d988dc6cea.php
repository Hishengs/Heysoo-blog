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

<div class="diary_modify">
<div class="diary_edit_header"><!-- <p class="bg-primary">发布</p> --></div>
<form class="hs-form diary_edit_form" method="post" action="<?php echo U('Action/deal_modify',array('type'=>'diary'));?>">
	<input class="id" name="id" value="<?php echo ($diary['id']); ?>" style="display:none;">
	<div class="hs-input-group hs-input-group-primary">
	  <span class="hs-input-group-label">标题 <i class="hs-icon-font"></i></span>
	  <input type="text" class="form-control title" aria-describedby="basic-addon1" name="title" title="标题" placeholder="标题" value="<?php echo ($diary['title']); ?>">
	</div>

	<div class="hs-input-group hs-input-group-primary">
	  <span class="hs-input-group-label">标签 <i class="hs-icon-tag"></i></span>
	  <input type="text" class="form-control tag" aria-describedby="basic-addon1" name="tag" title="标签" placeholder="标签" value="<?php echo ($diary['tag']); ?>">
	</div>

	<div class="hs-input-group hs-input-group-primary">
		<span class="hs-input-group-label">可见性 <i class="hs-icon-eye"></i></span>
		<select class="hs-select visible" name="visible" title="可见性" placeholder="可见性">
			<option value="1">所有人可见</option>
			<option value="2">好友可见</option>
			<option value="0">仅自己可见</option>
			<option value="3">标签1</option>
			<option value="3">标签2</option>
			<option value="3">创建新标签</option>
		</select>
	</div>

	<textarea id="diary_editor" name="content"><?php echo ($diary["content"]); ?></textarea>
	<div class="diary_edit_footer">
		<div class="diary_edit_footer_note"><i class="icon-tag"></i> 转载的文章请在底部注明转载出处或链接，图片如若超过大小请在线进行 压缩 后上传</div>
		<div class="diary_edit_footer_operation"></div>
		<button class="hs-btn hs-btn-primary essay_submit" type="submit">保 存</button>
	</div>
</form>
</div>
<script type="text/javascript">
	var basePath = "/ThinkPHP/Public/editor/";
	var getTokenPath = "<?php echo U('Action/get_qiniu_token');?>";
</script>
<script src="/ThinkPHP/Public/editor/Kindeditor.js?v=xxx" ></script>
<script charset="utf-8" src="/ThinkPHP/Public/editor/lang/zh_CN.js"></script>
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
            window.editor = K.create('#diary_editor',options);
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