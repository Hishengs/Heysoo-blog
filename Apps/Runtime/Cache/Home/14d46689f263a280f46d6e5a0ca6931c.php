<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<html ng-app="Heysoo">
<head>
	<title>Angular Test</title>
</head>
<body>
Angular文件包含测试
<div ng-include="'/Heysoo/Public/templates/tag.html'"></div>
</body>
</html>
<script src="http://cdn.bootcss.com/angular.js/1.4.3/angular.min.js"></script>
<script type="text/javascript">
var app = angular.module('Heysoo',[]);
</script>