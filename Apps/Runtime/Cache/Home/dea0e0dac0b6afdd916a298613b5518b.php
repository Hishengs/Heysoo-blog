<?php if (!defined('THINK_PATH')) exit(); if(is_array($pieces)): foreach($pieces as $key=>$piece): ?><div class="piece" id="<?php echo ($piece['id']); ?>">
<div class="piece_left">
<div class="essay_date">
<div class="date_y"><?php echo date("Y",strtotime($piece['date']));?></div>
<div class="date_md"><?php echo date("m/d",strtotime($piece['date']));?></div>
</div>
</div>
<div class="piece_right">
<div class="bg"></div><div class="piece_triangle"></div>
<div class="piece_info">
<span class="piece_author"><?php echo ($piece["username"]); ?> &nbsp; &nbsp;</span>
<span class="piece_date"> <i class="icon-time" title="发布时间"></i> <?php echo date("Y-m-d",strtotime($piece['date']));?></span>
</div>
<div class="piece_content">
<?php echo ($piece["content"]); ?>
</div>
<div class="piece_footer"><i class="icon-tag"></i>  
<?php $tags = $piece['tag']; ?> 
<?php if(is_array($tags)): foreach($tags as $key=>$tag): ?><a href="javascript:tag('<?php echo ($tag); ?>');" class="tag" style="text-decoration:none;"><?php echo ($tag); ?></a>&nbsp;<?php endforeach; endif; ?>
<?php if($piece['visible'] == 0): ?><i class="icon-eye-close" title="私密"></i><?php endif; ?>
 <span class="piece_operation">
 <i class="icon-remove piece-remove" title="删除，请谨慎" onclick="javascript:deleteItem('piece',<?php echo ($piece['id']); ?>);"></i>
 </span>
</div>
</div>
</div><?php endforeach; endif; ?>