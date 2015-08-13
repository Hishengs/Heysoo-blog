<?php if (!defined('THINK_PATH')) exit();?><div class="essays">
<?php if(is_array($essays)): foreach($essays as $key=>$essay): ?><div class="essay" id="<?php echo ($essay['essay_id']); ?>">
<div class="essay-left">
<div class="essay-date">
<div class="date-y"><?php echo date("Y",strtotime($essay['date']));?></div>
<div class="date-md"><?php echo date("m/d",strtotime($essay['date']));?></div>
</div>
</div>
<div class="essay-right">
<div class="bg"></div><div class="essay-triangle"></div>
<div class="essay-info">
<a href=javascript:getViewPage("<?php echo U('Essay/view');?>","content","essay",<?php echo ($essay['essay_id']); ?>)><h4 class="essay-title"><?php echo ($essay["title"]); ?></h4></a>
<div class="essay-id" style="display:none;"><?php echo ($essay['essay_id']); ?></div>
</div>
<div class="essay-content">
<?php echo mb_substr(strip_tags($essay['content']),0,300,'UTF-8');?>... ...
</div>
<div class="essay-footer"><i class="icon-tag"></i> 
<?php $tags = $essay['tag']; ?> 
<?php if(is_array($tags)): foreach($tags as $key=>$tag): ?><a href="javascript:tag('<?php echo ($tag); ?>');"><?php echo ($tag); ?></a>&nbsp;<?php endforeach; endif; ?>
<?php if($essay['visible'] == 0): ?>&nbsp;<i class="icon-eye-close" title="私密"></i><?php endif; ?>
<span class="essay-operation">
 <i class="icon-edit essay-modify" title="修改" onclick=window.location.href="<?php echo U('Essay/modify',array('id'=>$essay['essay_id']));?>"></i>
 <i class="icon-remove essay-remove" title="删除，请谨慎" onclick="javascript:deleteItem('essay',<?php echo ($essay['essay_id']); ?>);"></i>
 </span>
</div>
</div>
</div><?php endforeach; endif; ?> 
</div>
<!-- <button class="hs-btn hs-btn-primary hs-btn-block load-more" onclick=loadMore("<?php echo U('Essay/get_essay_page');?>","content")><i class="icon-arrow-down"></i> 加载更多</button> -->

<div id="essay-pagination" class="pagination">
</div>
<?php if($totalCount > 1): ?><script type="text/javascript">
	$('#essay-pagination').jqPaginator({
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
	        	url:controller_path+"Essay/load_essays_html.html",
				type:'GET',
				data:{'page':num-1,'type':type},
				dataType:'json',
				success:function(data){
					if(data.error == 0){
						$(".essays").empty();
						$(".essays").html(data.html);
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