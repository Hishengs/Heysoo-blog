<?php if (!defined('THINK_PATH')) exit();?><div class="pieces">
<?php if(is_array($pieces)): foreach($pieces as $key=>$piece): ?><div class="piece" id="<?php echo ($piece['piece_id']); ?>">
<div class="piece-left">
<div class="essay-date">
<div class="date-y"><?php echo date("Y",strtotime($piece['date']));?></div>
<div class="date-md"><?php echo date("m/d",strtotime($piece['date']));?></div>
</div>
</div>
<div class="piece-right">
<div class="bg"></div><div class="piece-triangle"></div>
<div class="piece-info">
<span class="piece-author"><?php echo ($piece["username"]); ?> &nbsp; &nbsp;发布于</span>
<span class="piece-date"> <i class="icon-time" title="发布时间"></i> <?php echo date("Y-m-d",strtotime($piece['date']));?></span>
</div>
<div class="piece-content">
<?php echo ($piece["content"]); ?>
</div>
<div class="piece-footer"><i class="icon-tag"></i>  
<?php $tags = $piece['tag']; ?> 
<?php if(is_array($tags)): foreach($tags as $key=>$tag): ?><a href="javascript:tag('<?php echo ($tag); ?>');" class="tag" style="text-decoration:none;"><?php echo ($tag); ?></a>&nbsp;<?php endforeach; endif; ?>
<?php if($piece['visible'] == 0): ?><i class="icon-eye-close" title="私密"></i><?php endif; ?>
 <span class="piece-operation">
 <i class="icon-remove piece-remove" title="删除，请谨慎" onclick="javascript:deleteItem('piece',<?php echo ($piece['piece_id']); ?>);"></i>
 </span>
</div>
</div>
</div><?php endforeach; endif; ?>
</div>
<!-- <button class="hs-btn hs-btn-primary hs-btn-block load-more"><i class="icon-arrow-down"></i> 加载更多</button> -->

<div id="piece-pagination" class="pagination">
</div>
<?php if($totalCount > 1): ?><script type="text/javascript">
	$('#piece-pagination').jqPaginator({
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
	        	url:controller_path+"Piece/load_pieces_html.html",
				type:'GET',
				data:{'page':num-1,'type':type},
				dataType:'json',
				success:function(data){
					if(data.error == 0){
						$(".pieces").empty();
						$(".pieces").html(data.html);
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