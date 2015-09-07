<?php
namespace Home\Controller;
use Think\Controller;
class UserController extends Controller {
	private $user_model;
    private $follow_model;
    private $userName;
    private $user_id;
	
    //构造函数
    function __construct(){
        parent::__construct();
        $this->user_model = D('User');
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
        $essay_nums = A('Essay')->get_essay_nums($userName);
        $diary_nums = A('Diary')->get_diary_nums($userName);
        $piece_nums = A('Piece')->get_piece_nums($userName);
        $this->assign('user',$user_info)->assign(array('essay_nums'=>$essay_nums,'diary_nums'=>$diary_nums,'piece_nums'=>$piece_nums));
        /*$cdt['userName'] = $userName;
        $cdt['visible'] = 1;
        $piece_model = D('Piece');
        $pieces = $piece_model->where($cdt)->order('date desc')->limit(10)->select();
        $this->assign('pieces',$pieces)->assign('isSelf',$isSelf);*/
        $this->display();
      }else $this->error('尚未登录，无法操作！',U("Action/login"));
    }
    //获取用户信息
    public function get_user_info($user_id,$cdt=null){
        $cdt['id'] = $user_id;
        return $this->user_model->where($cdt)->find();
    }
    public function ng_get_user_info(){
        $cdt['id'] = session('USER_ID');
        $response = $this->user_model->where($cdt)->find();
        if($response != false)
            $this->ajaxReturn(array('error'=>0,'items'=>$response),'json');
        else $this->ajaxReturn(array('error'=>1,'msg'=>'获取失败'),'json');
    }
    //获取用户配置
    public function get_user_config($user_id=null){
        if(empty($user_id))$user_id = $this->user_id;
        $result = D('UserConfig')->where('user_id='.$user_id)->find();
        return $result;
    }
    //获取用户头像
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
    //处理关注
    public function follow(){
        $userName = I('get.userName');
        $action = I('get.action');
        $followed_id = $this->get_id_by_name($userName)['id'];//被关注者id
        $follower_id = session('USER_ID');//关注者的id
        $follow_date = date('Y-m-d H:i:s');
        if($action == 1){
            $data = array('follower_id'=>$follower_id,'followed_id'=>$followed_id,'follow_date'=>$follow_date);
            if($this->follow_model->add($data) != false)$status = 0;
            else $status = 1;
        }
        else if($action == 0){
            $cdt = array('follower_id'=>$follower_id,'followed_id'=>$followed_id);
            if($this->follow_model->where($cdt)->limit(1)->delete() != false)$status = 0;
            else $status = 1;
        }
        $this->ajaxReturn(array('error'=>$status));
    }
    //查询是否已关注
    public function has_followed(){
        $userName = I('get.userName');
        $followed_id = $this->get_id_by_name($userName)['id'];//被关注者id
        $follower_id = session('USER_ID');//关注者的id
        $cdt = array('follower_id'=>$follower_id,'followed_id'=>$followed_id);
        if($this->follow_model->where($cdt)->find() != false)$this->ajaxReturn(array('has_followed'=>1));
        else $this->ajaxReturn(array('has_followed'=>0));
    }
}