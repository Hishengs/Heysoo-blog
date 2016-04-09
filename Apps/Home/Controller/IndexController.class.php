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
    private $auth; //认证类

    function __construct(){
        parent::__construct();
        //check login status,redirect to the login page if not logined
        //if(empty($_SESSION['USER_ID']))redirect(U('Action/login'));
        //if(!preg_match("/\/view\/[\d]+/", $_SERVER['REQUEST_URI']))redirect(U('Action/login'));//除了文章浏览以外
        $this->piece_model = D("Piece");
        $this->piece_nums_per_page = C('PIECE_LOAD_NUM_PER_PAGE');
        $this->user_id = $_SESSION['USER_ID'];
        //$this->auth = new \Think\Auth(); //初始化认证类
    }

    public function index(){
        if(!preg_match("/\/view\/[\d]+/", $_SERVER['REQUEST_URI']) && !preg_match("/\/user\/[\d]+/", $_SERVER['REQUEST_URI']) && empty($_SESSION['USER_ID']))redirect(U('Action/login'));//除了文章浏览以外
        $this->assign('is_logined',empty($_SESSION['USER_ID'])?0:1);
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
         * 关联的模型: hs_user,hs_piece,hs_piece_comment
         */
        /*$sql = "SELECT u.id,u.userName,u.avatar,p.piece_id,p.user_id,p.date,p.tag,p.content from hs_user as u,hs_piece as p 
        where p.visible=1 AND u.id=p.user_id AND p.user_id in (SELECT followed_id as id from hs_follow where follower_id=".$this->user_id." 
        union SElECT id from hs_user where id=".$this->user_id.") order by p.date desc limit ".$page*$this->piece_nums_per_page.
        ",".$this->piece_nums_per_page;*/
        $sql2 = "select count(c.comment_id) as comments_num,u.userName,u.avatar,p.piece_id,p.user_id,p.date,p.tag,p.content from hs_piece as p 
        join hs_user as u on p.user_id=u.id left join hs_piece_comment as c on p.piece_id=c.piece_id where p.user_id=".$this->user_id.
        " or p.user_id in (select f.followed_id from hs_follow as f where f.follower_id=".$this->user_id.") and p.visible=1 group by p.piece_id order by p.date desc limit ".
        $page*$this->piece_nums_per_page.",".$this->piece_nums_per_page;
        $pieces = $this->piece_model->query($sql2);
        if($pieces !== false)
            $this->ajaxReturn(array('pieces'=>$pieces,'error'=>0),'json');
        else if($pieces == NULL)$this->ajaxReturn(array('pieces'=>$pieces,'error'=>2,'msg'=>'暂无记录！'),'json');
        else $this->ajaxReturn(array('pieces'=>$pieces,'error'=>1,'msg'=>'查询失败！'),'json');
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

