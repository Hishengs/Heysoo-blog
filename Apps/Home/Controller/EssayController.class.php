<?php
namespace Home\Controller;
use Think\Controller;
/**
 * Deal with essay
 * Author:Hisheng
 * Last modify date:2015/09/30
 */
class EssayController extends Controller {
	private $essay_model;
    private $page_size;
    private $user_id;
    private $comment_model;
	
    function __construct(){
        parent::__construct();
        if(empty($_SESSION['USER_ID']))exit(C('SITE_LANG.LOGIN_ALERT'));
        $this->essay_model = D('Essay');
        $this->comment_model = D("Comment");
        $this->page_size = C('ESSAY_LOAD_NUM_PER_PAGE');
        $this->user_id = $_SESSION['USER_ID'];
    }
    
    public function index(){
      echo "Hello,".C('SITE_LANG.SITE_NAME');
    }
    //get the number of user's essays
    public function get_essay_nums($user_id,$cdt=null){
        $cdt['user_id'] = $user_id;
        return $this->essay_model->where($cdt)->count();
    }
    //deal essay post request
    public function ng_essay_post($title,$tag,$content,$visible,$post_piece=false){
        $str_num = A('Action')->str_length($content);
        $current_str_num = $str_num['cn']+$str_num['en'];
        if(empty($title))$this->ajaxReturn(array('error'=>1,'msg'=>'文章标题不能为空！'),'json');      
        else if($current_str_num < 1)$this->ajaxReturn(array('error'=>1,'msg'=>'文章内容不能为空！'),'json');
        else if($current_str_num > 10000)$this->ajaxReturn(array('error'=>1,'msg'=>'文章总字数不能超过1万个字！当前字数为：'.$current_str_num,'str_num'=>$str_num),'json');
        else
        {
            $userName = $_SESSION['USER_NAME'];
            $post_date = date("Y-m-d H:i:s");
            if(empty($tag))$tag='文章';
            $data = array('user_id'=>$this->user_id,'title'=>$title,'tag'=>$tag,'content'=>$content,'userName'=>$userName,'visible'=>$visible,'date'=>$post_date);
            $result = $this->essay_model->add($data);
            if($result != false){
                $post_piece = $post_piece=="false"?false:true;
                if($visible == 1 && $post_piece){
                    $content = "我发布了一篇文章：<a href='javascript:view(1,$result);'>$title</a>";
                    A('Piece')->ng_piece_post('文章',$content,1,false);
                }
                $this->ajaxReturn(array('error'=>0,'id'=>$result,'msg'=>C('SITE_LANG.POST_SUCCESS')),'json');
            }else $this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.POST_FAILED')),'json');
        }
    }
    //delete essay
    public function ng_delete($id){
        /**删除一篇文章
        /*1.删除该文章
        //2.删除相关的评论
        //3.删除相关的消息
        */
        if($this->essay_model->where("essay_id=".$id)->limit(1)->delete() != false)
        {
            $this->comment_model->where('essay_id='.$id)->delete();
            $this->ajaxReturn(array('error'=>0,'msg'=>C('SITE_LANG.DELETE_SUCCESS')),'json');
        }
        else
            $this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.DELETE_FAILED')),'json');
    }
    public function do_modify($id,$title,$tag,$content,$visible,$post_piece=false){
        $last_modify_date = date("Y-m-d H:i:s");
        $data = array('title'=>$title,'tag'=>$tag,'content'=>$content,'visible'=>$visible,'last_modify_date'=>$last_modify_date);
        $res = $this->essay_model->where("essay_id=".$id)->save($data);
        if($res != false){
            $post_piece = $post_piece=="false"?false:true;
            if($visible == 1 && $post_piece){
                $content = "我修改了文章：<a href='javascript:view(1,$id);'>$title</a>";
                A('Piece')->ng_piece_post('文章修改',$content,1,false);
            }
            $this->ajaxReturn(array('error'=>0,'msg'=>C('SITE_LANG.MODIFY_SUCCESS')),'json');
        }
        else
            $this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.MODIFY_FAILED')),'json');
    }
    //deal pagination
    public function deal_pagination($pageNumber,$pageSize){
        $cdt['userName'] = $_SESSION['USER_NAME'];
        $essays = $this->essay_model->where($cdt)->order('date desc')->limit($pageNumber*$pageSize,$pageSize)->select();
        for ($i=0; $i < count($essays); $i++) { 
                $essays[$i]['tag'] = explode(" ", $essays[$i]['tag']);
            }
        $this->assign("essays",$essays);
        $totalCount = $this->essay_model->where($cdt)->count();
        $totalPage = $totalCount/$this->page_size;
        $this->assign('totalCount',$totalCount)->assign('pageSize',$this->page_size)
        ->assign('totalPage',$totalPage)->assign('pageNumber',$pageNumber);
        $html = $this->fetch("index");
        $response['error'] = 0;
        $response['html'] = $html;
        $this->ajaxReturn($response,'json');
    }
    protected function get_essay_info_by_essay_id($essay_id){
        $essay = $this->essay_model->where('essay_id='.$essay_id)->limit(1)->find();
        return $essay;
    }
    //post essay comment
    public function post_comment(){
        $essay_id = I('post.essay_id');
        $user_id = $this->get_essay_info_by_essay_id($essay_id)['user_id'];
        $user_config = A('User')->get_user_config($user_id);
        if(C('ESSAY_COMMENT_ON') && $user_config['privacy_essay_comment']==1){//check if essay comment open
            $comment_content = I('post.comment_content','','');
            $str_num = A('Action')->str_length($comment_content);
            $current_str_num = $str_num['cn']+$str_num['en'];
            if($current_str_num < 1){$this->ajaxReturn(array('error'=>1,'msg'=>'评论内容不能为空！'),'json');}
            $comment_date = date("Y-m-d H:i:s");
            $data = array('user_id'=>$this->user_id,'essay_id'=>$essay_id,'comment_date'=>$comment_date,'comment_content'=>$comment_content);
            $res = $this->comment_model->add($data);
            if($res != false){
                $essay_info = $this->get_essay_info_by_essay_id($essay_id);
                $essay_user_id = $essay_info['user_id'];
                $msg_content = ' 评论了你的文章 <a href="javascript:view(1,'.$essay_id.');">'.$essay_info['title'].'</a>';
                A('Message')->msg_push('comment',1,'essay',$res,$comment_date,$this->user_id,$essay_user_id,$msg_content);
                $this->ajaxReturn(array('error'=>0,'comment'=>array('user'=>$_SESSION['USER_NAME'],'date'=>$comment_date,
                    'content'=>$comment_content),'msg'=>C('SITE_LANG.COMMENT_SUCCESS'),
                'user_id'=>$this->user_id,'comment_id'=>$res),'json');
            }
            else $this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.COMMENT_FAILED')),'json');
        }else $this->ajaxReturn(array('error'=>2,'msg'=>C('SITE_LANG.COMMENT_CLOSED')),'json');
    } 
    //reply comment
    public function essay_comment_reply(){
        $essay_id = I('post.essay_id');
        $user_id = $this->get_essay_info_by_essay_id($essay_id)['user_id'];
        $user_config = A('User')->get_user_config($user_id);
        if(C('ESSAY_COMMENT_ON') && $user_config['privacy_essay_comment']==1){//check if essay comment open
            $replyTo_id = I('post.replyTo_id');
            $parent_cmt_id = I('post.parent_cmt_id');
            $user_info = A('User')->get_user_info($replyTo_id);
            $reply_content = I('post.reply_content','','');
            $str_num = A('Action')->str_length($reply_content);
            $current_str_num = $str_num['cn']+$str_num['en'];
            if($current_str_num < 1){$this->ajaxReturn(array('error'=>1,'msg'=>'评论内容不能为空！'),'json');}
            $reply_content = '回复 <a href="javascript:viewUser('.$replyTo_id.');">'.$user_info['username'].'</a> : '.$reply_content;
            $comment_date = date("Y-m-d H:i:s");
            $data = array('parent_comment_id'=>$parent_cmt_id,'user_id'=>$this->user_id,'essay_id'=>$essay_id,'reply_to_id'=>$replyTo_id,'comment_date'=>$comment_date,'comment_content'=>$reply_content);
            $res = $this->comment_model->add($data);
            if($res != false){
                $essay_info = $this->get_essay_info_by_essay_id($essay_id);
                $msg_content = ' 回复了你在文章 <a href="javascript:view(1,'.$essay_id.');">'.$essay_info['title'].'</a> 的评论';
                A('Message')->msg_push('comment',1,'essay',$res,$comment_date,$this->user_id,$replyTo_id,$msg_content);
                $this->ajaxReturn(array('error'=>0,'comment'=>array('user'=>$_SESSION['USER_NAME'],'date'=>$comment_date,
                    'content'=>$reply_content),'msg'=>C('SITE_LANG.COMMENT_SUCCESS'),
                'user_id'=>$this->user_id,'comment_id'=>$res),'json');
            }
            else $this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.COMMENT_FAILED')),'json');
        }else $this->ajaxReturn(array('error'=>2,'msg'=>C('SITE_LANG.COMMENT_CLOSED')),'json');
    }
    public function ng_get_essay_page($page=null){
        if($_SESSION['LOGIN_STATUS']){
            $page = $page?$page-1:0;
            $essays = $this->essay_model->join('hs_user ON hs_user.id=hs_essay.user_id AND hs_essay.user_id='.$this->user_id)
            ->field('hs_user.userName,hs_essay.essay_id,hs_essay.user_id,hs_essay.title,hs_essay.date,hs_essay.tag,LEFT(hs_essay.content,1000) as content,hs_essay.visible')
            ->order('hs_essay.date desc')->limit($page*$this->page_size,$this->page_size)->select();
            $response = array('error'=>0,'items'=>$essays,'page'=>$page+1);
            $this->ajaxReturn($response,'json');
        }else{
            $response = array('error'=>1,'msg'=>C('SITE_LANG.LOGIN_ALERT'));
            $this->ajaxReturn($response,'json');
        }
    }
    //view page of essay
    public function ng_view(){
        $id = I('get.id');
        $essay = $this->essay_model->field('hs_user.userName,hs_essay.user_id,hs_essay.essay_id,hs_essay.title,hs_essay.date,hs_essay.tag,hs_essay.content,hs_essay.visible')->
        join('hs_user ON hs_user.id=hs_essay.user_id AND hs_essay.essay_id='.$id)->find(); 
        if($essay['visible'] == 1 || ($essay['visible'] == 0 && $essay['user_id'] == $this->user_id)){
            //check if essay comment open
            $user_config = A('User')->get_user_config($essay['user_id']);
            $privacy_essay_comment = $user_config['privacy_essay_comment']==1?true:false;
            $essay_comment_on = $privacy_essay_comment && C('ESSAY_COMMENT_ON');
            //get essay comments
            $comments = A('Comment')->get_essay_comments($essay['essay_id']);
            $comments_num = count($comments);
            $res = array('error'=>0,'essay'=>$essay,'comments'=>$comments,'comments_num'=>$comments_num,'essay_comment_on'=>$essay_comment_on);
            $this->ajaxReturn($res,'json');
        }else if($essay['visible'] == 0 && $essay['user_id'] != $this->user_id)
        $this->ajaxReturn(array('error'=>1,'msg'=>'你无查看此文章的权限！'),'json');
        else $this->ajaxReturn(array('error'=>2,'msg'=>'查询失败！'),'json');
    }
    //get message of one essay
    public function get_essay($id){
        $essay = $this->essay_model->field('hs_user.userName,hs_essay.essay_id,hs_essay.title,hs_essay.visible,hs_essay.tag,hs_essay.content')->
        join('hs_user ON hs_user.id=hs_essay.user_id AND hs_essay.essay_id='.$id)->find(); 
        $this->ajaxReturn(array('error'=>0,'items'=>$essay),'json');
    }
}