<?php
namespace Home\Controller;
use Think\Controller;
/**
 * A Classic Controller Template
 * Author:Hisheng
 * Last modify date:2016/04/29
 */
class TemplateController extends Controller {
	private $xx_model;
	
    function __construct(){
        parent::__construct();
        if(empty($_SESSION['USER_ID']))exit(C('SITE_LANG.LOGIN_ALERT'));//check login
        $this->xx_model = D('Template');
    }
    public function index(){
    	echo "Hello,".C('SITE_LANG.SITE_NAME');
    }
    /*
    新增xx
    1.xx名称 name 2.紧急程度 urgent_level 3.deadline 截至日期 4.状态 status 0
     */
    public function add(){
        if(IS_POST){
            $data = array('content'=>I('post.content'),'urgent_level'=>I('post.urgent_level'),'user_id'=>$_SESSION['USER_ID']);
            $result = $this->xx_model->add($data);
            if($result !== false)
                $this->ajaxReturn(array('error'=>0,'id'=>$result,'msg'=>C('SITE_LANG.POST_SUCCESS')),'json');
            else $this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.POST_FAILED')),'json');
        }
    }
    //删除
    public function delete(){
        if(IS_POST){
            $cdt = array('id'=>I('post.id'),'user_id'=>$_SESSION['USER_ID']);
            $result = $this->xx_model->where($cdt)->delete();
            if($result !== false)
                $this->ajaxReturn(array('error'=>0,'msg'=>C('SITE_LANG.DELETE_SUCCESS')),'json');
            else $this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.DELETE_FAILED')),'json');
        }
    }
    //更新
    public function update(){
        if(IS_POST){
            $cdt = array('id'=>I('post.id'),'user_id'=>$_SESSION['USER_ID']);
            $data = array('content'=>I('post.content'),'urgent_level'=>I('post.urgent_level'),'updated_at'=>date("Y-m-d H:i:s"));
            $result = $this->xx_model->where($cdt)->save($data);
            if($result !== false)
                $this->ajaxReturn(array('error'=>0,'msg'=>C('SITE_LANG.UPDATE_SUCCESS')),'json');
            else $this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.UPDATE_FAILED')),'json');
        }
    }
    //获取用户xx列表
    public function list(){
        if(IS_POST){
            $cdt = array('user_id'=>$_SESSION['USER_ID']);
            $result = $this->xx_model->where($cdt)->select();
            if($result !== false)
                $this->ajaxReturn(array('error'=>0,'xxs'=>$result,'msg'=>C('SITE_LANG.QUERY_SUCCESS')),'json');
            else $this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.QUERY_FAILED')),'json');
        }
    }
}