<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<html lang="zh" ng-app="Index" ng-controller="c_index">
<head>
	<base href="/heysoo/">
	<meta charset="UTF-8">
	<meta http-equiv="content-type" content="text/html; charset=UTF-8">
	<meta name="viewport" content="width=device-width,initial-scale=1.0">
	<link rel="icon" type="image/png" href="/Heysoo/Public/img/favicon.ico">
	<title><?php echo ((isset($userName ) && ($userName !== ""))?($userName ):"我的主页"); ?></title>
	<link rel="stylesheet" href="/Heysoo/Public/css/dist/plugins.css"/>
	<link rel="stylesheet" href="/Heysoo/Public/css/dist/index.css"/>
	<link rel="stylesheet" href="/Heysoo/Public/editor/meditor/css/editormd.min.css"/><!-- editor.md -->
</head>
<body>

<div id="mask" ng-show="mask_show">
	<div ui-view="mask"></div>
</div>
<div id="hMessage-mask"></div>

<!-- 左边栏 -->
<!-- <div id="left-panel" ng-style="style.sidebar_bg" ng-controller="c_sidePanel" ng-dblclick="toggleSidePanel()">

<div class="user-avatar">
	<img class="user-avatar hs-img" ng-src="{{avatar}}?imageView2/1/w/80/h/80">
</div>
<div class="userName">{{user_info.username}}</div>
<div class="user-signature">{{user_info.signature}}</div>
<div class="user-items">

<div class="hs-btn-group hs-btn-group-justify">
    <button type="button" class="hs-btn hs-btn-msg hs-btn-{{interface_color}}" ng-click="showMessage()"><i class="hs-icon-envelope-o"></i> 消息 <span class="hs-badge hs-badge-warning hs-radius">{{unread_msg_num}}</span></button>
    <button type="button" class="hs-btn hs-btn-{{interface_color}}" ng-click="showPublish()"><i class="hs-icon-edit"></i> 发布</button>
    <button type="button" class="hs-btn hs-btn-{{interface_color}}" ng-click="showFollow()"><i class="hs-icon-eye"></i> 关注</button>
</div>

<button class="hs-btn hs-btn-block hs-btn-{{interface_color}}" onclick="javascript:window.location.href='<?php echo U('Index/index');?>'"><i class="hs-icon-home"></i> 首页</button>
<button class="hs-btn hs-btn-block hs-btn-{{interface_color}}" ng-click="getPage('piece')"><i class="hs-icon-paper-plane"></i> 我的碎片({{piece_nums}})</button>
<button class="hs-btn hs-btn-block hs-btn-{{interface_color}}" ng-click="getPage('essay')"><i class="hs-icon-book"></i> 我的文章({{essay_nums}})</button>

</div>

<div class="hs-btn-group hs-btn-group-justify setting">
	<button class="hs-btn hs-btn-{{interface_color}}" onclick="window.location.href='<?php echo U('Action/logout');?>'"><i class="hs-icon-power-off"></i> 退出</button>
	<button class="hs-btn hs-btn-{{interface_color}}" ng-click="showSetting()"><i class="hs-icon-wrench"></i> 设置</button>
	<button type="button" class="hs-btn hs-btn-{{interface_color}}" ng-click="showTag()"><i class="hs-icon-tags"></i> 标签</button>
	<button class="hs-btn hs-btn-{{interface_color}}" ng-click="showSearch()"><i class="hs-icon-search"></i> 搜索</button>
	<button class="hs-btn hs-btn-{{interface_color}}" onclick="hideControlPanel();"><i class="hs-icon-arrow-left"></i> 收起</button>
</div>

</div> -->

<div id="right-panel" ng-style="style.main_bg">
	<!-- 顶部栏 -->
	<div id="top-bar" ng-controller="c_sidePanel">
		<div class="top-bar-wrapper">
		<div class="top-bar-left">
			<a href="javascript:void(0);" class="plain-link m-left-15" onclick="javascript:window.location.href='<?php echo U('Index/index');?>'"><i class="hs-icon-home"></i> 首页</a><!-- 首页 -->
			<a href="javascript:void(0);" class="plain-link m-left-15" ng-click="getPage('piece')"><i class="hs-icon-paper-plane"></i> 碎片</a><!-- 碎片 -->
			<a href="javascript:void(0);" class="plain-link m-left-15" ng-click="getPage('essay')"><i class="hs-icon-book"></i> 文章</a><!-- 文章 -->
		</div>
		<div class="top-bar-center">
			<a href="javascript:void(0);" class="plain-link" ng-click="showPublish()"><i class="hs-icon-paint-brush"></i> 文章</a><!-- 发布文章 -->
			<a href="javascript:void(0);" class="plain-link m-left-15" ng-click="togglePublisher()"><i class="hs-icon-paint-brush"></i> 碎片</a><!-- 发布碎片 -->
		</div>
		<div class="top-bar-right">
			<a href="javascript:void(0);" class="plain-link m-left-15" ng-click="showMessage()"><i class="hs-icon-envelope-o"></i> 消息</a><!-- 消息 -->
			<a href="javascript:void(0);" class="plain-link m-left-15" ng-click="showSearch()"><i class="hs-icon-search"></i> 搜索</a><!-- 关注 -->
			<div class="hs-dropdown m-left-15 dis-inline-block" data-hs-dropdown>
				<a href="javascript:void(0);" class="plain-link m-right-20 hs-dropdown-toggle"><!-- 头像,个人中心 -->
					<img ng-src="{{avatar}}" alt="" class="avatar">
					<i class="hs-icon-chevron-down m-left-15"></i>
				</a>
				<ul class="hs-dropdown-content">
					<li><a href="javascript:void(0);"><i class="hs-icon-book"></i> 文章</a></li>
					<li><a href="javascript:void(0);"><i class="hs-icon-paper-plane"></i> 碎片</a></li>
					<li><a href="javascript:void(0);" ng-click="showFollow()"><i class="hs-icon-eye"></i> 关注</a></li>
					<li><a href="javascript:void(0);" ng-click="showTag()"><i class="hs-icon-tags"></i> 标签</a></li>
					<li><a href="javascript:void(0);" ng-click="showSetting()"><i class="hs-icon-cog"></i> 设置</a></li>
					<li><a href="javascript:void(0);" onclick="window.location.href='<?php echo U('Action/logout');?>'"><i class="hs-icon-power-off"></i> 退出</a></li>
				</ul>
			</div>
		</div>
		</div>
		<!-- 发布器 -->
		<div class="publisher-wrapper" id="publisher">
			<div class="publisher">
				<div class="publisher-header">
					<div class="hs-alert hs-alert-warning" data-hs-alert>该编辑器尚不可使用！</div>
				</div>
				<div class="publisher-main">
					<div class="publisher-main-content" id="editormd">
						<textarea name="content"></textarea>
					</div>
					
				</div>
				<div class="publisher-footer">
					<div class="publisher-footer-toolbar">
						<div class="hs-dropdown hs-dropdown-up dis-inline-block m-left-20 m-right-20 emoji" data-hs-dropdown>
							<a href="javascript:void(0);" class="plain-link hs-dropdown-toggle" title="表情">
								<i class="hs-icon-smile-o"></i>
							</a>
							<div class="hs-dropdown-content">
							<ul class="hs-avg-sm-15">
								<li><a href="javascript:void(0);"><img src="/Heysoo/Public/img/emoji/1-1.png" alt=""></a></li>
								<li><a href="javascript:void(0);"><img src="/Heysoo/Public/img/emoji/1-2.png" alt=""></a></li>
								<li><a href="javascript:void(0);"><img src="/Heysoo/Public/img/emoji/1-3.png" alt=""></a></li>
								<li><a href="javascript:void(0);"><img src="/Heysoo/Public/img/emoji/1-4.png" alt=""></a></li>
								<li><a href="javascript:void(0);"><img src="/Heysoo/Public/img/emoji/1-5.png" alt=""></a></li>
								<li><a href="javascript:void(0);"><img src="/Heysoo/Public/img/emoji/1-6.png" alt=""></a></li>
								<li><a href="javascript:void(0);"><img src="/Heysoo/Public/img/emoji/1-7.png" alt=""></a></li>
								<li><a href="javascript:void(0);"><img src="/Heysoo/Public/img/emoji/1-8.png" alt=""></a></li>
								<li><a href="javascript:void(0);"><img src="/Heysoo/Public/img/emoji/1-9.png" alt=""></a></li>
								<li><a href="javascript:void(0);"><img src="/Heysoo/Public/img/emoji/1-10.png" alt=""></a></li>
								<li><a href="javascript:void(0);"><img src="/Heysoo/Public/img/emoji/1-11.png" alt=""></a></li>
								<li><a href="javascript:void(0);"><img src="/Heysoo/Public/img/emoji/1-12.png" alt=""></a></li>
								<li><a href="javascript:void(0);"><img src="/Heysoo/Public/img/emoji/1-13.png" alt=""></a></li>
								<li><a href="javascript:void(0);"><img src="/Heysoo/Public/img/emoji/1-14.png" alt=""></a></li>
								<li><a href="javascript:void(0);"><img src="/Heysoo/Public/img/emoji/1-15.png" alt=""></a></li>
							</ul>
							<ul class="hs-avg-sm-15">
								<li><a href="javascript:void(0);"><img src="/Heysoo/Public/img/emoji/1-16.png" alt=""></a></li>
								<li><a href="javascript:void(0);"><img src="/Heysoo/Public/img/emoji/2-1.png" alt=""></a></li>
								<li><a href="javascript:void(0);"><img src="/Heysoo/Public/img/emoji/2-2.png" alt=""></a></li>
								<li><a href="javascript:void(0);"><img src="/Heysoo/Public/img/emoji/2-3.png" alt=""></a></li>
								<li><a href="javascript:void(0);"><img src="/Heysoo/Public/img/emoji/2-4.png" alt=""></a></li>
								<li><a href="javascript:void(0);"><img src="/Heysoo/Public/img/emoji/2-5.png" alt=""></a></li>
								<li><a href="javascript:void(0);"><img src="/Heysoo/Public/img/emoji/2-6.png" alt=""></a></li>
								<li><a href="javascript:void(0);"><img src="/Heysoo/Public/img/emoji/2-7.png" alt=""></a></li>
								<li><a href="javascript:void(0);"><img src="/Heysoo/Public/img/emoji/2-8.png" alt=""></a></li>
								<li><a href="javascript:void(0);"><img src="/Heysoo/Public/img/emoji/2-9.png" alt=""></a></li>
								<li><a href="javascript:void(0);"><img src="/Heysoo/Public/img/emoji/3-1.png" alt=""></a></li>
								<li><a href="javascript:void(0);"><img src="/Heysoo/Public/img/emoji/3-2.png" alt=""></a></li>
								<li><a href="javascript:void(0);"><img src="/Heysoo/Public/img/emoji/3-3.png" alt=""></a></li>
								<li><a href="javascript:void(0);"><img src="/Heysoo/Public/img/emoji/3-4.png" alt=""></a></li>
								<li><a href="javascript:void(0);"><img src="/Heysoo/Public/img/emoji/3-5.png" alt=""></a></li>
							</ul>
							<ul class="hs-avg-sm-15">
								<li><a href="javascript:void(0);"><img src="/Heysoo/Public/img/emoji/3-6.png" alt=""></a></li>
								<li><a href="javascript:void(0);"><img src="/Heysoo/Public/img/emoji/4-1.png" alt=""></a></li>
								<li><a href="javascript:void(0);"><img src="/Heysoo/Public/img/emoji/4-2.png" alt=""></a></li>
								<li><a href="javascript:void(0);"><img src="/Heysoo/Public/img/emoji/4-3.png" alt=""></a></li>
								<li><a href="javascript:void(0);"><img src="/Heysoo/Public/img/emoji/5-1.png" alt=""></a></li>
								<li><a href="javascript:void(0);"><img src="/Heysoo/Public/img/emoji/5-2.png" alt=""></a></li>
								<li><a href="javascript:void(0);"><img src="/Heysoo/Public/img/emoji/5-3.png" alt=""></a></li>
								<li><a href="javascript:void(0);"><img src="/Heysoo/Public/img/emoji/6-0.png" alt=""></a></li>
								<li><a href="javascript:void(0);"><img src="/Heysoo/Public/img/emoji/6-1.png" alt=""></a></li>
								<li><a href="javascript:void(0);"><img src="/Heysoo/Public/img/emoji/6-2.png" alt=""></a></li>
								<li><a href="javascript:void(0);"><img src="/Heysoo/Public/img/emoji/6-3.png" alt=""></a></li>
								<li><a href="javascript:void(0);"><img src="/Heysoo/Public/img/emoji/6-4.png" alt=""></a></li>
								<li><a href="javascript:void(0);"><img src="/Heysoo/Public/img/emoji/6-5.png" alt=""></a></li>
								<li><a href="javascript:void(0);"><img src="/Heysoo/Public/img/emoji/6-6.png" alt=""></a></li>
								<li><a href="javascript:void(0);"><img src="/Heysoo/Public/img/emoji/6-7.png" alt=""></a></li>
							</ul>
							<ul class="hs-avg-sm-15">
								<li><a href="javascript:void(0);"><img src="/Heysoo/Public/img/emoji/6-8.png" alt=""></a></li>
								<li><a href="javascript:void(0);"><img src="/Heysoo/Public/img/emoji/6-9.png" alt=""></a></li>
								<li><a href="javascript:void(0);"><img src="/Heysoo/Public/img/emoji/6-10.png" alt=""></a></li>
								<li><a href="javascript:void(0);"><img src="/Heysoo/Public/img/emoji/6-11.png" alt=""></a></li>
								<li><a href="javascript:void(0);"><img src="/Heysoo/Public/img/emoji/6-12.png" alt=""></a></li>
								<li><a href="javascript:void(0);"><img src="/Heysoo/Public/img/emoji/6-13.png" alt=""></a></li>
								<li><a href="javascript:void(0);"><img src="/Heysoo/Public/img/emoji/6-14.png" alt=""></a></li>
								<li><a href="javascript:void(0);"><img src="/Heysoo/Public/img/emoji/6-15.png" alt=""></a></li>
								<li><a href="javascript:void(0);"><img src="/Heysoo/Public/img/emoji/6-16.png" alt=""></a></li>
								<li><a href="javascript:void(0);"><img src="/Heysoo/Public/img/emoji/6-17.png" alt=""></a></li>
								<li><a href="javascript:void(0);"><img src="/Heysoo/Public/img/emoji/7-0.png" alt=""></a></li>
								<li><a href="javascript:void(0);"><img src="/Heysoo/Public/img/emoji/7-1.png" alt=""></a></li>
								<li><a href="javascript:void(0);"><img src="/Heysoo/Public/img/emoji/7-2.png" alt=""></a></li>
								<li><a href="javascript:void(0);"><img src="/Heysoo/Public/img/emoji/7-3.png" alt=""></a></li>
								<li><a href="javascript:void(0);"><img src="/Heysoo/Public/img/emoji/7-4.png" alt=""></a></li>
								<li><a href="javascript:void(0);"><img src="/Heysoo/Public/img/emoji/7-5.png" alt=""></a></li>
								<li><a href="javascript:void(0);"><img src="/Heysoo/Public/img/emoji/7-6.png" alt=""></a></li>
								<li><a href="javascript:void(0);"><img src="/Heysoo/Public/img/emoji/7-7.png" alt=""></a></li>
							</ul>
							</div>
						</div>
						<div class="hs-dropdown hs-dropdown-up dis-inline-block m-right-20 image" data-hs-dropdown>
							<a href="javascript:void(0);" class="plain-link hs-dropdown-toggle" title="图片">
								<i class="hs-icon-image"></i>
							</a>
							<div class="hs-dropdown-content">
								<div class="hs-input-group song-search">
									<input type="text" class="hs-form-field" placeholder="在此输图片地址">
									<span class="hs-input-group-btn">
										<button class="hs-btn hs-btn-default" type="button">插入</button>
									</span>
								</div>
							</div>
						</div>
						<div class="hs-dropdown hs-dropdown-up dis-inline-block m-right-20 music" data-hs-dropdown>
							<a href="javascript:void(0);" class="plain-link hs-dropdown-toggle" title="音乐">
								<i class="hs-icon-music"></i>
							</a>
							<div class="hs-dropdown-content">
								<div class="hs-input-group song-search">
									<input type="text" class="hs-form-field" placeholder="在此输入歌曲/歌手名称">
									<span class="hs-input-group-btn">
										<button class="hs-btn hs-btn-default" type="button">搜索</button>
									</span>
								</div>
							</div>
						</div>
						<div class="hs-dropdown hs-dropdown-up dis-inline-block" data-hs-dropdown>
							<a href="javascript:void(0);" class="plain-link hs-dropdown-toggle" title="可见性">
								<i class="hs-icon-eye"></i>
							</a>
							<ul class="hs-dropdown-content">
								<li><a href="javascript:void(0);"><i class="hs-icon-unlock"></i> 所有人可见(默认)</a></li>
								<li><a href="javascript:void(0);"><i class="hs-icon-lock"></i> 仅自己可见</a></li>
							</ul>
						</div>
					</div>
					<div class="hs-input-group tag">
						<span class="hs-input-group-label"><i class="hs-icon hs-icon-tag"></i></span>
						<input type="text" class="hs-form-field" placeholder="在此输入标签">
						<span class="hs-input-group-btn">
							<button class="hs-btn hs-btn-default" type="button">发布</button>
						</span>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div id="content">
		<div ui-view="content" class="content-view">
		<div ng-include="'/Heysoo/Public/templates/Index/index.html'"></div>
		</div>
	</div>
</div>
<!-- 回到顶部 -->
<a href="javascript:gotoTop();" id="backTop" class="plain-link"><i class="hs-icon-arrow-circle-up hs-icon-md"></i></a>
</body>
<script>
	var load_essays_path = "<?php echo U('Essay/load_essays');?>";
	var public_path = "/Heysoo/Public";
	var editor_basePath = "/Heysoo/Public/editor/";
	var get_token_path = "<?php echo U('Action/get_qiniu_token');?>";
	var home_path = "/Heysoo";
</script>
<script src="/Heysoo/Public/js/dist/plugins.js"></script>
<script src="/Heysoo/Public/js/dist/angular.js"></script>
<script src="/Heysoo/Public/js/dist/index.js"></script>
<script src="/Heysoo/Public/js/dist/app.js"></script>
<script src="/Heysoo/Public/editor/meditor/js/editormd.min.js"></script><!-- editor.md -->
</html>