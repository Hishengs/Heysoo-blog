<?php
namespace Home\Controller;
use Think\Controller;
class UserController extends Controller {
    private $user_model;
    private $follow_model;
    private $userName;
    private $user_id;
	
    function __construct(){
        parent::__construct();
        $this->user_model = D('User');
        $this->user_config_model = D('UserConfig');
        $this->user_tag_model = D('Tag');
        $this->follow_model = D('Follow');
        $this->userName = $_SESSION['USER_NAME'];
        $this->user_id = $_SESSION['USER_ID'];
    }


    public function index(){
      if($_SESSION['LOGIN_STATUS']){
        C('LAYOUT_ON',FALSE);//关闭模板布局
        $userName = I('get.user');
        if($userName == $_SESSION['USER_NAME'])
            $isSelf = 1;//是自己
        $user_id = $this->get_id_by_name($userName)['id'];
        $user_info = $this->get_user_info($user_id);
        $essay_nums = A('Essay')->get_essay_nums($user_id);
        $diary_nums = A('Diary')->get_diary_nums($user_id);
        $piece_nums = A('Piece')->get_piece_nums($user_id);
        $this->assign('user',$user_info)->assign(array('essay_nums'=>$essay_nums,'diary_nums'=>$diary_nums,'piece_nums'=>$piece_nums));
        /*$cdt['userName'] = $userName;
        $cdt['visible'] = 1;
        $piece_model = D('Piece');
        $pieces = $piece_model->where($cdt)->order('date desc')->limit(10)->select();
        $this->assign('pieces',$pieces)->assign('isSelf',$isSelf);*/
        $this->display();
      }else $this->error('尚未登录，无法操作！',U("Action/login"));
    }
    //get user info
    public function get_user_info($user_id,$cdt=null){
        $cdt['id'] = $user_id;
        return $this->user_model->where($cdt)->find();
    }
    //get user info async
    public function ng_get_user_info(){
        $cdt['id'] = session('USER_ID');
        $response = $this->user_model->where($cdt)->find();
        if($response != false)
            $this->ajaxReturn(array('error'=>0,'items'=>$response),'json');
        else $this->ajaxReturn(array('error'=>1,'msg'=>'获取失败'),'json');
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
        else $this->ajaxReturn(array('error'=>1,'msg'=>'获取失败！'));
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
        $followed_id = $this->get_id_by_name($userName)['id'];//被关注者id
        $follower_id = session('USER_ID');//关注者的id
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
        $followed_id = $this->get_id_by_name($userName)['id'];//被关注者id
        $follower_id = session('USER_ID');//关注者的id
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
        else $this->ajaxReturn(array('error'=>1,'items'=>array(),'msg'=>'查询失败！'));
    }
    //remove follow
    public function remove_follow(){
        $type = I('post.type');
        $follow_id = I('post.follow_id');
        if($this->follow_model->where('follow_id='.$follow_id)->limit()->delete() != false)$this->ajaxReturn(array('error'=>0,'msg'=>'操作成功！'));
        else $this->ajaxReturn(array('error'=>1,'msg'=>'操作失败！'));
    }
    //重置密码,reset password
    public function reset_passwd(){
        $old_passwd = I('post.old_passwd');
        $new_passwd = I('post.new_passwd');
        if(empty($old_passwd) || empty($new_passwd))$this->ajaxReturn(array('error'=>1,'msg'=>'密码不能为空！'));
        else if(strlen($new_passwd) < 6)$this->ajaxReturn(array('error'=>1,'msg'=>'请输入6位以上新密码！'));
        //verify old password
        $user_id = session('USER_ID');
        $data = $this->user_model->where('id='.$user_id)->field('passwd,salt,crypt_times')->find();
        for($i=0;$i<$data['crypt_times'];$i++){
            $old_passwd = md5($old_passwd.$data['salt']);
        }
        if($old_passwd != $data['passwd'])$this->ajaxReturn(array('error'=>1,'msg'=>'旧密码错误！'));
        else{
            for($i=0;$i<$data['crypt_times'];$i++){
                $new_passwd = md5($new_passwd.$data['salt']);
            }
            $cdt['id'] = $user_id;
            $data['passwd'] = $new_passwd;
            if($this->user_model->where($cdt)->save($data) !== false)$this->ajaxReturn(array('error'=>0,'msg'=>'重置成功，请重新登陆！'));
            else $this->ajaxReturn(array('error'=>1,'msg'=>'重置失败！'));
        }
    }
    //setting
    public function modify_userName(){
        if(isset($_SESSION['USER_ID'])){
            $user_id = $_SESSION['USER_ID'];
            $new_userName = I('post.new_username');
            $data = array('userName'=>$new_userName);
            if($this->user_model->where('id='.$user_id)->save($data) !== false)$this->ajaxReturn(array('error'=>0),'json');
            else $this->ajaxReturn(array('error'=>1,'msg'=>'用户名修改失败，请稍后重试！'),'json');
        }else $this->error('请先登录后再操作！',U('Action/login'));
    }
    public function modify_signature(){
        if(isset($_SESSION['USER_ID'])){
            $user_id = $_SESSION['USER_ID'];
            $new_signature = I('post.new_signature');
            $data = array('signature'=>$new_signature);
            if($this->user_model->where('id='.$user_id)->save($data) !== false)$this->ajaxReturn(array('error'=>0),'json');
            else $this->ajaxReturn(array('error'=>1,'msg'=>'签名修改失败，请稍后重试！'),'json');
        }else $this->error('请先登录后再操作！',U('Action/login'));
    }
    public function updateAvatar(){
        if(isset($_SESSION['USER_ID'])){
            $new_avatar = I('get.new_avatar');
            $user_id = $_SESSION['USER_ID'];
            $data = array('avatar'=>$new_avatar);
            $res = $this->user_model->where('id='.$user_id)->save($data);
            if($res !== false)$this->ajaxReturn(array('error'=>0),'json');
            else $this->ajaxReturn(array('error'=>1,'msg'=>$res),'json');
        }else $this->error('请先登录后再操作！',U('Action/login'));
    }
    //modify push,privacy
    public function modify_push(){
        if(isset($_SESSION['USER_ID'])){
            $user_id = $_SESSION['USER_ID'];
            $comment_on = I('post.comment_on');
            $at_on = I('post.at_on');
            $whisper_on = I('post.whisper_on');
            $notice_on = I('post.notice_on');
            $data = array('push_comment'=>$comment_on,'push_at'=>$at_on,'push_whisper'=>$whisper_on,'push_notice'=> $notice_on);
            $res = $this->user_config_model->where('user_id='.$user_id)->save($data);
            if($res  !==false)$this->ajaxReturn(array('error'=>0,'msg'=>'修改成功！'),'json');
            else $this->ajaxReturn(array('error'=>1,'msg'=>'保存失败，请稍后重试！'),'json');
        }else $this->error('请先登录后再操作！',U('Action/login'));
    }
    public function modify_privacy(){
        if(isset($_SESSION['USER_ID'])){
            $user_id = $_SESSION['USER_ID'];
            $followable = I('post.followable');
            $visitable = I('post.visitable');
            $essay_comment = I('post.essay_comment');
            $piece_comment = I('post.piece_comment');
            $data = array('privacy_followable'=>$followable,'privacy_visitable'=>$visitable,'privacy_essay_comment'=>$essay_comment,'privacy_piece_comment'=> $piece_comment);
            $res = $this->user_config_model->where('user_id='.$user_id)->save($data);
            if($res !== false)$this->ajaxReturn(array('error'=>0,'msg'=>'修改成功！'),'json');
            else $this->ajaxReturn(array('error'=>1,'msg'=>'保存失败，请稍后重试！'),'json');
        }else $this->error('请先登录后再操作！',U('Action/login'));
    }
    //modify interface
    public function modify_interface_color(){
        if(isset($_SESSION['USER_ID'])){
            $user_id = $_SESSION['USER_ID'];
            $interface_color = I('get.interface_color');
            $data = array('interface_color'=>$interface_color);
            $res = $this->user_config_model->where('user_id='.$user_id)->save($data);
            if($res !== false)$this->ajaxReturn(array('error'=>0,'msg'=>'修改成功！'),'json');
            else $this->ajaxReturn(array('error'=>1,'msg'=>'修改失败，请稍后重试！'),'json');
        }else $this->error('请先登录后再操作！',U('Action/login'));
    }
    //modify backgroumd img
    public function modify_bg(){
        if(isset($_SESSION['USER_ID'])){
            $type = I('get.type');
            $select = I('get.select');
            $img_url = C('QINIU_RES_URL').$select.".png";
            $user_id = $_SESSION['USER_ID'];
            if($type == 'mainBg')
                $data = array('main_bg'=>$img_url);
            else
                $data = array('sidebar_bg'=>$img_url);
            $res = $this->user_config_model->where('user_id='.$user_id)->save($data);
            if($res !== false)$this->ajaxReturn(array('error'=>0,'msg'=>'修改成功！','url'=>$img_url),'json');
            else $this->ajaxReturn(array('error'=>1,'msg'=>'修改失败，请稍后重试！'),'json');
        }else $this->error('请先登录后再操作！',U('Action/login'));
    }
    //获取用户标签列表
    public function get_user_tag(){
        if(isset($_SESSION['USER_ID'])){
            $user_id = $_SESSION['USER_ID'];
            $type = I('get.type');
            $cdt = array('user_id='=>$user_id,'tag_type'=>$type);
            $res = $this->user_tag_model->where($cdt)->select();
            if($res !== false)$this->ajaxReturn(array('error'=>0,'items'=>$res),'json');
            else $this->ajaxReturn(array('error'=>1,'msg'=>'查询失败，请稍后重试！'),'json');
        }else $this->error('请先登录后再操作！',U('Action/login'));
    }
}