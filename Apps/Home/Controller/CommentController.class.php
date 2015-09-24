<?php
namespace Home\Controller;
use Think\Controller;
class CommentController extends Controller {
	private $comment_model;
              private $piece_comment_model;
	
    //构造函数
    function __construct(){
        parent::__construct();
        $this->comment_model = D('Comment');
        $this->piece_comment_model = D('PieceComment');
    }
     public function index(){echo "Hello,Heysoo!";}
    //获取文章评论
    public function get_essay_comments($essay_id){
        $result = $this->comment_model->join("hs_user ON hs_user.id=hs_comment.user_id AND hs_comment.essay_id=".$essay_id)->order("hs_comment.comment_date desc")->select();
        return $result;
    }
    public function ng_get_essay_comment(){
        if(isset($_SESSION['USER_ID'])){
        $cmt_id = I('get.cmt_id');
        $res = $this->comment_model->join("hs_user ON hs_user.id=hs_comment.user_id")
        ->join("hs_essay ON hs_essay.essay_id=hs_comment.essay_id AND hs_comment.comment_id=$cmt_id")
        ->field('hs_user.userName,hs_user.id,hs_essay.title,hs_essay.essay_id,hs_comment.comment_date,hs_comment.comment_content')
        ->find();
        if($res != false)$this->ajaxReturn(array('error'=>0,'comment'=>$res),'json');
            else $this->ajaxReturn(array('error'=>1,'msg'=>'查询失败，请稍后重试！'),'json');
        }else $this->error('请先登录后再操作！',U('Action/login'));
    }
    //get piece comment
    public function ng_get_piece_comment(){
        if(isset($_SESSION['USER_ID'])){
        $cmt_id = I('get.cmt_id');
        $res = $this->piece_comment_model->join("hs_user ON hs_user.id=hs_piece_comment.user_id")
        ->join("hs_piece ON hs_piece.piece_id=hs_piece_comment.piece_id AND hs_piece_comment.comment_id=$cmt_id")
        ->field('hs_user.userName,hs_user.id,hs_piece.content,hs_piece_comment.comment_date,hs_piece_comment.comment_content')
        ->find();
        if($res != false)$this->ajaxReturn(array('error'=>0,'comment'=>$res),'json');
            else $this->ajaxReturn(array('error'=>1,'msg'=>'查询失败，请稍后重试！'),'json');
        }else $this->error('请先登录后再操作！',U('Action/login'));
    }
}

?>