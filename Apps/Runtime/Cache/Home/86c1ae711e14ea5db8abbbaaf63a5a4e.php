<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<html lang="zh-cn" ng-app="Index" ng-controller="c_index">
<head>
<base href="/Heysoo/Home/Index/">
<meta charset="UTF-8">
<meta http-equiv="content-type" content="text/html; charset=UTF-8">
<link rel="hs-icon" type="image/png" href="favicon.ico">
<title><?php echo ((isset($user['username'] ) && ($user['username'] !== ""))?($user['username'] ):"我的主页"); ?></title>
<link rel="stylesheet" href="/Heysoo/Public/bower/fontawesome/css/font-awesome.min.css"/>
<link rel="stylesheet" href="/Heysoo/Public/bower/lightbox2/dist/css/lightbox.css"/>
<link rel="stylesheet" href="/Heysoo/Public/css/dist/plugins.css"/>
<link rel="stylesheet" href="/Heysoo/Public/css/dist/index.css"/>
<style type="text/css">
	#left-panel{ background-image: url('/Heysoo/Public/img/login_bg.png');}
	body{ background-image: url("/Heysoo/Public/img/<?php echo ($user_config['bg_img']); ?>.png");}
</style>
</head>
<body>
<div id="mask"></div>
<div id="hMessage-mask"></div>

<div id="left-panel">
<div class="user-avatar">
<img class="user-avatar hs-img" src="/Heysoo/Public/img/me.jpg" title="点击修改头像">
</div>
<div class="userName"><?php echo ($user["username"]); ?></div>
<div class="user-signature"><?php echo ((isset($user['signature'] ) && ($user['signature'] !== ""))?($user['signature'] ):'尚未设置签名'); ?></div>
<div class="user-items">

<div class="hs-btn-group hs-btn-group-justify">
    <button type="button" class="hs-btn hs-btn-primary hs-btn-msg" onclick="javascript:hMessage('尚未实现');"><i class="hs-hs-icon-envelope-alt"></i> 消息 <span class="hs-badge hs-badge-danger hs-round">15</span></button>
    <!-- <button type="button" class="hs-btn hs-btn-primary" onclick="window.location.href='<?php echo U('Essay/edit_page');?>'"><i class="hs-icon-edit"></i> 发布</button> -->
    <button type="button" class="hs-btn hs-btn-primary" ng-click="edit()"><i class="hs-icon-edit"></i> 发布</button>
    <button type="button" class="hs-btn hs-btn-primary" onclick="javascript:hMessage('尚未实现');"><i class="hs-icon-tags"></i> 标签</button>
</div>

<button class="hs-btn hs-btn-primary hs-btn-block" onclick="javascript:window.location.href='<?php echo U('Index/index');?>'"><i class="hs-icon-random"></i> 首页</button>
<button class="hs-btn hs-btn-primary hs-btn-block" ng-click="getPage('piece')"><i class="hs-icon-fire"></i> 我的碎片(<?php echo ((isset($piece_nums ) && ($piece_nums !== ""))?($piece_nums ):0); ?>)</button>
<button class="hs-btn hs-btn-primary hs-btn-block" ng-click="getPage('essay')"><i class="hs-icon-font"></i> 我的文章(<?php echo ((isset($essay_nums ) && ($essay_nums !== ""))?($essay_nums ):0); ?>)</button>
<button class="hs-btn hs-btn-primary hs-btn-block" onclick=getPage("<?php echo U('Diary/get_diary_page');?>","content",3)><i class="hs-icon-calendar"></i> 我的日记(<?php echo ((isset($diary_nums ) && ($diary_nums !== ""))?($diary_nums ):0); ?>)</button>

</div>
<div class="hs-btn-group hs-btn-group-justify setting">
<button class="hs-btn hs-btn-primary" onclick="window.location.href='<?php echo U('Action/logout');?>'"><i class="hs-icon-off"></i> 退出</button>
<button class="hs-btn hs-btn-primary" onclick="javascript:hMessage('尚未实现');"><i class="hs-icon-wrench"></i> 设置</button>
<button class="hs-btn hs-btn-primary" onclick="javascript:hMessage('尚未实现');"><i class="hs-icon-search"></i> 搜索</button>
<button class="hs-btn hs-btn-primary" onclick="hideControlPanel();"><i class="hs-icon-arrow-left"></i> 收起</button>
</div>
</div>

<div id="right-panel">
<div id="content" ng-controller="c_content">
<div ui-view="content">
<div class="pieces">
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
</div>
</div>
</div>
<!-- 回到顶部 -->
<a href="javascript:gotoTop();" id="backTop"><i class="hs-icon-arrow-up"></i> 回到顶部</a>
</body>
<script>
	var load_essays_path = "<?php echo U('Essay/load_essays');?>";
	var public_path = "/Heysoo/Public";
	var editor_basePath = "/Heysoo/Public/editor/";
	var getTokenPath = "<?php echo U('Action/get_qiniu_token');?>";
	var home_path = "/Heysoo/Home";
</script>
<script src="/Heysoo/Public/js/dist/plugins.js"></script>
<script src="/Heysoo/Public/js/dist/angular.js"></script>
<script src="/Heysoo/Public/js/dist/index.js"></script>
<script src="/Heysoo/Public/js/app.js"></script>
<script src="/Heysoo/Public/editor/epiceditor/js/epiceditor.min.js"></script>
</html>