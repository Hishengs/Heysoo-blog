<?php if (!defined('THINK_PATH')) exit(); if(is_array($essays)): foreach($essays as $key=>$essay): ?><div class="essay" id="<?php echo ($essay['essay_id']); ?>">
<div class="essay-left">
<div class="essay-date">
<div class="date-y"><?php echo date("Y",strtotime($essay['date']));?></div>
<div class="date-md"><?php echo date("m/d",strtotime($essay['date']));?></div>
</div>
</div>
<div class="essay-right">
<div class="bg"></div><div class="essay-triangle"></div>
<div class="essay-info">
<div class="essay-id" style="display:none;"><?php echo ($essay['essay_id']); ?></div>
<span class="essay-author"><a href="<?php echo U('User/index',array('user'=>$piece['username']));?>" target="_blank"><?php echo ($essay["userName"]); ?>  </a></span>
</div>
<div class="essay-content">
<a href=javascript:getViewPage("<?php echo U('Essay/view');?>","content","essay",<?php echo ($essay['essay_id']); ?>)><h4 class="essay-title"><?php echo ($essay["title"]); ?></h4></a>
<?php echo mb_substr(strip_tags($essay['content']),0,300,'UTF-8');?>... ...
</div>
<div class="essay-footer"><i class="icon-tag"></i> 
<?php $tags = $essay['tag']; ?> 
<?php if(is_array($tags)): foreach($tags as $key=>$tag): ?><a href="javascript:tag('<?php echo ($tag); ?>');" style="text-decoration:none;"><?php echo ($tag); ?></a>&nbsp;<?php endforeach; endif; ?>
<?php if($essay['visible'] == 0): ?>&nbsp;<i class="icon-eye-close" title="私密"></i><?php endif; ?>
<span class="essay-operation">
 <i class="icon-edit essay-modify" title="修改" onclick=window.location.href="<?php echo U('Essay/modify',array('id'=>$essay['essay_id']));?>"></i>
 <i class="icon-remove essay-remove" title="删除，请谨慎" onclick="javascript:deleteItem('essay',<?php echo ($essay['essay_id']); ?>);"></i>
 </span>
</div>
</div>
</div><?php endforeach; endif; ?>