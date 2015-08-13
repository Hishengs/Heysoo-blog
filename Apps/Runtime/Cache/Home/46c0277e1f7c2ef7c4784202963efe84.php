<?php if (!defined('THINK_PATH')) exit(); if(is_array($pieces)): foreach($pieces as $key=>$piece): ?><div class="piece" id="<?php echo ($piece['id']); ?>">
<div class="piece_left">
<a href="javascript:;" onclick="hMessage('暂时无法访问');" target="_blank"><img class="user_avatar" src="/Heysoo/Public/img/me.jpg" title="访问他/她的主页"/></a>
</div>
<div class="piece_right">
<div class="bg"></div><div class="piece_triangle"></div>
<div class="piece_info">
<span class="piece_author"><a class="piece_user" href="javascript:;" onclick="hMessage('暂时无法访问');" target="_blank"><?php echo ($piece["username"]); ?>  </a></span>&nbsp;&nbsp;发布于
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