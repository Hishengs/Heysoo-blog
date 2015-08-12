<?php if (!defined('THINK_PATH')) exit(); if(is_array($essays)): foreach($essays as $key=>$essay): ?><div class="essay">
<div class="essay_left">
<div class="essay_date">
<div class="date_y"><?php echo date("Y",strtotime($essay['date']));?></div>
<div class="date_md"><?php echo date("m/d",strtotime($essay['date']));?></div>
</div>
</div>
<div class="essay_right">
<div class="bg"></div><div class="essay_triangle"></div>
<div class="essay_info">
<div class="essay_id" style="display:none;"><?php echo ($essay['id']); ?></div>
<span class="essay_author"><a href="<?php echo U('User/index',array('user'=>$piece['username']));?>" target="_blank"><?php echo ($essay["userName"]); ?>  </a></span>
</div>
<div class="essay_content">
<a href=javascript:getViewPage("<?php echo U('Essay/view');?>","content","essay",<?php echo ($essay['id']); ?>)><h4 class="title">《<?php echo ($essay["title"]); ?>》</h4></a>
<?php echo mb_substr(strip_tags($essay['content']),0,150,'UTF-8');?>... ...
</div>
<div class="essay_footer"><i class="icon-tag"></i> 
<?php $tags = $essay['tag']; ?> 
<?php if(is_array($tags)): foreach($tags as $key=>$tag): ?><a href="<?php echo U('Action/tag',array('tag'=>$tag));?>" style="text-decoration:none;"><?php echo ($tag); ?></a>&nbsp;<?php endforeach; endif; ?>
<?php if($essay['visible'] == 0): ?><i class="icon-eye-close" title="私密"></i><?php endif; ?>
<span class="essay_operation">
 <i class="icon-edit essay-modify" title="修改" onclick=window.location.href="<?php echo U('Essay/show_modify',array('id'=>$essay['id']));?>"></i>
 <i class="icon-remove essay-remove" title="删除，请谨慎" onclick=javascript:deleteItem("<?php echo U('Essay/delete');?>",'essay',<?php echo ($essay['id']); ?>);></i>
 </span>
</div>
</div>
</div><?php endforeach; endif; ?> 
<button class="hs-btn hs-btn-primary hs-btn-block load_more" onclick=loadMore("<?php echo U('Essay/get_essay_page');?>","content")><i class="icon-arrow-down"></i> 加载更多</button>
<!-- <a class="load_more" href=javascript:loadMore("<?php echo U('Essay/get_essay_page');?>","content")>加载更多</a> -->