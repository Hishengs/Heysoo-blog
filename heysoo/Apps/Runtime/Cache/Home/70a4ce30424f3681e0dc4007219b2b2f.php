<?php if (!defined('THINK_PATH')) exit(); if(is_array($diarys)): foreach($diarys as $key=>$diary): ?><div class="diary">
<div class="diary_left">
<div class="diary_date">
<div class="date_y"><?php echo date("Y",strtotime($diary['date']));?></div>
<div class="date_md"><?php echo date("m/d",strtotime($diary['date']));?></div>
</div>
</div>
<div class="diary_right">
<div class="bg"></div><div class="diary_triangle"></div>
<div class="diary_info">
<span class="diary_author"><a href="<?php echo U('User/index',array('user'=>$piece['username']));?>" target="_blank"><?php echo ($diary["userName"]); ?>  </a></span>
</div>
<div class="diary_content">
<a href=javascript:getViewPage("<?php echo U('Diary/view');?>","content","diary",<?php echo ($diary['id']); ?>)><h4>《<?php echo ($diary["title"]); ?>》</h4></a>
<?php echo mb_substr(strip_tags($diary['content']),0,150,'UTF-8');?>... ...
</div>
<div class="diary_footer"><i class="icon-tag"></i> 
<?php $tags = $diary['tag']; ?> 
<?php if(is_array($tags)): foreach($tags as $key=>$tag): ?><a href="<?php echo U('Action/tag',array('tag'=>$tag));?>" style="text-decoration:none;"><?php echo ($tag); ?></a>&nbsp;<?php endforeach; endif; ?>
<?php if($diary['visible'] == 0): ?><i class="icon-eye-close" title="私密"></i><?php endif; ?>
 <i class="icon-remove piece-remove" title="删除" onclick=javascript:javascript:deleteItem("<?php echo U('Diary/delete');?>",'diary',<?php echo ($diary['id']); ?>);></i>
</div>
</div>
</div><?php endforeach; endif; ?> 
<button class="btn btn-primary btn-block load_more"><i class="icon-arrow-down"></i> 加载更多</button>