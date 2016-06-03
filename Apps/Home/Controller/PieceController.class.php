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
    private $piece_comment_model;
    private $page_size;
    private $user_id;
	
    function __construct(){
        parent::__construct();
        $this->piece_model = D('Piece');
        $this->piece_comment_model = D('PieceComment');
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
            $visible_tag = empty(I('post.visible_tag'))?'':I('post.visible_tag');
            $post_date = date("Y-m-d H:i:s");
            $data = array('user_id'=>$this->user_id,'tag'=>$tag,'content'=>$content,'visible'=>$visible,'visible_tag'=>$visible_tag,'date'=>$post_date);
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
    public function post(){ 
        $content = I('post.content','','');
        $str_num = A('Action')->str_length($content);
        $current_str_num = $str_num['cn']+$str_num['en'];
        //if($current_str_num < 1)$this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.PIECE_CONTENT_EMPTY_TIP')),'json');
        if(empty(trim($content)))$this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.PIECE_CONTENT_EMPTY_TIP')),'json');
        if($current_str_num > 255)$this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.PIECE_CONTENT_LENGTH_ERROR').$current_str_num,'str_num'=>$str_num),'json');
        else{
            $userName = $_SESSION['USER_NAME'];
            $tag = I('post.tag')?I('post.tag'):'碎片';
            $visible_tag = I('post.visible_tag')?I('post.visible_tag'):'';
            $post_date = date("Y-m-d H:i:s");
            $data = array('user_id'=>$this->user_id,'tag'=>$tag,'content'=>$content,'visible'=>I('post.visible'),'visible_tag'=>$visible_tag,'date'=>$post_date);
            if($this->piece_model->add($data) != false){
                $this->ajaxReturn(array('error'=>0,'msg'=>C('SITE_LANG.POST_SUCCESS'),'str_num'=>$str_num),'json');
            }else $this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.POST_FAILED')),'json');
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
        {
            $this->piece_comment_model->where('piece_id='.$piece_id)->delete();
            $this->ajaxReturn(array('error'=>0,'msg'=>C('SITE_LANG.DELETE_SUCCESS')),'json');
        }
        else
            $this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.DELETE_FAILED')),'json');
    }
    //delete piece
    public function delete(){
        $piece_id = I('post.piece_id');
        $cdt = array('user_id'=>$this->user_id,'piece_id'=>$piece_id);
        if($this->piece_model->where($cdt)->delete()){
            //删除属于该碎片的所有评论
            $cdt = array('piece_id'=>$piece_id);
            $this->piece_comment_model->where($cdt)->delete();
            $this->ajaxReturn(array('error'=>0,'msg'=>C('SITE_LANG.DELETE_SUCCESS')),'json');
        }
        else $this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.DELETE_FAILED')),'json');
    }
    //post piece comment
    public function post_comment(){
        $piece_id = I('post.piece_id');
        $reply_to_id = I('post.reply_to_id');
        $user_id = $this->get_piece_info_by_id($piece_id)['user_id'];
        $user_config = A('User')->get_user_config($user_id);
        if(C('PIECE_COMMENT_ON') && $user_config['privacy_piece_comment'] == 1){
            $comment_content = I('post.comment_content','','');
            //check str num
            $str_num = A('Action')->str_length($comment_content);
            $current_str_num = $str_num['cn']+$str_num['en'];
            if($current_str_num < 1){$this->ajaxReturn(array('error'=>1,'msg'=>'评论内容不能为空！'),'json');}
            else if($current_str_num > 500)
                $this->ajaxReturn(array('error'=>1,'msg'=>'评论总字数不能超过500个字！当前字数为：'.$current_str_num,'str_num'=>$str_num),'json');
            if(!empty($reply_to_id)){
                $reply_to_name = A('User')->get_user_info($reply_to_id)['username'];
                $comment_content = '@'.'<a href="javascript:viewUser('.$reply_to_id.')">'.$reply_to_name.'</a> : '.$comment_content;
            }
            //$msg_receiver_id = I('post.obj_id');
            $msg_receiver_id = $this->get_piece_info_by_id($piece_id)['user_id'];
            $comment_date = date("Y-m-d H:i:s");
            $data = array('user_id'=>$this->user_id,'piece_id'=>$piece_id,'reply_to_id'=>$reply_to_id,'comment_date'=>$comment_date,'comment_content'=>$comment_content);
            $res = $this->piece_comment_model->add($data);
            if($res != false){
                $userName = A('User')->get_user_info($this->user_id)['username'];
                //生成消息，如果是评论自己的则不用
                $msg_content = ' 评论了你的碎片';
                if(!empty($reply_to_id)){//if it is a reply comment
                    $msg_reply_content = ' 回复了你的碎片评论';
                    if($reply_to_id != $this->user_id)//not reply to self
                        A('Message')->msg_push('comment',1,'piece',$res,$comment_date,$this->user_id,$reply_to_id,$msg_reply_content);
                    if($user_id != $this->user_id)//if not comment to self
                          A('Message')->msg_push('comment',1,'piece',$res,$comment_date,$this->user_id,$msg_receiver_id,$msg_content);
                }
                else {
                    if($user_id != $this->user_id)
                         A('Message')->msg_push('comment',1,'piece',$res,$comment_date,$this->user_id,$msg_receiver_id,$msg_content);
                }
                $this->ajaxReturn(array('error'=>0,'userName'=>$userName,'comment'=>$data,'msg'=>C('SITE_LANG.COMMENT_SUCCESS')),'json');
            }
            else $this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.COMMENT_FAILED')),'json');
        }else $this->ajaxReturn(array('error'=>2,'msg'=>C('SITE_LANG.COMMENT_CLOSED')),'json');
    } 
    //get piece comment
    public function get_piece_comment(){
        $piece_id = I('get.piece_id');
        $cdt['piece_id'] = $piece_id;
        $comments = $this->piece_comment_model->
        field('hs_user.username,hs_piece_comment.user_id,hs_user.avatar,hs_piece_comment.comment_id,hs_piece_comment.comment_date,hs_piece_comment.comment_content')
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
        $pieces = $this->piece_model->alias('p')->field('count(c.comment_id) as comments_num,u.userName,u.avatar,p.piece_id,p.user_id,p.date,p.tag,p.content')
        ->join('hs_user as u ON u.id=p.user_id AND p.user_id='.$this->user_id)
        ->join('hs_piece_comment as c on c.piece_id=p.piece_id','LEFT')
        ->group('p.piece_id')
        ->order('p.date desc')
        ->limit($page*$this->page_size,$this->page_size)->select();
        $count = $this->piece_model->where('user_id='.$this->user_id)->count();
        $response = array('error'=>0,'items'=>$pieces,'page'=>$page+1,'count'=>$count);
        $this->ajaxReturn($response,'json');
      }else{
        $response = array('error'=>1,'msg'=>C('SITE_LANG.LOGIN_ALERT'));
        $this->ajaxReturn($response,'json');
      }
    }
    //get message of one piece
    public function get_piece($id){
        $piece = $this->piece_model->field('hs_user.userName,hs_piece.piece_id,hs_piece.user_id,hs_piece.date,hs_piece.tag,hs_piece.content')->
        join('hs_user ON hs_user.id=hs_piece.user_id AND hs_piece.piece_id='.$id)->find(); 
        $this->ajaxReturn(array('error'=>0,'items'=>$piece),'json');
    }
    //get piece info by id
    public function get_piece_info_by_id($piece_id){
        $piece = $this->piece_model->where('piece_id='.$piece_id)->limit(1)->find();
        return $piece;
    }
    //删除碎片评论
    public function delete_comment(){
        $comment_id = I('post.comment_id');
        $cdt = array('user_id'=>$this->user_id,'comment_id'=>$comment_id);
        if($this->piece_comment_model->where($cdt)->delete())
            $this->ajaxReturn(array('error'=>0,'msg'=>C('SITE_LANG.DELETE_SUCCESS')),'json');
        else $this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.DELETE_FAILED')),'json');
    }
}