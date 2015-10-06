<?php
namespace Home\Controller;
use Think\Controller;
/**
 * Deal with user action
 * Author:Hisheng
 * Last modify date:2015/09/29
 */
class UserController extends Controller {
    private $user_model;
    private $follow_model;
    private $userName;
    private $user_id;
	
    function __construct(){
        parent::__construct();
        if(empty($_SESSION['USER_ID']))exit(C('SITE_LANG.LOGIN_ALERT'));
        $this->user_model = D('User');
        $this->user_config_model = D('UserConfig');
        $this->user_tag_model = D('Tag');
        $this->follow_model = D('Follow');
        $this->userName = $_SESSION['USER_NAME'];
        $this->user_id = $_SESSION['USER_ID'];
    }


    public function index(){
        C('LAYOUT_ON',FALSE);//close layout
        $userName = I('get.user');
        if($userName == $_SESSION['USER_NAME'])
            $isSelf = 1;//if is self
        $user_id = $this->get_id_by_name($userName)['id'];
        $user_info = $this->get_user_info($user_id);
        $essay_nums = A('Essay')->get_essay_nums($user_id);
        $diary_nums = A('Diary')->get_diary_nums($user_id);
        $piece_nums = A('Piece')->get_piece_nums($user_id);
        $this->assign('user',$user_info)->assign(array('essay_nums'=>$essay_nums,'diary_nums'=>$diary_nums,'piece_nums'=>$piece_nums));
        $this->display();
    }
    //get user info
    public function get_user_info($user_id,$cdt=null){
        $cdt['id'] = $user_id;
        return $this->user_model->where($cdt)->limit(1)->find();
    }
    //get user info async 
    public function ng_get_user_info(){
        $cdt['id'] = $this->user_id;
        $response = $this->user_model->where($cdt)->find();
        if($response !== false)
            $this->ajaxReturn(array('error'=>0,'items'=>$response),'json');
        else $this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.OPERATION_FAILED')),'json');
    }
    //get user config
    public function get_user_config($user_id=null){
        if(empty($user_id))$user_id = $this->user_id;
        $result = $this->user_config_model->where('user_id='.$user_id)->find();
        return $result;
    }
    public function ng_get_user_config($user_id=null){
        if(empty($user_id))$user_id = $this->user_id;
        $result = $this->user_config_model->where('user_id='.$user_id)->find();
        if($result != false)
        $this->ajaxReturn(array('error'=>0,'user_config'=>$result));
        else $this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.OPERATION_FAILED')));
    }
    //get user avatar
    public function get_user_avatar(){
        //
    }
    //get userName by id
    public function get_name_by_id($id){
        return $this->user_model->where('id='.$id)->field('userName')->find();
    }
    //get userName by id
    public function get_id_by_name($userName){
        $cdt['userName'] = $userName;
        return $this->user_model->where($cdt)->field('id')->find();
    }
    //deal follow by type
    public function follow(){
        $userName = I('get.userName');
        $action = I('get.action');
        $followed_id = $this->get_id_by_name($userName)['id'];//id of the followed
        $follower_id = session('USER_ID');//id of follower
        $follow_date = date('Y-m-d H:i:s');
        if($action == 1){//follow 
            $data = array('follower_id'=>$follower_id,'followed_id'=>$followed_id,'follow_date'=>$follow_date);
            if($this->follow_model->add($data) != false)$status = 0;
            else $status = 1;
        }
        else if($action == 0){//cancel follow
            $cdt = array('follower_id'=>$follower_id,'followed_id'=>$followed_id);
            if($this->follow_model->where($cdt)->delete() != false)$status = 0;
            else $status = 1;
        }
        $this->ajaxReturn(array('error'=>$status));
    }
    //query if someone has been followed by me
    public function has_followed(){
        $userName = I('get.userName');
        $followed_id = $this->get_id_by_name($userName)['id'];//id of the followed
        $follower_id = session('USER_ID');//id of follower
        $cdt = array('follower_id'=>$follower_id,'followed_id'=>$followed_id);
        if($this->follow_model->where($cdt)->find() != false)$this->ajaxReturn(array('has_followed'=>1));
        else $this->ajaxReturn(array('has_followed'=>0));
    }
    //get follow list by type
    public function get_follow_list(){
        $type = I('get.type');
        if($type == 'following'){//people I am following...
            $follower_id = session('USER_ID');
            $cdt = array('hs_follow.follower_id'=>$follower_id);
            $join_sql = 'hs_user on hs_user.id = hs_follow.followed_id';
        }elseif ($type == 'followed') {//people who follow me
            $followed_id = session('USER_ID');
            $cdt = array('hs_follow.followed_id'=>$followed_id);
            $join_sql = 'hs_user on hs_user.id = hs_follow.follower_id';
        }
        $res = $this->follow_model->join($join_sql)->where($cdt)->order('hs_follow.follow_date')->select();
        if($res !== false)$this->ajaxReturn(array('error'=>0,'items'=>$res));
        else $this->ajaxReturn(array('error'=>1,'items'=>array(),'msg'=>C('SITE_LANG.QUERY_FAILED')));
    }
    //remove follow
    public function remove_follow(){
        $type = I('post.type');
        $follow_id = I('post.follow_id');
        if($this->follow_model->where('follow_id='.$follow_id)->limit()->delete() != false)$this->ajaxReturn(array('error'=>0,'msg'=>'操作成功！'));
        else $this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.OPERATION_FAILED')));
    }
    //reset password
    public function reset_passwd(){
        $old_passwd = I('post.old_passwd');
        $new_passwd = I('post.new_passwd');
        if(empty($old_passwd) || empty($new_passwd))$this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.USER_EMPTY_ERROR')));
        else if(strlen($new_passwd) < 6)$this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.USER_PASSWD_LENGTH_ERROR')));
        //verify old password
        $data = $this->user_model->where('id='.$this->user_id)->field('passwd,salt,encrypt_times')->find();
        for($i=0;$i<$data['encrypt_times'];$i++){
            $old_passwd = md5($old_passwd.$data['salt']);
        }
        if($old_passwd != $data['passwd'])$this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.OLD_PASSWD_ERROR')));
        else{
            for($i=0;$i<$data['encrypt_times'];$i++){
                $new_passwd = md5($new_passwd.$data['salt']);
            }
            $cdt['id'] = $this->user_id;
            $data['passwd'] = $new_passwd;
            if($this->user_model->where($cdt)->save($data) !== false)$this->ajaxReturn(array('error'=>0,'msg'=>C('SITE_LANG.RESET_SUCCESS')));
            else $this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.RESET_FAILED')));
        }
    }
    //setting
    public function modify_userName(){
            $new_userName = I('post.new_username');
            $new_userName = strip_tags($new_userName);
            if(empty($new_userName))$this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.USER_NAME_EMPTY_TIP')));
            else {
                $data = array('userName'=>$new_userName);
                if($this->user_model->where($data)->find() !== NULL)$this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.USER_NAME_EXISTED')),'json');
                else if($this->user_model->where('id='.$this->user_id)->save($data) !== false)$this->ajaxReturn(array('error'=>0),'json');
                else $this->ajaxReturn(array('error'=>2,'msg'=>C('SITE_LANG.MODIFY_FAILED')),'json');
            }
    }
    public function modify_signature(){
            $new_signature = I('post.new_signature');
            $new_signature = strip_tags($new_signature);
            if(empty($new_signature))$this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.USER_SIGNATURE_EMPTY_TIP')));
            else{
                $data = array('signature'=>$new_signature);
                if($this->user_model->where('id='.$this->user_id)->save($data) !== false)$this->ajaxReturn(array('error'=>0),'json');
                else $this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.MODIFY_FAILED')),'json');
            }
    }
    public function updateAvatar(){
            $new_avatar = I('get.new_avatar');
            $data = array('avatar'=>$new_avatar);
            $res = $this->user_model->where('id='.$this->user_id)->save($data);
            if($res !== false)$this->ajaxReturn(array('error'=>0),'json');
            else $this->ajaxReturn(array('error'=>1,'msg'=>$res),'json');
    }
    //modify push,privacy
    public function modify_push(){
            $comment_on = I('post.comment_on');
            $at_on = I('post.at_on');
            $whisper_on = I('post.whisper_on');
            $notice_on = I('post.notice_on');
            $data = array('push_comment'=>$comment_on,'push_at'=>$at_on,'push_whisper'=>$whisper_on,'push_notice'=> $notice_on);
            $res = $this->user_config_model->where('user_id='.$this->user_id)->save($data);
            if($res  !==false)$this->ajaxReturn(array('error'=>0,'msg'=>C('SITE_LANG.MODIFY_SUCCESS')),'json');
            else $this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.SAVE_FAILED')),'json');
    }
    //modify user privacy setting
    public function modify_privacy(){
            $followable = I('post.followable');
            $visitable = I('post.visitable');
            $essay_comment = I('post.essay_comment');
            $piece_comment = I('post.piece_comment');
            $data = array('privacy_followable'=>$followable,'privacy_visitable'=>$visitable,'privacy_essay_comment'=>$essay_comment,'privacy_piece_comment'=> $piece_comment);
            $res = $this->user_config_model->where('user_id='.$this->user_id)->save($data);
            if($res !== false)$this->ajaxReturn(array('error'=>0,'msg'=>C('SITE_LANG.MODIFY_SUCCESS')),'json');
            else $this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.SAVE_FAILED')),'json');
    }
    //modify interface
    public function modify_interface_color(){
            $interface_color = I('get.interface_color');
            $data = array('interface_color'=>$interface_color);
            $res = $this->user_config_model->where('user_id='.$this->user_id)->save($data);
            if($res !== false)$this->ajaxReturn(array('error'=>0,'msg'=>C('SITE_LANG.MODIFY_SUCCESS')),'json');
            else $this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.MODIFY_FAILED')),'json');
    }
    //modify backgroumd img
    public function modify_bg(){
            $type = I('get.type');
            $select = I('get.select');
            $img_url = C('QINIU_RES_URL').$select.".png";
            if($type == 'mainBg')
                $data = array('main_bg'=>$img_url);
            else
                $data = array('sidebar_bg'=>$img_url);
            $res = $this->user_config_model->where('user_id='.$this->user_id)->save($data);
            if($res !== false)$this->ajaxReturn(array('error'=>0,'msg'=>C('SITE_LANG.MODIFY_SUCCESS'),'url'=>$img_url),'json');
            else $this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.MODIFY_FAILED')),'json');
    }
    //get user tag list
    public function get_user_tag(){
            $type = I('get.type');
            $cdt = array('user_id='=>$this->user_id,'tag_type'=>$type);
            $res = $this->user_tag_model->where($cdt)->select();
            if($res !== false)$this->ajaxReturn(array('error'=>0,'items'=>$res),'json');
            else $this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.QUERY_FAILED')),'json');
    }
}