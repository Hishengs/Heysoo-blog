<?php
namespace Home\Controller;
use Think\Controller;
/**
 * deal Search Client Requests
 * Author:Hisheng
 * Last modify date:2015/12/10
 */
class SearchController extends Controller {
	private $piece_model = null;
	private $user_model = null;
    private $essay_model = null;
    private $user_id = null;

    function __construct(){
        parent::__construct();
        if(empty($_SESSION['USER_ID']))exit(C('SITE_LANG.LOGIN_ALERT'));//check login
        $this->piece_model = D('Piece');
        $this->user_model = D('User');
        $this->essay_model = D('Essay');
        $this->user_id = session('USER_ID');
    }
    //碎片
    //碎片标签+内容
    public function search_piece(){
        $search_key = I('post.search_key');
        $cdt = array('tag'=>array('LIKE','%'.$search_key.'%'),'_logic'=>'OR','content'=>array('LIKE','%'.$search_key.'%'));
        //$piece_items = $this->piece_model->where($cdt)->where('visible=1')->select();
        $piece_items = $this->piece_model->alias('p')->field('count(c.comment_id) as comments_num,u.userName,u.avatar,p.piece_id,p.user_id,p.date,p.tag,p.content')
        ->join('hs_user as u ON u.id=p.user_id AND p.visible=1')
        ->join('hs_piece_comment as c on c.piece_id=p.piece_id','LEFT')
        ->where("p.tag LIKE '%$search_key%' OR p.content LIKE '%$search_key%' ")
        ->group('p.piece_id')
        ->order('p.date desc')
        ->select();
        if($piece_items)$this->ajaxReturn(array('error'=>0,'items'=>$piece_items),'json');
        else if($piece_items == NULL)$this->ajaxReturn(array('error'=>2,'msg'=>'查询不到相关结果！'),'json');
        else $this->ajaxReturn(array('error'=>1,'msg'=>'查询失败！'),'json');
    }
    //文章
    public function search_essay(){
        $search_key = I('post.search_key');
        $essay_items = $this->essay_model->alias('e')
        ->field('e.essay_id,e.user_id,e.title,e.date,e.tag,LEFT(e.content,1000) as content')
        ->where("e.title LIKE '%$search_key%' OR e.tag LIKE '%$search_key%' AND e.visible=1")
        ->order('e.date desc')
        ->select();
        if($essay_items)$this->ajaxReturn(array('error'=>0,'items'=>$essay_items),'json');
        else if($essay_items == NULL)$this->ajaxReturn(array('error'=>2,'msg'=>'查询不到相关结果！'),'json');
        else $this->ajaxReturn(array('error'=>1,'msg'=>'查询失败！'),'json');
    }
    //用户
    public function search_user(){
        $search_key = I('post.search_key');
        $user_items = $this->user_model->alias('u')
        ->field('u.id,u.userName,u.avatar,u.signature,f.followed_id as is_followed')
        ->join('LEFT JOIN hs_follow as f on f.follower_id='.$this->user_id.' AND f.followed_id=u.id')
        ->where("u.userName LIKE '%$search_key%' OR u.signature LIKE '%$search_key%'")
        ->order('u.register_date desc')
        ->select();
        if($user_items)$this->ajaxReturn(array('error'=>0,'items'=>$user_items),'json');
        else if($user_items == NULL)$this->ajaxReturn(array('error'=>2,'msg'=>'查询不到相关结果！'),'json');
        else $this->ajaxReturn(array('error'=>1,'msg'=>'查询失败！'),'json');
    }
}