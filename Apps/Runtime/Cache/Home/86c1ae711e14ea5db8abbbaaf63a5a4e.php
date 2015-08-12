<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<html lang="zh-cn">
<head>
<meta charset="UTF-8">
<meta http-equiv="content-type" content="text/html; charset=UTF-8">
<link rel="icon" type="image/png" href="favicon.ico">
<title><?php echo ((isset($user['username'] ) && ($user['username'] !== ""))?($user['username'] ):"我的主页"); ?></title>
<!-- <link rel="stylesheet" href="/ThinkPHP/Public/css/bootstrap/bootstrap.min.css"/> -->
<link rel="stylesheet" href="/ThinkPHP/Public/css/font-awesome/css/font-awesome.min.css"/>
<link rel="stylesheet" href="/ThinkPHP/Public/css/index.css"/>
<link rel="stylesheet" href="/ThinkPHP/Public/css/piece/piece.css"/>
<link rel="stylesheet" href="/ThinkPHP/Public/css/diary/diary.css"/>
<link rel="stylesheet" href="/ThinkPHP/Public/css/essay/essay.css"/>
<link rel="stylesheet" href="/ThinkPHP/Public/css/view.css"/>
<!-- <link rel="stylesheet" href="http://cdn.bootcss.com/flat-hs/2.2.2/css/flat-hs.min.css"/> -->
<link rel="stylesheet" href="/ThinkPHP/Public/bower_components/amazeui/dist/css/amazeui.css"/>
<!-- <link rel="stylesheet" href="/ThinkPHP/Public/bower_components/semantic/dist/components/dropdown.min.css"/> -->
<link rel="stylesheet" href="/ThinkPHP/Public/bower_components/lightbox2/dist/css/lightbox.css"/>
<!--<style type="text/css">
	#left_panel{ background-image: url('/ThinkPHP/Public/img/login_bg.png');}
	#right_panel{ background-image: url('/ThinkPHP/Public/img/bg_day.png');}
</style>-->
<script src="/ThinkPHP/Public/bower_components/jquery/dist/jquery.min.js"></script>
<script src="/ThinkPHP/Public/bower_components/jquery.lazyload/jquery.lazyload.js"></script>
<style type="text/css">
	#left_panel{ background-image: url('/ThinkPHP/Public/img/login_bg.png');}
	#right_panel{ background-image: url("/ThinkPHP/Public/img/<?php echo ($user_config['bg_img']); ?>.png");}
</style>
</head>
<body>
<div id="mask"></div>
<!-- 左边侧 个人资料面板 -->
<div id="left_panel">
<div class="user_avatar">
<img class="user_avatar hs-img" src="/ThinkPHP/Public/img/me.jpg" title="点击修改头像">
</div>
<div class="userName"><?php echo ($user["username"]); ?></div>
<div class="user_signature"><?php echo ((isset($user['signature'] ) && ($user['signature'] !== ""))?($user['signature'] ):'尚未设置签名'); ?></div>
<div class="user_items">

<div class="hs-btn-group hs-btn-group-justify">
    <button type="button" class="hs-btn hs-btn-primary hs-btn-msg" onclick="javascript:hMessage('尚未实现');"><i class="icon-envelope-alt"></i> 消息 <span class="hs-badge hs-badge-danger hs-round">15</span></button>
    <button type="button" class="hs-btn hs-btn-primary" onclick="window.location.href='<?php echo U('Essay/edit_page');?>'"><i class="icon-edit"></i> 发布</button>
    <button type="button" class="hs-btn hs-btn-primary" onclick="javascript:hMessage('尚未实现');"><i class="icon-tags"></i> 标签</button>
</div>

<button class="hs-btn hs-btn-primary hs-btn-block" onclick="javascript:window.location.href='<?php echo U('Index/index');?>'"><i class="icon-random"></i> 首页</button>
<button class="hs-btn hs-btn-primary hs-btn-block" onclick=getPage("<?php echo U('Piece/get_piece_page');?>","content",4)><i class="icon-fire"></i> 我的碎片(<?php echo ((isset($piece_nums ) && ($piece_nums !== ""))?($piece_nums ):0); ?>)</button>
<button class="hs-btn hs-btn-primary hs-btn-block" onclick=getPage("<?php echo U('Essay/get_essay_page');?>","content",2)><i class="icon-font"></i> 我的文章(<?php echo ((isset($essay_nums ) && ($essay_nums !== ""))?($essay_nums ):0); ?>)</button>
<button class="hs-btn hs-btn-primary hs-btn-block" onclick=getPage("<?php echo U('Diary/get_diary_page');?>","content",3)><i class="icon-calendar"></i> 我的日记(<?php echo ((isset($diary_nums ) && ($diary_nums !== ""))?($diary_nums ):0); ?>)</button>

<!-- <button class="hs-btn hs-btn-primary hs-btn-block" onclick=showEditPage("<?php echo U('Action/get_edit_page');?>","essay","content")><i class="icon-pencil"></i> 提笔ajax</button>
<button class="hs-btn hs-btn-primary hs-btn-block" onclick="window.location.href='<?php echo U('Essay/edit_page');?>'"><i class="icon-pencil"></i> 提笔</button> -->

</div>
<div class="hs-btn-group hs-btn-group-justify setting">
<!--  <button class="hs-btn hs-btn-primary hs-btn-block"><i class="icon-wrench"></i> 设置</button>-->
<button class="hs-btn hs-btn-primary" onclick="window.location.href='<?php echo U('Action/logout');?>'"><i class="icon-off"></i> 退出</button>
<button class="hs-btn hs-btn-primary" onclick="javascript:hMessage('尚未实现');"><i class="icon-wrench"></i> 设置</button>
<button class="hs-btn hs-btn-primary" onclick="javascript:hMessage('尚未实现');"><i class="icon-search"></i> 搜索</button>
<button class="hs-btn hs-btn-primary" onclick="hideControlPanel();"><i class="icon-arrow-left"></i> 收起</button>
</div>
</div>

<div id="right_panel">
<div id="content">

<div class="pieces">
<?php if(is_array($pieces)): foreach($pieces as $key=>$piece): ?><div class="piece" id="<?php echo ($piece['id']); ?>">
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
</div>
<!-- <button class="hs-btn hs-btn-primary hs-btn-block load_more"><i class="icon-arrow-down"></i> 加载更多</button> -->

<div id="piece_pagination" class="pagination">
</div>
<?php if($totalCount > 1): ?><script type="text/javascript">
	$('#piece_pagination').jqPaginator({
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

</div>
</div>
<!-- 回到顶部 -->
<a href="javascript:gotoTop();" id="backTop"><i class="icon-arrow-up"></i> 回到顶部</a>
</body>
<script>
	//var PUBLIC = "/ThinkPHP/Public";
	var load_essays_path = "<?php echo U('Essay/load_essays');?>";
	var public_path = "/ThinkPHP/Public";
	var editor_basePath = "/ThinkPHP/Public/editor/";
	//console.log(load_essays_path);
</script>
<!-- <script src="/ThinkPHP/Public/js/require.js" data-main="main"></script> -->
<script src="/ThinkPHP/Public/bower_components/lightbox2/dist/js/lightbox.js"></script>
<script src="/ThinkPHP/Public/bower_components/amazeui/dist/js/amazeui.js"></script>
<script src="/ThinkPHP/Public/editor/Kindeditor.js" ></script>
<script src="/ThinkPHP/Public/editor/lang/zh_CN.js"></script>
<script src="/ThinkPHP/Public/js/jqpaginator.min.js"></script>
<script src="/ThinkPHP/Public/js/index.js"></script>
<script src="/ThinkPHP/Public/js/pages.js"></script>
<script src="/ThinkPHP/Public/js/piece.js"></script> 
</html>