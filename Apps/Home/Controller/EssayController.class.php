<?php
namespace Home\Controller;
use Think\Controller;
class EssayController extends Controller {
	private $essay_model;
    private $page_size = 10;
	
    //构造函数
    function __construct(){
        parent::__construct();
        $this->essay_model = D('Essay');
    }
    
    public function index(){
      if($_SESSION['LOGIN_STATUS']){
        C('LAYOUT_ON',TRUE);//开启模板布局
        $cdt['userName'] = $_SESSION['USER_NAME'];
        $essays = $this->essay_model->where($cdt)->order('date desc')->limit(10)->select();
        $totalCount = $this->essay_model->where($cdt)->count();
        $totalPage = $totalCount/$this->page_size;
        $this->assign('totalCount',$totalCount)->assign('pageSize',$this->page_size)
        ->assign('totalPage',$totalPage);
        if($essays != false){
            for ($i=0; $i < count($essays); $i++) { 
                $essays[$i]['tag'] = explode(" ", $essays[$i]['tag']);
            }
            $this->assign('essays',$essays);
            $result = $this->fetch("index");
        }else{
            $result = array('empty'=>1);
        }
        $user_info = A('User')->get_user_info(session('USER_NAME'));
        $essay_nums = A('Essay')->get_essay_nums(session('USER_NAME'));
        $diary_nums = A('Diary')->get_diary_nums(session('USER_NAME'));
        $piece_nums = A('Piece')->get_piece_nums(session('USER_NAME'));
        $this->assign('essays',$essays)->assign('user',$user_info)->assign(array('essay_nums'=>$essay_nums,'diary_nums'=>$diary_nums,'piece_nums'=>$piece_nums));
        $this->display();
      }else $this->error('尚未登录，无法操作！',U("Action/login"));
    }
    public function get_essay_page(){
      if($_SESSION['LOGIN_STATUS']){
        C('LAYOUT_ON',FALSE);//关闭模板布局
        $user_id = I('get.user_id');
        if(empty($user_id))
            $user_id = $_SESSION['USER_ID'];
        //$essays = $this->essay_model->where($cdt)->order('date desc')->limit($this->page_size)->select();
        $essays = $this->essay_model->join('hs_user ON hs_user.id='.$user_id.' AND hs_essay.user_id='.$user_id)->order('hs_essay.date desc')->limit($this->page_size)->select();
        $totalCount = $this->essay_model->where("user_id=".$user_id)->count();
        $totalPage = $totalCount/$this->page_size;
        $this->assign('totalCount',$totalCount)->assign('pageSize',$this->page_size)
        ->assign('totalPage',$totalPage);
        if($essays != false){
            for ($i=0; $i < count($essays); $i++) { 
                $essays[$i]['tag'] = explode(" ", $essays[$i]['tag']);
            }
            $this->assign('essays',$essays);
            $result = $this->fetch("index");
        }else{
            $result = array('empty'=>1);
        }
        $this->ajaxReturn($result,'json');
      }else $this->error('尚未登录，无法操作！',U("Action/login"));
    }
    //文章浏览
    public function view(){
        C('LAYOUT_ON',FALSE);
        $id = I('get.id');
        $essay = $this->essay_model->field('hs_user.userName,hs_essay.essay_id,hs_essay.title,hs_essay.date,hs_essay.tag,hs_essay.content')->
        join('hs_user ON hs_user.id=hs_essay.user_id AND hs_essay.essay_id='.$id)->find(); 
        $essay['tag'] = explode(" ", $essay['tag']);
        //获取评论信息
        $comments = A('Comment')->get_essay_comments($essay['essay_id']);
        $comments_num = count($comments);
        $this->assign('essay',$essay)->assign('comments',$comments)->assign('comments_num',$comments_num);
        $result = $this->fetch();
        $this->ajaxReturn($result,'json');
    }
    //获取文章数量
    public function get_essay_nums($user_id,$cdt=null){
        $cdt['user_id'] = $user_id;
        return $this->essay_model->where($cdt)->count();
    }
    //加载更多
    public function load_more(){
        //
    }
    //获取文章编辑页面
    public function get_edit_page(){
        return $this->fetch("Essay/edit");
    }
    public function edit_page(){
        C('LAYOUT_ON',TRUE);
        $user_info = A('User')->get_user_info(session('USER_NAME'));
        $essay_nums = A('Essay')->get_essay_nums(session('USER_NAME'));
        $diary_nums = A('Diary')->get_diary_nums(session('USER_NAME'));
        $piece_nums = A('Piece')->get_piece_nums(session('USER_NAME'));
        $this->assign('user',$user_info)->assign(array('essay_nums'=>$essay_nums,'diary_nums'=>$diary_nums,'piece_nums'=>$piece_nums));
        $this->display("edit");
    }
    //发布文章
    public function essay_post($title,$tag,$content,$visible,$ext=null){
        $userName = $_SESSION['USER_NAME'];
        $user_id = $_SESSION['USER_ID'];
        $post_date = date("Y-m-d H:i:s");
        $data = array('user_id'=>$user_id,'title'=>$title,'tag'=>$tag,'content'=>$content,'userName'=>$userName,'visible'=>$visible,'date'=>$post_date);
        $result = $this->essay_model->add($data);
        if($result != false){
            if($visible == 1){
                $content = "我发布了一篇文章：<a href='javascript:viewEssay($result);'>$title</a>";
                A('Piece')->piece_post('文章',$content,1);
            }
            $this->success('发布成功！',U("Essay/index"));
        }else $this->error("发布失败，请稍后重试！");
    }
    //删除文章
    public function delete($id){
        if($this->essay_model->where("essay_id=".$id)->limit(1)->delete() != false)
            $this->ajaxReturn(array('error'=>0),'json');
        else
            $this->ajaxReturn(array('error'=>1),'json');
    }
    //修改文章
    public function modify(){
        C('LAYOUT_ON',TRUE);
        $id = I('get.id');
        $userName = $_SESSION['USER_NAME'];
        $user_id = $_SESSION['USER_ID'];
        $cdt['essay_id'] = $id;
        $cdt['username'] = $userName;
        $essay = $this->essay_model->where($cdt)->find();
        $this->assign('essay',$essay);
        $this->display("modify");
    }
    public function do_modify($id,$title,$tag,$content,$visible){
        $last_modify_date = date("Y-m-d H:i:s");
        $data = array('title'=>$title,'tag'=>$tag,'content'=>$content,'visible'=>$visible,'last_modify_date'=>$last_modify_date);
        if($this->essay_model->where("essay_id=".$id)->save($data) != false)
            $this->success("修改成功！",U("Essay/index"));
        else
            $this->error("修改失败，请稍后重试！");
    }
    //处理分页
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
    public function load_essays_html(){
        $page = I('get.page');
        $type = I('get.type');
        if($type=='init'){
            $response['error'] = 2;
            $this->ajaxReturn($response,'json');
        }
        else{
            C('LAYOUT_ON',FALSE);
            $user_id = $_SESSION['USER_ID'];
            //$essays = $this->essay_model->where($cdt)->order('date desc')->limit($page*$this->page_size,$this->page_size)->select();
            $essays = $this->essay_model->join('hs_user ON hs_user.id='.$user_id.' AND hs_essay.user_id='.$user_id)->order('hs_essay.date desc')->limit($page*$this->page_size,$this->page_size)->select();
            for ($i=0; $i < count($essays); $i++) { 
                    $essays[$i]['tag'] = explode(" ", $essays[$i]['tag']);
                }
            $this->assign('essays',$essays);
            $html = $this->fetch("essays");
            $response['error'] = 0;
            $response['html'] = $html;
            $this->ajaxReturn($response,'json');
        }
    }
    //发布文章评论
    public function post_comment(){
        if(C('ESSAY_COMMENT_ON')){//评论功能是否开启
            $essay_id = I('post.essay_id');
            $comment_content = I('post.comment_content','','');
            $user_id = $_SESSION['USER_ID'];
            $comment_date = date("Y-m-d H:i:s");
            $data = array('user_id'=>$user_id,'essay_id'=>$essay_id,'comment_date'=>$comment_date,'comment_content'=>$comment_content);
            $comment_model = D("Comment");
            if($comment_model->add($data) != false){
                $this->ajaxReturn(array('error'=>0,'comment'=>array('user'=>$_SESSION['USER_NAME'],'date'=>$comment_date,
                    'content'=>$comment_content)),'json');
            }
            else $this->ajaxReturn(array('error'=>1,'msg'=>'评论失败'),'json');
        }else $this->ajaxReturn(array('error'=>2,'msg'=>'评论功能已关闭'),'json');
    } 
    //
    public function ng_get_essay_page(){
        if($_SESSION['LOGIN_STATUS']){
            $user_id = $_SESSION['USER_ID'];
            $essays = $this->essay_model->join('hs_user ON hs_user.id=hs_essay.user_id AND hs_essay.user_id='.$user_id)->order('hs_essay.date desc')->limit($this->page_size)->select();
            $totalCount = $this->essay_model->where('user_id='.$user_id)->count();
            $page = array('totalCount'=>$totalCount,'pageSize'=>$this->page_size,'totalPage'=>$totalCount/$this->page_size);
            $response = array('items'=>$essays,'page'=>$page);
            $this->ajaxReturn($response,'json');
        }
    }
    public function ng_view(){
        $id = I('get.id');
        $essay = $this->essay_model->field('hs_user.userName,hs_essay.essay_id,hs_essay.title,hs_essay.date,hs_essay.tag,hs_essay.content')->
        join('hs_user ON hs_user.id=hs_essay.user_id AND hs_essay.essay_id='.$id)->find(); 
        //$essay['tag'] = explode(" ", $essay['tag']);
        //获取评论信息
        $comments = A('Comment')->get_essay_comments($essay['essay_id']);
        $comments_num = count($comments);
        $res = array('essay'=>$essay,'comments'=>$comments,'comments_num'=>$comments_num);
        $this->ajaxReturn($res,'json');
    }
}