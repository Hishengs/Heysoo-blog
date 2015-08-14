<?php
namespace Home\Controller;
use Think\Controller;
/**
 * 消息处理，推送类
 */
class MessageController extends Controller {
	private $msg_model;
	
    //构造函数
    function __construct(){
        parent::__construct();
        //$this->msg_model = D('Message');
    }
}