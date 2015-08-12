<?php if (!defined('THINK_PATH')) exit();?><link rel="stylesheet" href="/ThinkPHP/Public/css/view.css"/>
<div class="view_panel">
	<h3 class="view_title"><?php echo ($essay["title"]); ?></h3>
	<div class="view_info">
	<span class="view_userName"><a href="<?php echo U('User/view',array('userName'=>$essay['username']));?>" class="view_user" onmouseover=show_user_card('<?php echo ($essay["username"]); ?>',"<?php echo U('User/get_user_info');?>") onmouseout="hide_user_card();"><?php echo ($essay["username"]); ?></a><div id="user_card"></div></span>
	<span class=""><i class="icon-time" title="发布时间"></i> <?php echo ($essay["date"]); ?></span>
	<span class=""><i class="icon-tag" title="文章标签"></i> <?php echo ($essay["tag"]); ?></span>
	<span class="essay_operation">
	<i class="icon-edit essay-modify" title="修改文章"></i>
	<i class="icon-remove piece-remove" title="删除，请谨慎" onclick=javascript:deleteItem("<?php echo U('Essay/delete');?>",'essay',<?php echo ($essay['id']); ?>);></i>
	</span>
	</div>
	<div class="view_content"><?php echo ($essay["content"]); ?></div>
	<div class="view_footer"></div>
	<div class="view_comment"></div>
</div>
<script type="text/javascript">
	var avatar_path = "/ThinkPHP/Public/img/lion.png";
</script>
<script src="/ThinkPHP/Public/js/view.js"></script>