<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title><?php echo ($user["username"]); ?>-主页</title>
<link rel="stylesheet" href="/ThinkPHP/Public/css/bootstrap/bootstrap.min.css"/>
<link rel="stylesheet" href="/ThinkPHP/Public/css/font-awesome/css/font-awesome.min.css"/>
<link rel="stylesheet" href="/ThinkPHP/Public/css/index.css"/>
<style type="text/css">
	body{ background-image: url('/ThinkPHP/Public/img/login_bg.jpg');}
</style>
</head>
<body>
<!-- 左边侧 个人资料面板 -->
<div id="left_panel">
<div class="user_avatar">
<img class="user_avatar_img" src="/ThinkPHP/Public/img/lion.png">
</div>
<div class="userName"><?php echo ($user["username"]); ?></div>
<div class="user_signature"><?php echo ((isset($user['signature'] ) && ($user['signature'] !== ""))?($user['signature'] ):'尚未设置签名'); ?></div>
<div class="user_items">

<?php if($isSelf != 1): ?><div class="btn-group btn-group-justified post-group" role="group" aria-label="...">
  <div class="btn-group" role="group">
    <button type="button" class="btn btn-primary btn-follow" onclick="javascript:;"><i class="icon-eye-open"></i> 关注他</button>
  </div>
  <div class="btn-group" role="group">
    <button type="button" class="btn btn-primary btn-send-msg" onclick="javascript:;"><i class="icon-envelope-alt"></i> 发消息</button>
  </div>
</div><?php endif; ?>

<button class="btn btn-primary btn-block" onclick=getPage("<?php echo U('Piece/get_piece_page');?>","content")><i class="icon-fire"></i> 碎片(<?php echo ((isset($piece_nums ) && ($piece_nums !== ""))?($piece_nums ):0); ?>)</button>
<button class="btn btn-primary btn-block" onclick=getPage("<?php echo U('Essay/get_essay_page',array('userName'=>$user['username']));?>","content")><i class="icon-font"></i> 文章(<?php echo ((isset($essay_nums ) && ($essay_nums !== ""))?($essay_nums ):0); ?>)</button>
<button class="btn btn-primary btn-block" onclick=getPage("<?php echo U('Diary/get_diary_page',array('userName'=>$user['username']));?>","content")><i class="icon-calendar"></i> 日记(<?php echo ((isset($diary_nums ) && ($diary_nums !== ""))?($diary_nums ):0); ?>)</button>

</div>
<div class="setting">
<!--  <button class="btn btn-primary btn-block"><i class="icon-wrench"></i> 设置</button>-->
<p class="bg-primary">
<button class="btn btn-primary" onclick="hideControlPanel();"><i class="icon-arrow-left"></i> 收起</button>
</p>
</div>
</div>

<div id="right_panel">
<div id="content">

<?php if(is_array($pieces)): foreach($pieces as $key=>$piece): ?><div class="piece">
<div class="piece_left">
<div class="essay_date">
<div class="date_y"><?php echo date("Y",strtotime($piece['date']));?></div>
<div class="date_md"><?php echo date("m/d",strtotime($piece['date']));?></div>
</div>
</div>
<div class="piece_right">
<div class="bg"></div><div class="piece_triangle"></div>
<div class="piece_info">
<span class="piece_author"><?php echo ($piece["username"]); ?> &nbsp; </span>
<span class="piece_date"> <i class="icon-time" title="发布时间"></i> <?php echo date("Y-m-d",strtotime($piece['date']));?></span>
</div>
<div class="piece_content">
<?php echo ($piece["content"]); ?>
</div>
<div class="piece_footer"><i class="icon-tag" title="碎片标签"></i>  <?php echo ($piece["tag"]); ?>
</div>
</div>
</div><?php endforeach; endif; ?>

<button class="btn btn-primary btn-block load_more"><i class="icon-arrow-down"></i> 加载更多</button>

</div>
</div>

<!-- 回到顶部 -->
<a href="javascript:gotoTop();" id="backTop"><i class="icon-arrow-up"></i> 回到顶部</a>
</body>
<script>
	var load_essays_path = "<?php echo U('Essay/load_essays');?>";
	var public_path = "/ThinkPHP/Public";
</script>
<!-- <script src="/ThinkPHP/Public/js/jQuery/jquery-2.1.1.min.js"></script> -->
<script src="/ThinkPHP/Public/bower_components/jquery/dist/jquery.min.js"></script>
<script src="/ThinkPHP/Public/js/index.js"></script>
<script src="/ThinkPHP/Public/js/pages.js"></script>
<script src="/ThinkPHP/Public/js/piece.js"></script>
</html>