<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>个人主页</title>
<link rel="stylesheet" href="/ThinkPHP/Public/css/bootstrap/bootstrap.min.css"/>
<link rel="stylesheet" href="/ThinkPHP/Public/css/font-awesome/css/font-awesome.min.css"/>
<link rel="stylesheet" href="/ThinkPHP/Public/css/index.css"/>
</head>
<body>
<!-- 左边侧 个人资料面板 -->
<div id="left_panel">
<div id="user_avatar">
<img class="user_avatar_img" src="/ThinkPHP/Public/img/lion.png" title="点击修改头像">
</div>
<div class="userName">爱新觉罗-玉凤</div>
<div class="user_signature">算什么男人，周杰伦</div>
<div class="user_items">
<button class="btn btn-primary btn-block" onclick="window.location.href='<?php echo U('Index/index');?>'"><i class="icon-random"></i> 发现</button>
<button class="btn btn-primary btn-block" onclick="window.location.href='<?php echo U('Essay/get_essays');?>'"><i class="icon-font"></i> 文章</button>
<button class="btn btn-primary btn-block"><i class="icon-calendar"></i> 日记</button>
<button class="btn btn-primary btn-block"><i class="icon-fire"></i> 碎片</button>
<button class="btn btn-primary btn-block"><i class="icon-pencil"></i> 提笔</button>
</div>
<div class="setting">
<!--  <button class="btn btn-primary btn-block"><i class="icon-wrench"></i> 设置</button>-->
<p class="bg-primary">
<button class="btn btn-primary"><i class="icon-wrench"></i> 设置</button>
<button class="btn btn-primary"><i class="icon-off"></i> 退出</button>
<button class="btn btn-primary" onclick="hideControlPanel();"><i class="icon-arrow-left"></i> 收起</button>
</p>
</div>
</div>

<div id="right_panel">
<div id="content">

<?php if($current_app == 'explore'): elseif($current_app == 'essay'): ?>
<?php if(is_array($essays)): foreach($essays as $key=>$essay): ?><div class="essay">
<div class="essay_left">
<img class="essay_avatar" src="/ThinkPHP/Public/img/lion.png" title="访问他/她的主页"/>
</div>
<div class="essay_right">
<div class="bg"></div><div class="essay_triangle"></div>
<div class="essay_info">
<!--<span class="essay_author"><?php echo ($essay["author"]); ?>  </span>-->
<span class="essay_date"><i class="icon-calendar"></i> <?php echo date("Y-m-d",strtotime($essay['date']));?></span>
</div>
<div class="essay_content">
<a href="javascript:;"><h4>《<?php echo ($essay["title"]); ?>》</h4></a>
<?php echo mb_substr(strip_tags($essay['content']),0,150,'UTF-8');?>... ...
</div>
<div class="essay_footer"><i class="icon-tag"></i> <?php echo ($essay["tag"]); ?></div>
</div>
</div><?php endforeach; endif; ?>

<button class="btn btn-primary btn-block load_more"><i class="icon-arrow-down"></i> 加载更多</button><?php endif; ?>

</div>
<!-- 回到顶部 -->
<a href="javascript:gotoTop();" id="backTop"><i class="icon-arrow-up"></i> 回到顶部</a>
</div>

</body>
<script src="/ThinkPHP/Public/js/jQuery/jquery-2.1.1.min.js"></script>
<script src="/ThinkPHP/Public/js/index.js"></script>
<script src="/ThinkPHP/Public/js/jquery.event.drag-2.2.js"></script>
</html>