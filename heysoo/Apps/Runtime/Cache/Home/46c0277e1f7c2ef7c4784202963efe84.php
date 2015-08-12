<?php if (!defined('THINK_PATH')) exit(); if(is_array($pieces)): foreach($pieces as $key=>$piece): ?><div class="piece">
<div class="piece_left">
<a href="<?php echo U('User/index',array('user'=>$piece['username']));?>" target="_blank"><img class="piece_avatar" src="/ThinkPHP/Public/img/lion.png" title="访问他/她的主页"/></a>
</div>
<div class="piece_right">
<div class="bg"></div><div class="piece_triangle"></div>
<div class="piece_info">
<span class="piece_author"><a href="<?php echo U('User/index',array('user'=>$piece['username']));?>" target="_blank"><?php echo ($piece["username"]); ?>  </a></span>
<span class="piece_date"><i class="icon-time"></i> <?php echo date("Y-m-d",strtotime($piece['date']));?></span>
</div>
<div class="piece_content">
<?php echo ($piece["content"]); ?>
</div>
<div class="piece_footer"><i class="icon-tag"></i>
<?php $tags = $piece['tag']; ?> 
<?php if(is_array($tags)): foreach($tags as $key=>$tag): ?><a href="<?php echo U('Action/tag',array('tag'=>$tag));?>" style="text-decoration:none;"><?php echo ($tag); ?></a>&nbsp;<?php endforeach; endif; ?>
<?php if($piece['ispublic'] == 0): ?><i class="icon-eye-close" title="私密"></i><?php endif; ?>
</div>
</div>
</div><?php endforeach; endif; ?>

<button class="hs-btn hs-btn-primary hs-btn-block load_more"><i class="icon-arrow-down"></i> 加载更多</button>