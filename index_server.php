<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006-2014 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: liu21st <liu21st@gmail.com>
// +----------------------------------------------------------------------
//$request_url =  $_SERVER['REQUEST_URI'];
/*echo $request_url;
if($request_url == "/heysoo/")echo "equal";
else echo "not equal";
exit();*/
//if(strstr($request_url,"index.html") === false && strstr($request_url,"heysoo/Index") === false){echo "<script>window.location.href='http://localhost/heysoo/Index/';</script>";exit();}
// 应用入口文件
// 检测PHP环境
if(version_compare(PHP_VERSION,'5.3.0','<'))  die('require PHP > 5.3.0 !');

// 开启调试模式 建议开发阶段开启 部署阶段注释或者设为false
define('APP_DEBUG',True);

define('BIND_MODULE', 'Home');
//定义运行时目录
//define('RUNTIME_PATH','./Runtime/');

// 定义应用目录
define('APP_PATH','../Apps/');

// 引入ThinkPHP入口文件
require '../Core/ThinkPHP.php';

// 亲^_^ 后面不需要任何代码了 就是如此简单