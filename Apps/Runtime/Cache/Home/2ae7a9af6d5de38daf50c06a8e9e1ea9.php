<?php if (!defined('THINK_PATH')) exit();?><div class="view-panel">
	<h3 class="view-title"><?php echo ($essay["title"]); ?></h3>
	<div class="view-info">
	<span class="view-userName"><a href="javascript:;" class="view-user"><?php echo ($essay["username"]); ?></a><div id="user-card"></div></span>
	<span class="view-date"><i class="icon-time" title="发布时间"></i> <?php echo date("m-d H:i",strtotime($essay['date']));?></span>
	<span class="view-tag"><i class="icon-tag" title="文章标签"></i> 
	<?php $tags = $essay['tag']; ?> 
	<?php if(is_array($tags)): foreach($tags as $key=>$tag): ?><a href="javascript:tag('<?php echo ($tag); ?>');" style="text-decoration:none;"><?php echo ($tag); ?></a>&nbsp;<?php endforeach; endif; ?>
	</span>
	<span class="essay-operation">
	<i class="icon-edit essay-modify" title="修改文章"></i>
	<i class="icon-remove piece-remove" title="删除，请谨慎" onclick=javascript:deleteItem("<?php echo U('Essay/delete');?>",'essay',<?php echo ($essay['id']); ?>);></i>
	</span>
	</div>
	<div class="view-content"><?php echo ($essay["content"]); ?></div>
	<div class="view-footer"></div>
	<div class="view-comment"></div>
</div>

<!-- 发布评论 -->
<div class="post-comment">
<form class="hs-form essay-comment-form" id="essay-comment-form">
<textarea class="post-comment-edit" name="comment-content" class="post-comment-edit"></textarea>
<button type="button" onclick="postEssayCmt(<?php echo ($essay['id']); ?>)" class="hs-btn hs-btn-primary post-essay-comment-btn">发布评论</button>
</form>
</div>

<!-- 评论区 -->
<div class="essay-comments">
<ul class="hs-comments-list hs-comments-list-flip">

<?php if($comments_num > 0): if(is_array($comments)): foreach($comments as $key=>$comment): ?><li class="hs-comment">
<article class="hs-comment essay-comment"> <!-- 评论容器 -->
  <a href="">
    <img class="hs-comment-avatar comment-user-avatar" src="/Heysoo/Public/img/me.jpg" alt=""/> <!-- 评论者头像 -->
  </a>

  <div class="hs-comment-main"> <!-- 评论内容容器 -->
    <header class="hs-comment-hd">
      <!--<h3 class="hs-comment-title">评论标题</h3>-->
      <div class="hs-comment-meta"> <!-- 评论元数据 -->
        <a href="#link-to-user" class="hs-comment-author"><?php echo ($comment['username']); ?></a> <!-- 评论者 -->
        评论于 <time datetime=""><?php echo date("m-d H:i",strtotime($comment['comment_date']));?></time>
      </div>
    </header>

    <div class="hs-comment-bd"><?php echo ($comment["comment_content"]); ?></div> <!-- 评论内容 -->
  </div>
</article>
</li><?php endforeach; endif; ?>
<?php else: ?><div class="hs-alert comment-tip">暂无评论</div><?php endif; ?>

</ul>
</div>

<script type="text/javascript">
	var avatar_path = "/Heysoo/Public/img/lion.png";
</script>
<script src="/Heysoo/Public/js/view.js"></script>