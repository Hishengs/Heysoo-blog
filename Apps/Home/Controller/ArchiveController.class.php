<?php
namespace Home\Controller;
use Think\Controller;
/**
 * deal archive
 * Author:Hisheng
 * Last modify date:2016/04/07
 */
class ArchiveController extends Controller {
	private $archive_model;
    private $follow_model;
	
    function __construct(){
        parent::__construct();
        if(empty($_SESSION['USER_ID']))exit(C('SITE_LANG.LOGIN_ALERT'));//check login
        $this->archive_model = D('Archive');
        $this->follow_model = D('Follow');
    }
    public function index(){
    	echo "Hello,".C('SITE_LANG.SITE_NAME');
    }
    /*
    新增归档
    1.归档名称 name 2.包含的朋友 friends
     */
    public function add(){
        if(IS_POST){
            $data = array('name'=>I('post.name'),'creator'=>$_SESSION['USER_ID']);
            $result = $this->archive_model->add($data);
            if($result !== false)
                $this->ajaxReturn(array('error'=>0,'id'=>$result,'msg'=>C('SITE_LANG.POST_SUCCESS')),'json');
            else $this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.POST_FAILED')),'json');
        }
    }
    //删除
    public function delete(){
        if(IS_POST){
            //在删除之前要将原归档下的文章移到默认归档
            $cdt = array('id'=>I('post.id'),'creator'=>$_SESSION['USER_ID']);
            $result = $this->archive_model->where($cdt)->delete();
            if($result !== false)
                $this->ajaxReturn(array('error'=>0,'msg'=>C('SITE_LANG.DELETE_SUCCESS')),'json');
            else $this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.DELETE_FAILED')),'json');
        }
    }
    //更新
    public function update(){
        if(IS_POST){
            $cdt = array('id'=>I('post.id'),'creator'=>$_SESSION['USER_ID']);
            $data = array('name'=>I('post.name'),'updated_at'=>date("Y-m-d H:i:s"));
            $result = $this->archive_model->where($cdt)->save($data);
            if($result !== false)
                $this->ajaxReturn(array('error'=>0,'msg'=>C('SITE_LANG.POST_SUCCESS')),'json');
            else $this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.POST_FAILED')),'json');
        }
    }
    //获取用户归档列表
    public function getList(){
        if(IS_POST){
            $creators = $_SESSION['USER_ID'].',0';
            $cdt['creator'] = array('in',$creators);
            $archives = $this->archive_model->where($cdt)->field('id,name')->select();
            if($archives !== false)
                $this->ajaxReturn(array('error'=>0,'archives'=>$archives,'msg'=>C('SITE_LANG.QUERY_SUCCESS')),'json');
            else $this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.QUERY_FAILED')),'json');
        }
    }
}