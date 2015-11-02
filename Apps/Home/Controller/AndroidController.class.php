<?php
namespace Home\Controller;
use Think\Controller;
/**
 * deal Android Client Requests
 * Author:Hisheng
 * Last modify date:2015/10/27
 */
class AndroidController extends Controller {
	private $piece_model = null;
	private $user_model = null;

    function __construct(){
        parent::__construct();
        //if(empty($_SESSION['USER_ID']))exit(C('SITE_LANG.LOGIN_ALERT'));//check login
        $this->piece_model = D('Piece');
        $this->user_model = D('User');
    }
    public function index(){
    	echo "Hello,".C('SITE_LANG.SITE_NAME');
    }
    public function get_piece_list(){
        $user_id = I('get.user_id');
        $user_id = $user_id?$user_id:1000;
        //$pieces = $this->piece_model->where('visible=1')->order('date desc')->select();
        $pieces = $this->piece_model->field("hs_user.userName,hs_user.id,hs_user.avatar,hs_piece.piece_id,hs_piece.date,hs_piece.tag,hs_piece.content")
        ->join("hs_user ON hs_user.id=".$user_id." AND hs_piece.user_id=".$user_id)->order("hs_piece.date desc")->select();
        //"SELECT u.userName,u.id,p.date,p.tag,left(p.content,200) as content from hs_piece as p join hs_user as u ON u.id=$user_id AND p.user_id=$user_id ORDER BY p.date desc";
        $this->ajaxReturn(array('pieces'=>$pieces),'json');
    }
    public function get_piece(){
    	$piece_id = I('get.piece_id');
    	$piece = $this->piece_model->field("hs_user.userName,hs_user.id,hs_user.avatar,hs_piece.piece_id,hs_piece.date,hs_piece.tag,hs_piece.content")
    	->join("hs_user ON hs_user.id=hs_piece.user_id AND hs_piece.piece_id=".$piece_id)->find();
    	$this->ajaxReturn(array('piece'=>$piece),'json');
    }
    public function get_user_avatar_url(){
    	$user_id = I('get.user_id');
    	$avatar_url = $this->user_model->field("avatar")->where("id=".$user_id)->find();
    	$this->ajaxReturn(array('avatar_url'=>$avatar_url),'json');
    }
}