<?php
namespace Home\Controller;
use Think\Controller;
use Org\Util\DBUtil;
/**
 * for testing functions
 * Author:Hisheng
 * Last modify date:2016/04/29
 */
class TestController extends Controller {
	private $todo_model;
	
    function __construct(){
        parent::__construct();
        //if(empty($_SESSION['USER_ID']))exit(C('SITE_LANG.LOGIN_ALERT'));//check login
        $this->todo_model = D('Todo');
    }
    public function index(){
    	echo "Hello,".C('SITE_LANG.SITE_NAME');
    }
    //测试加载关联数据
    public function loadRelatedData(){
        if(IS_POST){
            $items = $this->todo_model->select();
            $items = DBUtil::loadRelatedData($items,'user_id','user','id',array('userName'=>'user_name'));
            //$items = DBUtil::loadRelatedData($items,'user_id','user','id',array('userName'=>'user_name'));
            print_r($items);
        }
    }
}