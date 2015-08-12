<?php
namespace Home\Controller;
use Think\Controller;
class DiaryController extends Controller {
	private $diary_model;
	
    public function index(){
      if(session('current_item') != 'Diary' && session('?current_item'))
            $this->redirect(session('current_item')."/index");
      if($_SESSION['LOGIN_STATUS']){
        C('LAYOUT_ON',TRUE);//开启模板布局
      	$this->diary_model = D('Diary');
        $cdt['userName'] = $_SESSION['USER_NAME'];
        $diarys = $this->diary_model->where($cdt)->order('date desc')->limit(10)->select();
        $user = D('User');
        $cdt1['userName'] = $_SESSION['USER_NAME'];
        $user_data = $user->where($cdt1)->find();
        $this->assign('diarys',$diarys)->assign('user',$user_data);
        $this->display();
      }else $this->error('尚未登录，无法操作！',U("Action/login"));
    }
    //日记浏览
    public function view(){
        C('LAYOUT_ON',FALSE);
        $id = I('get.id');
        $diary_model = D('Diary');
        $diary = $diary_model->where("id=".$id)->find();
        $this->assign('diary',$diary);
        $result = $this->fetch();
        $this->ajaxReturn($result,'json');
    }
    public function get_diary_page(){
      if($_SESSION['LOGIN_STATUS']){
        C('LAYOUT_ON',FALSE);//关闭模板布局
        session('current_item','Diary');
        $this->diary_model = D('Diary');
        $username = I('get.userName');
        if(!empty($username))
            $cdt['userName'] = $username;
        else
            $cdt['userName'] = $_SESSION['USER_NAME'];
        $diarys = $this->diary_model->where($cdt)->order('date desc')->limit(10)->select();
        for ($i=0; $i < count($diarys); $i++) { 
            $diarys[$i]['tag'] = explode(" ", $diarys[$i]['tag']);
        }
        $this->assign('diarys',$diarys);
        $result = $this->fetch("index");
        $this->ajaxReturn($result,'json');
      }else $this->error('尚未登录，无法操作！',U("Action/login"));
    }
    public function get_diary_nums($username,$cdt=null){
        $diary_model = D('Diary');
        $cdt['userName'] = $username;
        return $diary_model->where($cdt)->count();
    }
    //发布文章
    public function diary_post($title,$tag,$content,$visible,$ext=null){
        $userName = $_SESSION['USER_NAME'];
        $post_date = date("Y-m-d H:i:s");
        $data = array('title'=>$title,'tag'=>$tag,'content'=>$content,'userName'=>$userName,'visible'=>$visible,'date'=>$post_date);
        $diary_model = D('Diary');
        if($diary_model->add($data) != false){
            $this->success('发布成功！',U("Diary/index"));
        }else $this->error("发布失败，请稍后重试！");
    }
}