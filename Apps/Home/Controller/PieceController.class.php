<?php
namespace Home\Controller;
use Think\Controller;
/**
 * ---------------------------
 * Deal with piece
 * Author:Hisheng
 * Last modify date:2015/09/29
 * ---------------------------
 */
class PieceController extends Controller {
	private $piece_model;
    private $page_size;
    private $user_id;
	
    function __construct(){
        parent::__construct();
        $this->piece_model = D('Piece');
        $this->page_size = C('PIECE_LOAD_NUM_PER_PAGE');
        $this->user_id = $_SESSION['USER_ID'];
    }

    public function index(){
        echo "Hello,".C('SITE_LANG.SITE_NAME');
    }
    public function get_piece_nums($user_id,$cdt=null){
        $cdt['user_id'] = $user_id;
        return $this->piece_model->where($cdt)->count();
    }
    //post piece
    public function ng_piece_post($tag,$content,$visible,$ajax=true,$ext=null){ 
        $str_num = A('Action')->str_length($content);
        $current_str_num = $str_num['cn']+$str_num['en'];
        if($current_str_num < 1)$this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.PIECE_CONTENT_EMPTY_TIP')),'json');
        if($current_str_num > 255)$this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.PIECE_CONTENT_LENGTH_ERROR').$current_str_num,'str_num'=>$str_num),'json');
        else{
            $userName = $_SESSION['USER_NAME'];
            $tag = $tag?$tag:'碎片';
            $post_date = date("Y-m-d H:i:s");
            $data = array('user_id'=>$this->user_id,'tag'=>$tag,'content'=>$content,'visible'=>$visible,'date'=>$post_date);
            if($this->piece_model->add($data) != false){
                if($ajax)
                    $this->ajaxReturn(array('error'=>0,'msg'=>C('SITE_LANG.POST_SUCCESS'),'str_num'=>$str_num),'json');
                else return true;
            }else {
                if($ajax)
                    $this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.POST_FAILED')),'json');
                else return false;
            }
        }
    }
    //modify piece
    public function modify($id,$tag,$content,$visible){
        $last_modify_date = date("Y-m-d H:i:s");
        $data = array('tag'=>$tag,'content'=>$content,'visible'=>$visible,'last_modify_date'=>$last_modify_date);
        if($this->piece_model->where("id=".$id)->save($data) != false)
            $this->success(C('SITE_LANG.MODIFY_SUCCESS'),U("Piece/index"));
        else
            $this->error(C('SITE_LANG.MODIFY_FAILED'));
    }
    //delete piece
    public function ng_delete($piece_id){
        if($this->piece_model->where("piece_id=".$piece_id)->limit(1)->delete() != false)
            $this->ajaxReturn(array('error'=>0,'msg'=>C('SITE_LANG.DELETE_SUCCESS')),'json');
        else
            $this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.DELETE_FAILED')),'json');
    }
    //post piece comment
    public function post_comment(){
        if(C('PIECE_COMMENT_ON')){
            $piece_id = I('post.piece_id');
            $comment_content = I('post.comment_content','','');
            $msg_receiver_id = I('post.obj_id');
            $comment_date = date("Y-m-d H:i:s");
            $data = array('user_id'=>$this->user_id,'piece_id'=>$piece_id,'comment_date'=>$comment_date,'comment_content'=>$comment_content);
            $comment_model = D("PieceComment");
            $res = $comment_model->add($data);
            if($res != false){
                //生成消息
                //$userName = A('User')->get_name_by_id($this->user_id);
                $msg_content = ' 评论了你的碎片';
                A('Message')->msg_push('comment',1,'piece',$res,$comment_date,$this->user_id,$msg_receiver_id,$msg_content);
                $this->ajaxReturn(array('error'=>0,'comment'=>array('user'=>$_SESSION['USER_NAME'],'date'=>$comment_date,
                    'content'=>$comment_content),'msg'=>C('SITE_LANG.COMMENT_SUCCESS')),'json');
            }
            else $this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.COMMENT_FAILED')),'json');
        }else $this->ajaxReturn(array('error'=>2,'msg'=>C('SITE_LANG.COMMENT_CLOSED')),'json');
    } 
    //get piece comment
    public function get_piece_comment(){
        $piece_id = I('get.piece_id');
        $comment_model = D("PieceComment");
        $cdt['piece_id'] = $piece_id;
        $comments = $comment_model->field('hs_user.userName,hs_piece_comment.comment_date,hs_piece_comment.comment_content')
        ->join('hs_user ON hs_piece_comment.user_id=hs_user.id AND hs_piece_comment.piece_id='.$piece_id)->order('hs_piece_comment.comment_date desc')->select();
        if($comments != false){
            $this->ajaxReturn(array('error'=>0,'comments'=>$comments),'json');
        }else{
            if($comments == false)
                $this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.NO_COMMENT')),'json');
            else if($comments == NULL)
                $this->ajaxReturn(array('error'=>2,'msg'=>C('SITE_LANG.COMMENT_GET_FAILED')),'json');
        }
    }
    public function ng_get_piece_page($page=null){
      if($_SESSION['LOGIN_STATUS']){
        $page = $page?$page-1:0;
        $pieces = $this->piece_model->join('hs_user ON hs_user.id=hs_piece.user_id AND hs_piece.user_id='.$this->user_id)
        ->order('hs_piece.date desc')->limit($page*$this->page_size,$this->page_size)->select();
        $response = array('error'=>0,'items'=>$pieces,'page'=>$page+1);
        $this->ajaxReturn($response,'json');
      }else{
        $response = array('error'=>1,'msg'=>C('SITE_LANG.LOGIN_ALERT'));
        $this->ajaxReturn($response,'json');
      }
    }
    //get message of one piece
    public function get_piece($id){
        $piece = $this->piece_model->field('hs_user.userName,hs_piece.piece_id,hs_piece.date,hs_piece.tag,hs_piece.content')->
        join('hs_user ON hs_user.id=hs_piece.user_id AND hs_piece.piece_id='.$id)->find(); 
        $this->ajaxReturn(array('error'=>0,'items'=>$piece),'json');
    }
    
}