<?php
return array(
	//'配置项'=>'配置值'
	//数据库配置信息
	'DB_TYPE'   => 'mysql', // 数据库类型
	'DB_HOST'   => 'localhost', // 服务器地址
	'DB_NAME'   => 'heysoo', // 数据库名
	'DB_USER'   => 'root', // 用户名
	'DB_PWD'    => '8355189', // 密码
	'DB_PORT'   => 3306, // 端口
	'DB_PREFIX' => 'hs_', // 数据库表前缀
	'DB_CHARSET'=> 'utf8', // 字符集
	'DB_DEBUG'  =>  TRUE, // 数据库调试模式 开启后可以记录SQL日志 3.2.3新增
	//'LAYOUT_ON' => TRUE,//开启模板布局
	//'LAYOUT_NAME' => 'layout',
	'LOGIN_VERIFY_CODE_ON' => false, //是否开启登录验证码验证
	'REGISTER_VERIFY_CODE_ON' => false, //是否开启注册验证码验证
	'REGISTER_INVITE_CODE_ON' => false, //是否开启邀请码注册
	'QINIU' => array(
		//'BUCKET' => 'blueandwhite',
		//'BUCKET_URL_PREFIX' => 'https://dn-lanbaidiao.qbox.me/',
		'BUCKET' => 'static',
		'BUCKET_URL_PREFIX' => 'https://dn-static-heysoo.qbox.me/',
		'SK' => 'BylB8ABOnBdhzwcsUOC2kp2teC9jHMAGzmIii5Dv',
		'AK' => 'EWNeHQINB7Lm-Xa9sYFrU5K_RBBoTOWNFpEF4T0h',
	),
	'SITE_PREFIX' => 'http://localhost:8080',
	'URL_MODEL' => 2,
	'ESSAY_COMMENT_ON' => true,
	'PIECE_COMMENT_ON' => true,
	'QINIU_RES_URL' => 'https://dn-lanbaidiao.qbox.me/',
	'PIECE_LOAD_NUM_PER_PAGE' => 10,
	'ESSAY_LOAD_NUM_PER_PAGE' => 10,
	'LOAD_EXT_CONFIG' => 'lang',
	'BAIDU_MAP_API_AK' => 'Zam5C9aBBGepyAEvTLN566X4',
	'URL_ROUTER_ON' => true, //开启路由
	'URL_ROUTE_RULES' => array(
    	//管理前端路由
    	'/^piece(\/[\w,\d,\_]+)*$/' => 'Home/Index/index', //碎片
    	'/^essay(\/[\w,\d,\_]+)*$/' => 'Home/Index/index', //文章
    	'/^setting(\/[\w,\d,\_]+)*$/' => 'Home/Index/index', //设置
    	'/^message(\/[\w,\d,\_]+)*$/' => 'Home/Index/index', //消息
    	'/^edit(\/[\w,\d,\_]+)*$/' => 'Home/Index/index', //编辑
    	'/^follow(\/[\w,\d,\_]+)*$/' => 'Home/Index/index', //关注
    	'/^tag(\/[\w,\d,\_]+)*$/' => 'Home/Index/index', //标签
    	'/^user(\/[\w,\d,\_]+)*$/' => 'Home/Index/index', //用户
    	'/^view(\/[\w,\d,\_]+)*$/' => 'Home/Index/index', //文章浏览
    ),
);