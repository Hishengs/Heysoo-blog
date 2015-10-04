<?php
namespace Home\Controller;
use Think\Controller;
/**
 * This is the enterance of the whole application.
 * Author:Hisheng
 * Last modify date:2015/9/28
 */
class IndexController extends Controller {
	private $piece_model;
    private $user_id;
    private $piece_nums_per_page;//piece number every page shows

    function __construct(){
        parent::__construct();
        //check login status,redirect to the login page if not logined
        if(empty($_SESSION['USER_ID']))redirect(U('Action/login'));
        $this->piece_model = D("Piece");
        $this->piece_nums_per_page = C('PIECE_LOAD_NUM_PER_PAGE');
        $this->user_id = $_SESSION['USER_ID'];
    }

    public function index(){
        $this->assign('userName',$_SESSION['USER_NAME']);
        $this->display();
    }
    //get index page
    public function ng_index(){
        $page = I('get.index_page');//The request page number
        $page = $page?$page-1:0;
        /**
         * 1.我的动态
         * 2.我关注的人的动态
         * 3.公开的
         * 4.按时间排序
         */
        $sql = "SELECT u.id,u.userName,u.avatar,p.piece_id,p.date,p.tag,p.content from hs_user as u,hs_piece as p 
        where p.visible=1 AND u.id=p.user_id AND p.user_id in (SELECT followed_id as id from hs_follow where follower_id=".$this->user_id." 
        union SElECT id from hs_user where id=".$this->user_id.") order by p.date desc limit ".$page*$this->piece_nums_per_page.
        ",".$this->piece_nums_per_page;
        $pieces = $this->piece_model->query($sql);
        $this->ajaxReturn($pieces,'json');
    }
   //init the sidebar panel
   public function ng_init_side_panel(){
        $user_info = A('User')->get_user_info($this->user_id);
        $essay_nums = A('Essay')->get_essay_nums($this->user_id);
        $diary_nums = A('Diary')->get_diary_nums($this->user_id);
        $piece_nums = A('Piece')->get_piece_nums($this->user_id);
        //get unread messages
        $unread_msg_num = A('Message')->get_unread_msg_num();
        $response = array('error'=>0,'user'=>$user_info,'essay_nums'=>$essay_nums,
            'diary_nums'=>$diary_nums,'piece_nums'=>$piece_nums,'unread_msg_num'=>$unread_msg_num);
        $this->ajaxReturn($response,'json');
   }
}

