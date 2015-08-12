<?php if (!defined('THINK_PATH')) exit();?><div class="diarys">
<?php if(is_array($diarys)): foreach($diarys as $key=>$diary): ?><div class="diary" id="<?php echo ($diary['id']); ?>">
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
<?php if(is_array($tags)): foreach($tags as $key=>$tag): ?><a href="javascript:tag('<?php echo ($tag); ?>');" style="text-decoration:none;"><?php echo ($tag); ?></a>&nbsp;<?php endforeach; endif; ?>
<?php if($diary['visible'] == 0): ?><i class="icon-eye-close" title="私密"></i><?php endif; ?>
<span class="diary_operation">
 <i class="icon-edit diary-modify" title="修改" onclick=window.location.href="<?php echo U('Diary/modify',array('id'=>$diary['id']));?>"></i>
 <i class="icon-remove diary-remove" title="删除，请谨慎" onclick="javascript:deleteItem('diary',<?php echo ($diary['id']); ?>);"></i>
 </span>
</div>
</div>
</div><?php endforeach; endif; ?> 
</div>

<!-- <button class="hs-btn hs-btn-primary hs-btn-block load_more"><i class="icon-arrow-down"></i> 加载更多</button> -->

<div id="diary_pagination" class="pagination">
</div>
<?php if($totalCount > 1): ?><script type="text/javascript">
	$('#diary_pagination').jqPaginator({
		prev: '<li class="prev"><a href="javascript:;">上一页</a></li>',
		next: '<li class="next"><a href="javascript:;">下一页</a></li>',
		page: '<li class="page"><a href="javascript:;">{{page}}</a></li>',
		first: '<li class="first"><a href="javascript:;">首页</a></li>',
		last: '<li class="last"><a href="javascript:;">末页</a></li>',
	    totalPages: <?php echo ($totalPage); ?>,
	    totalCounts:<?php echo ($totalCount); ?>,
	    pageSize:<?php echo ($pageSize); ?>,
	    visiblePages: 7,
	    currentPage: 1,
	    onPageChange: function (num, type) {
	        $.ajax({
	        	url:controller_path+"Diary/load_diarys_html.html",
				type:'GET',
				data:{'page':num-1,'type':type},
				dataType:'json',
				success:function(data){
					if(data.error == 0){
						$(".diarys").empty();
						$(".diarys").html(data.html);
						$(document).scrollTop(0);
					}
				},
				error:function(XMLHttpRequest, textStatus, errorThrown){
					console.log(XMLHttpRequest);
				}
	        });
	    }
	});
</script><?php endif; ?>