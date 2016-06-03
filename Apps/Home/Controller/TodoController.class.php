<?php
namespace Home\Controller;
use Think\Controller;
/**
 * deal Todo
 * Author:Hisheng
 * Last modify date:2016/04/29
 */
class TodoController extends Controller {
	private $todo_model;
	
    function __construct(){
        parent::__construct();
        //if(empty($_SESSION['USER_ID']))exit(C('SITE_LANG.LOGIN_ALERT'));//check login
        $this->todo_model = D('Todo');
    }
    public function index(){
    	echo "Hello,".C('SITE_LANG.SITE_NAME');
    }
    /*
    新增待办事项
    1.待办事项内容 content 2.紧急程度 urgent_level 3.deadline 截至日期 4.地址 address NULL
     */
    public function add(){
        if(IS_POST){
            $deadline = I('post.deadline')?date('Y-m-d H:i:s',I('post.deadline')):date();
            $data = array('content'=>I('post.content'),'urgent_level'=>I('post.urgent_level'),
                'deadline'=>$deadline,'address'=>I('post.address'),
                'user_id'=>$_SESSION['USER_ID']);
            $result = $this->todo_model->add($data);
            if($result !== false)
                $this->ajaxReturn(array('error'=>0,'id'=>$result,'msg'=>C('SITE_LANG.POST_SUCCESS')),'json');
            else $this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.POST_FAILED')),'json');
        }
    }
    //删除
    public function delete(){
        if(IS_POST){
            $cdt = array('id'=>I('post.id'),'user_id'=>$_SESSION['USER_ID']);
            $result = $this->todo_model->where($cdt)->delete();
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
            $result = $this->todo_model->where($cdt)->save($data);
            if($result !== false)
                $this->ajaxReturn(array('error'=>0,'msg'=>C('SITE_LANG.UPDATE_SUCCESS')),'json');
            else $this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.UPDATE_FAILED')),'json');
        }
    }
    //获取用户待办事项列表
    /*
    查询条件：1.开始时间 start_time 可选 2.结束时间 end_time 可选 3.紧急程度 urgent_level 
    4.地点 address 可选 5.关键词 key_words 可选 6.状态 status 可选
     */
    public function getList(){
        if(IS_POST){
            $p = I('post.p');
            $result = $this->todo_model->ofUser($_SESSION['USER_ID'])
            ->ofTimeBetween(I('post.start_time'),I('post.end_time'))->ofDeadline(I('post.deadline'))
            ->ofAddressLike(I('post.address'))->ofUrgentLevel(I('post.urgent_level'))
            ->ofContentLike(I('post.key_words'))->ofStatus(I('post.status'))
            ->limit(($p['page']-1)*$p['numPerPage'],$p['numPerPage'])->order('status,created_at desc')->select();
            if($result !== false)
                $this->ajaxReturn(array('error'=>0,'todos'=>$result,'p'=>$p['page'],'msg'=>C('SITE_LANG.QUERY_SECCESS')),'json');
            else $this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.QUERY_FAILED')),'json');
        }
    }
    //标为已办
    public function set_done(){
        if(IS_POST){
            $cdt = array('id'=>I('post.id'),'user_id'=>$_SESSION['USER_ID']);
            $data = array('status'=>1,'updated_at'=>date("Y-m-d H:i:s"));
            $result = $this->todo_model->where($cdt)->save($data);
            if($result !== false)
                $this->ajaxReturn(array('error'=>0,'msg'=>C('SITE_LANG.UPDATE_SUCCESS')),'json');
            else $this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.UPDATE_FAILED')),'json');
        }
    }
    //撤销已办
    public function reset_done(){
        if(IS_POST){
            $cdt = array('id'=>I('post.id'),'user_id'=>$_SESSION['USER_ID']);
            $data = array('status'=>0,'updated_at'=>date("Y-m-d H:i:s"));
            $result = $this->todo_model->where($cdt)->save($data);
            if($result !== false)
                $this->ajaxReturn(array('error'=>0,'msg'=>C('SITE_LANG.UPDATE_SUCCESS')),'json');
            else $this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.UPDATE_FAILED')),'json');
        }
    }
}