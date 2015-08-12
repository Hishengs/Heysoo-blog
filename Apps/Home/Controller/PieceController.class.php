<?php
namespace Home\Controller;
use Think\Controller;
class PieceController extends Controller {
	private $piece_model;
    private $page_size = 10;
	
    //构造函数
    function __construct(){
        parent::__construct();
        $this->piece_model = D('Piece');
    }

    public function index($userName=null){
    if($_SESSION['LOGIN_STATUS']){
        //check_history_url();
        C('LAYOUT_ON',TRUE);//开启模板布局
        if(empty($userName))
            $cdt['userName'] = $_SESSION['USER_NAME'];
        else
            $cdt['userName'] = $userName;
        $pieces = $this->piece_model->where($cdt)->order('date desc')->limit($this->page_size)->select();
        $totalCount = $this->piece_model->where($cdt)->count();
        $totalPage = $totalCount/$this->page_size;
        $this->assign('totalCount',$totalCount)->assign('pageSize',$this->page_size)
        ->assign('totalPage',$totalPage);
        $user_info = A('User')->get_user_info($cdt['userName']);
        for ($i=0; $i < count($pieces); $i++) { 
            $pieces[$i]['tag'] = explode(" ", $pieces[$i]['tag']);
        }
        $this->assign('pieces',$pieces)->assign('user',$user_info);
        $this->display();
      }else $this->error('尚未登录，无法操作！',U("Action/login"));
    }
    public function get_piece_page(){
      if($_SESSION['LOGIN_STATUS']){
        //set_history_url(U('Piece/index'));
        $_COOKIE['history_url'] = U("Piece/index");
        C('LAYOUT_ON',FALSE);//关闭模板布局
        $cdt['userName'] = $_SESSION['USER_NAME'];
        $pieces = $this->piece_model->where($cdt)->order('date desc')->limit($this->page_size)->select();
        $totalCount = $this->piece_model->where($cdt)->count();
        $totalPage = $totalCount/$this->page_size;
        $this->assign('totalCount',$totalCount)->assign('pageSize',$this->page_size)
        ->assign('totalPage',$totalPage);
        for ($i=0; $i < count($pieces); $i++) { 
            $pieces[$i]['tag'] = explode(" ", $pieces[$i]['tag']);
        }
        $this->assign('pieces',$pieces);
        $result = $this->fetch("index");
        $this->ajaxReturn($result,'json');
      }
    }
    public function get_piece_nums($username,$cdt=null){
        $cdt['userName'] = $username;
        return $this->piece_model->where($cdt)->count();
    }
    //发布碎片
    public function piece_post($tag,$content,$visible,$ext=null){
        $userName = $_SESSION['USER_NAME'];
        $post_date = date("Y-m-d H:i:s");
        $data = array('tag'=>$tag,'content'=>$content,'userName'=>$userName,'visible'=>$visible,'date'=>$post_date);
        if($this->piece_model->add($data) != false){
            $this->success('发布成功！',U("Piece/index"));
        }else $this->error("发布失败，请稍后重试！");
    }
    //碎片修改
    public function modify($id,$tag,$content,$visible){
        $last_modify_date = date("Y-m-d H:i:s");
        $data = array('tag'=>$tag,'content'=>$content,'visible'=>$visible,'last_modify_date'=>$last_modify_date);
        if($this->piece_model->where("id=".$id)->save($data) != false)
            $this->success("修改成功！",U("Piece/index"));
        else
            $this->error("修改失败，请稍后重试！");
    }
    //删除碎片
    public function delete($id){
        if($this->piece_model->where("id=".$id)->limit(1)->delete() != false)
            $this->ajaxReturn(array('error'=>0),'json');
        else
            $this->ajaxReturn(array('error'=>1),'json');
    }
    public function load_pieces_html(){
        $page = I('get.page');
        $type = I('get.type');
        if($type=='init'){
            $response['error'] = 2;
            $this->ajaxReturn($response,'json');
        }
        else{
            C('LAYOUT_ON',FALSE);
            $cdt['userName'] = $_SESSION['USER_NAME'];
            $pieces = $this->piece_model->where($cdt)->order('date desc')->limit($page*$this->page_size,$this->page_size)->select();
            for ($i=0; $i < count($pieces); $i++) { 
                    $pieces[$i]['tag'] = explode(" ", $pieces[$i]['tag']);
                }
            $this->assign('pieces',$pieces);
            $html = $this->fetch("pieces");
            $response['error'] = 0;
            $response['html'] = $html;
            $this->ajaxReturn($response,'json');
        }
    }
    //发布碎片评论
    public function post_comment(){
        if(C('PIECE_COMMENT_ON')){//评论功能是否开启
            $piece_id = I('post.piece_id');
            $comment_content = I('post.comment_content','','');
            $user_id = $_SESSION['USER_ID'];
            $comment_date = date("Y-m-d H:i:s");
            $data = array('user_id'=>$user_id,'piece_id'=>$piece_id,'comment_date'=>$comment_date,'comment_content'=>$comment_content);
            $comment_model = D("PieceComment");
            if($comment_model->add($data) != false){
                $this->ajaxReturn(array('error'=>0,'comment'=>array('user'=>$_SESSION['USER_NAME'],'date'=>$comment_date,
                    'content'=>$comment_content)),'json');
            }
            else $this->ajaxReturn(array('error'=>1,'msg'=>'评论失败'),'json');
        }else $this->ajaxReturn(array('error'=>2,'msg'=>'评论功能已关闭'),'json');
    } 
    //获取碎片评论
    public function get_piece_comment(){
        $piece_id = I('get.piece_id');
        $comment_model = D("PieceComment");
        $cdt['piece_id'] = $piece_id;
        $comments = $comment_model->where($cdt)->order('comment_date desc')->select();
        if($comments != false){
            $this->ajaxReturn(array('error'=>0,'comments'=>$comments),'json');
        }else{
            $this->ajaxReturn(array('error'=>1,'msg'=>'评论获取失败'),'json');
        }
    }
}