<?php if (!defined('THINK_PATH')) exit();?><link rel="stylesheet" href="/ThinkPHP/Public/css/view.css"/>
<div class="view_panel">
	<h3 class="view_title"><?php echo ($diary["title"]); ?></h3>
	<div class="view_info">
	<span class="view_userName"><a href="<?php echo U('User/view',array('userName'=>$diary['username']));?>" class="view_user" onmouseover=show_user_card('<?php echo ($diary["username"]); ?>',"<?php echo U('User/get_user_info');?>") onmouseout="hide_user_card();"><?php echo ($diary["username"]); ?></a><div id="user_card"></div></span>
	<span class=""><i class="icon-time" title="发布时间"></i> <?php echo ($diary["date"]); ?></span>
	<span class=""><i class="icon-tag" title="文章标签"></i> 
	<?php $tags = $diary['tag']; ?> 
	<?php if(is_array($tags)): foreach($tags as $key=>$tag): ?><a href="javascript:tag('<?php echo ($tag); ?>');" style="text-decoration:none;"><?php echo ($tag); ?></a>&nbsp;<?php endforeach; endif; ?>
	</span>
	<span class="essay_operation">
	<i class="icon-edit essay-modify" title="修改文章"></i>
	<i class="icon-remove piece-remove" title="删除，请谨慎" onclick=javascript:deleteItem("<?php echo U('Essay/delete');?>",'essay',<?php echo ($diary['id']); ?>);></i>
	</span>
	</div>
	<div class="view_content"><?php echo ($diary["content"]); ?></div>
	<div class="view_footer"></div>
	<div class="view_comment"></div>
</div>
<script type="text/javascript">
	var avatar_path = "/ThinkPHP/Public/img/lion.png";
</script>
<script src="/ThinkPHP/Public/js/view.js"></script>