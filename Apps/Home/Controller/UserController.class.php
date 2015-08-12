<?php
namespace Home\Controller;
use Think\Controller;
class UserController extends Controller {
	private $user_model;
    private $userName;
    private $user_id;
	
    //构造函数
    function __construct(){
        parent::__construct();
        $this->user_model = D('User');
        $this->userName = $_SESSION['USER_NAME'];
        $this->user_id = $_SESSION['USER_ID'];
    }

    public function index(){
      if($_SESSION['LOGIN_STATUS']){
        C('LAYOUT_ON',FALSE);//关闭模板布局
        $userName = I('get.user');
        if($userName == $_SESSION['USER_NAME'])
            $isSelf = 1;//是自己
        $user_info = $this->get_user_info($userName);
        $essay_nums = A('Essay')->get_essay_nums($userName);
        $diary_nums = A('Diary')->get_diary_nums($userName);
        $piece_nums = A('Piece')->get_piece_nums($userName);
        $this->assign('user',$user_info)->assign(array('essay_nums'=>$essay_nums,'diary_nums'=>$diary_nums,'piece_nums'=>$piece_nums));
        $cdt['userName'] = $userName;
        $cdt['visible'] = 1;
        $piece_model = D('Piece');
        $pieces = $piece_model->where($cdt)->order('date desc')->limit(10)->select();
        $this->assign('pieces',$pieces)->assign('isSelf',$isSelf);
        $this->display();
      }else $this->error('尚未登录，无法操作！',U("Action/login"));
    }
    //获取用户信息
    public function get_user_info($userName,$cdt=null){
        $cdt['userName'] = $userName;
        return $this->user_model->where($cdt)->find();
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
}