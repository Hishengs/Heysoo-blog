<?php
namespace Home\Controller;
use Think\Controller;
class PieceController extends Controller {
	private $piece_model;
	
    public function index($userName=null){
    if($_SESSION['LOGIN_STATUS']){
        //check_history_url();
        C('LAYOUT_ON',TRUE);//开启模板布局
        $this->piece_model = D('Piece');
        if(empty($userName))
            $cdt['userName'] = $_SESSION['USER_NAME'];
        else
            $cdt['userName'] = $userName;
        $pieces = $this->piece_model->where($cdt)->order('date desc')->limit(10)->select();
        $user = D('User');
        $cdt1['userName'] = $cdt['userName'];
        $user_data = $user->where($cdt1)->find();
        for ($i=0; $i < count($pieces); $i++) { 
            $pieces[$i]['tag'] = explode(" ", $pieces[$i]['tag']);
        }
        $this->assign('pieces',$pieces)->assign('user',$user_data);
        $this->display();
      }else $this->error('尚未登录，无法操作！',U("Action/login"));
    }
    public function get_piece_page(){
      if($_SESSION['LOGIN_STATUS']){
        //set_history_url(U('Piece/index'));
        $_COOKIE['history_url'] = U("Piece/index");
        C('LAYOUT_ON',FALSE);//关闭模板布局
        $this->piece_model = D('Piece');
        $cdt['userName'] = $_SESSION['USER_NAME'];
        $pieces = $this->piece_model->where($cdt)->order('date desc')->limit(10)->select();
        for ($i=0; $i < count($pieces); $i++) { 
            $pieces[$i]['tag'] = explode(" ", $pieces[$i]['tag']);
        }
        $this->assign('pieces',$pieces);
        $result = $this->fetch("index");
        $this->ajaxReturn($result,'json');
      }
    }
    public function get_piece_nums($username,$cdt=null){
        $piece_model = D('Piece');
        $cdt['userName'] = $username;
        return $piece_model->where($cdt)->count();
    }
    //发布文章
    public function piece_post($tag,$content,$visible,$ext=null){
        $userName = $_SESSION['USER_NAME'];
        $post_date = date("Y-m-d H:i:s");
        $data = array('tag'=>$tag,'content'=>$content,'userName'=>$userName,'visible'=>$visible,'date'=>$post_date);
        $piece_model = D('Piece');
        if($piece_model->add($data) != false){
            $this->success('发布成功！',U("Piece/index"));
        }else $this->error("发布失败，请稍后重试！");
    }
}