<?php
namespace Home\Controller;
use Think\Controller;
class EssayController extends Controller {
	private $essay_model;
    private $limit_num = 10;
	
    //构造函数
    
    public function index(){
      if($_SESSION['LOGIN_STATUS']){
        C('LAYOUT_ON',TRUE);//开启模板布局
        $this->essay_model = D('Essay');
        $cdt['userName'] = $_SESSION['USER_NAME'];
        $essays = $this->essay_model->where($cdt)->order('date desc')->limit(10)->select();
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
        $this->essay_model = D('Essay');
        $username = I('get.userName');
        if(!empty($username))
            $cdt['userName'] = $username;
        else
            $cdt['userName'] = $_SESSION['USER_NAME'];
        $page = I('get.page');
        if(empty($page))$page=0;
        $essays = $this->essay_model->where($cdt)->order('date desc')->limit($page*$this->limit_num,$this->limit_num)->select();
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
        $essay_model = D('Essay');
        $essay = $essay_model->where("id=".$id)->find();
        $this->assign('essay',$essay);
        $result = $this->fetch();
        $this->ajaxReturn($result,'json');
    }
    //获取文章数量
    public function get_essay_nums($username,$cdt=null){
        $essay_model = D('Essay');
        $cdt['userName'] = $username;
        return $essay_model->where($cdt)->count();
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
        $post_date = date("Y-m-d H:i:s");
        $data = array('title'=>$title,'tag'=>$tag,'content'=>$content,'userName'=>$userName,'visible'=>$visible,'date'=>$post_date);
        $essay_model = D('Essay');
        if($essay_model->add($data) != false){
            $this->success('发布成功！',U("Essay/index"));
        }else $this->error("发布失败，请稍后重试！");
    }
    //删除文章
    public function delete($id){
        $essay_model = D('Essay');
        $cdt['id'] = $id;
        if($essay_model->where($cdt)->limit(1)->delete() != false)
            $this->ajaxReturn(array('error'=>0),'json');
        else
            $this->ajaxReturn(array('error'=>1),'json');
    }
    //修改文章
    public function show_modify(){
        C('LAYOUT_ON',TRUE);
        $id = I('get.id');
        $userName = $_SESSION['USER_NAME'];
        $cdt['id'] = $id;
        $cdt['username'] = $userName;
        $essay_model = D('Essay');
        $essay = $essay_model->where($cdt)->find();
        $this->assign('essay',$essay);
        $this->display("modify");
    }
    public function modify($id,$title,$tag,$content,$visible){
        $last_modify_date = date("Y-m-d H:i:s");
        $data = array('title'=>$title,'tag'=>$tag,'content'=>$content,'visible'=>$visible,'last_modify_date'=>$last_modify_date);
        $essay_model = D('Essay');
        if($essay_model->where("id=".$id)->save($data) != false)
            $this->success("修改成功！",U("Essay/index"));
        else
            $this->error("修改失败，请稍后重试！");
    }
}