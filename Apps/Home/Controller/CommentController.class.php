<?php
namespace Home\Controller;
use Think\Controller;
class CommentController extends Controller {
	private $comment_model;
	
    //构造函数
    function __construct(){
        parent::__construct();
        $this->comment_model = D('Comment');
    }
    //获取文章评论
    public function get_essay_comments($essay_id){
    	$result = $this->comment_model->where("essay_id=".$essay_id)->order("comment_date desc")->select();
    	return $result;
    }
}

?>