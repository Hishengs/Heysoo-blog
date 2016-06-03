<?php
namespace Home\Controller;
use Think\Controller;
/**
 * deal tag
 * Author:Hisheng
 * Last modify date:2016/04/06
 */
class TagController extends Controller {
	private $visible_tag_model;
    private $follow_model;
	
    function __construct(){
        parent::__construct();
        //if(empty($_SESSION['USER_ID']))exit(C('SITE_LANG.LOGIN_ALERT'));//check login
        $this->visible_tag_model = D('VisibleTag');
        $this->follow_model = D('Follow');
    }
    public function index(){
    	echo "Hello,".C('SITE_LANG.SITE_NAME');
    }
    /*
    新增标签
    1.标签名称 name 2.包含的朋友 friends
     */
    public function add(){
        if(IS_POST){
            $data = array('name'=>I('post.name'),'friends'=>I('post.friends'),'creator'=>$_SESSION['USER_ID']);
            $result = $this->visible_tag_model->add($data);
            if($result !== false)
                $this->ajaxReturn(array('error'=>0,'id'=>$result,'msg'=>C('SITE_LANG.POST_SUCCESS')),'json');
            else $this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.POST_FAILED')),'json');
        }
    }
    //删除
    public function delete(){
        if(IS_POST){
            //在删除之前要将相关文章的可见性转为仅自己可见
            $cdt = array('id'=>I('post.id'),'creator'=>$_SESSION['USER_ID']);
            $result = $this->visible_tag_model->where($cdt)->delete();
            if($result !== false)
                $this->ajaxReturn(array('error'=>0,'msg'=>C('SITE_LANG.DELETE_SUCCESS')),'json');
            else $this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.DELETE_FAILED')),'json');
        }
    }
    //更新
    public function update(){
        if(IS_POST){
            $cdt = array('id'=>I('post.id'),'creator'=>$_SESSION['USER_ID']);
            $data = array('name'=>I('post.name'),'friends'=>I('post.friends'),'updated_at'=>date("Y-m-d H:i:s"));
            $result = $this->visible_tag_model->where($cdt)->save($data);
            if($result !== false)
                $this->ajaxReturn(array('error'=>0,'msg'=>C('SITE_LANG.UPDATE_SUCCESS')),'json');
            else $this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.UPDATE_FAILED')),'json');
        }
    }
    //获取用户标签列表
    public function getList(){
        if(IS_POST){
            $cdt = array('creator'=>$_SESSION['USER_ID']);
            $result = $this->visible_tag_model->where($cdt)->select();
            if($result !== false)
                $this->ajaxReturn(array('error'=>0,'tags'=>$result,'msg'=>C('SITE_LANG.QUERY_SUCCESS')),'json');
            else $this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.QUERY_FAILED')),'json');
        }
    }
    //获取用户朋友列表
    public function getFriendList(){
        if(IS_POST){
            $user_id = $_SESSION['USER_ID'];
            $sql = "select userName as name,id from hs_user where hs_user.id in (select hs_follow.followed_id from hs_follow where hs_follow.follower_id=".$user_id.") and 
             ".$user_id." in (select hs_follow.followed_id from hs_follow where hs_follow.follower_id=hs_user.id)";
            $friends = $this->follow_model->query($sql);
            if($friends !== false)
                $this->ajaxReturn(array('error'=>0,'friends'=>$friends,'msg'=>C('SITE_LANG.QUERY_SUCCESS')),'json');
            else $this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.QUERY_FAILED')),'json');
        }
    }
    //获取当前用户某个标签下的所有好友id
    public function getFriendListOfTag(){
        if(IS_POST){
            $cdt = array('creator'=>$_SESSION['USER_ID'],'id'=>I('post.tag_id'));
            $friends = $this->visible_tag_model->where($cdt)->getField('friends');
            if($friends !== false)
                $this->ajaxReturn(array('error'=>0,'friends'=>$friends,'msg'=>C('SITE_LANG.QUERY_SUCCESS')),'json');
            else $this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.QUERY_FAILED')),'json');
        }
    }
}