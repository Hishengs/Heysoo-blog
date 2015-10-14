<?php
return array(
	//'配置项'=>'配置值'
		//数据库配置信息
		'DB_TYPE'   => 'mysql', // 数据库类型
		'DB_HOST'   => 'localhost', // 服务器地址
		'DB_NAME'   => 'heysoo', // 数据库名
		'DB_USER'   => 'root', // 用户名
		'DB_PWD'    => '123456', // 密码
		'DB_PORT'   => 3306, // 端口
		'DB_PREFIX' => 'hs_', // 数据库表前缀
		'DB_CHARSET'=> 'utf8', // 字符集
		'DB_DEBUG'  =>  TRUE, // 数据库调试模式 开启后可以记录SQL日志 3.2.3新增
		'LAYOUT_ON' => TRUE,//开启模板布局
		'LAYOUT_NAME' => 'layout',
		'LOGIN_VERIFY_CODE_ON' => false, //是否开启登录验证码验证
		'REGISTER_VERIFY_CODE_ON' => true, //是否开启注册验证码验证
		'REGISTER_INVITE_CODE_ON' => true, //是否开启邀请码注册
		'URL_ROUTER_ON'   => true,
		'QINIU_SK' => 'yourqiniusk',
		'QINIU_AK' => 'yourqiniuak',
		'QINIU_BUCKET' => 'blueandwhite',
		'SITE_PREFIX' => 'http://localhost',
		'URL_MODEL' => 2,
		'ESSAY_COMMENT_ON' => true,
		'PIECE_COMMENT_ON' => true,
		'QINIU_RES_URL' => 'https://dn-lanbaidiao.qbox.me/',
		'PIECE_LOAD_NUM_PER_PAGE' => 10,
		'ESSAY_LOAD_NUM_PER_PAGE' => 10,
		'LOAD_EXT_CONFIG' => 'lang',
		'BAIDU_MAP_API_AK' => 'yourbaiduak'
		);