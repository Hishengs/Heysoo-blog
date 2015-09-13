<?php
namespace Home\Controller;
use Think\Controller;
class DiaryController extends Controller {
	private $diary_model;
    private $page_size = 10;
	
    //构造函数
    function __construct(){
        parent::__construct();
        $this->diary_model = D('Diary');
    }

    public function index(){
      if(session('current_item') != 'Diary' && session('?current_item'))
            $this->redirect(session('current_item')."/index");
      if($_SESSION['LOGIN_STATUS']){
        C('LAYOUT_ON',TRUE);//开启模板布局
        $cdt['userName'] = $_SESSION['USER_NAME'];
        $diarys = $this->diary_model->where($cdt)->order('date desc')->limit(10)->select();
        $totalCount = $this->diary_model->where($cdt)->count();
        $totalPage = $totalCount/$this->page_size;
        $this->assign('totalCount',$totalCount)->assign('pageSize',$this->page_size)
        ->assign('totalPage',$totalPage);
        for ($i=0; $i < count($diarys); $i++) { 
            $diarys[$i]['tag'] = explode(" ", $diarys[$i]['tag']);
        }
        $user_info = A('User')->get_user_info(session('USER_NAME'));
        $essay_nums = A('Essay')->get_essay_nums(session('USER_NAME'));
        $diary_nums = A('Diary')->get_diary_nums(session('USER_NAME'));
        $piece_nums = A('Piece')->get_piece_nums(session('USER_NAME'));
        $this->assign('diarys',$diarys)->assign('user',$user_info)->assign(array('essay_nums'=>$essay_nums,'diary_nums'=>$diary_nums,'piece_nums'=>$piece_nums));
        $this->display();
      }else $this->error('尚未登录，无法操作！',U("Action/login"));
    }
    //日记浏览
    public function view(){
        C('LAYOUT_ON',FALSE);
        $id = I('get.id');
        $diary = $this->diary_model->where("diary_id=".$id)->find();
        $diary['tag'] = explode(" ", $diary['tag']);
        $this->assign('diary',$diary);
        $result = $this->fetch();
        $this->ajaxReturn($result,'json');
    }
    public function get_diary_page(){
      if($_SESSION['LOGIN_STATUS']){
        C('LAYOUT_ON',FALSE);//关闭模板布局
        $user_id = I('get.user_id');
        if(empty($user_id))
            $user_id = $_SESSION['USER_ID'];
        //$diarys = $this->diary_model->where($cdt)->order('date desc')->limit(10)->select();
        $diarys = $this->diary_model->join('hs_user ON hs_user.id='.$user_id.' AND hs_diary.user_id='.$user_id)->order('hs_diary.date desc')->limit($this->page_size)->select();
        $totalCount = $this->diary_model->where("user_id=".$user_id)->count();
        $totalPage = $totalCount/$this->page_size;
        $this->assign('totalCount',$totalCount)->assign('pageSize',$this->page_size)
        ->assign('totalPage',$totalPage);
        for ($i=0; $i < count($diarys); $i++) { 
            $diarys[$i]['tag'] = explode(" ", $diarys[$i]['tag']);
        }
        $this->assign('diarys',$diarys);
        $result = $this->fetch("index");
        $this->ajaxReturn($result,'json');
      }else $this->error('尚未登录，无法操作！',U("Action/login"));
    }
    public function get_diary_nums($user_id,$cdt=null){
        $cdt['user_id'] = $user_id;
        return $this->diary_model->where($cdt)->count();
    }
    //发布日记
    public function ng_diary_post($title,$tag,$content,$visible,$ext=null){
        $userName = $_SESSION['USER_NAME'];
        $post_date = date("Y-m-d H:i:s");
        $data = array('title'=>$title,'tag'=>$tag,'content'=>$content,'userName'=>$userName,'visible'=>$visible,'date'=>$post_date);
        if($this->diary_model->add($data) != false){
            $this->ajaxReturn(array('error'=>0,'msg'=>'发布成功！'),'json');
        }else $this->ajaxReturn(array('error'=>1,'msg'=>'发布失败！'),'json');
    }
    //日记修改
    public function modify(){
        C('LAYOUT_ON',TRUE);
        $id = I('get.id');
        $userName = $_SESSION['USER_NAME'];
        $cdt['diary_id'] = $id;
        $cdt['username'] = $userName;
        $diary = $this->diary_model->where($cdt)->find();
        $this->assign('diary',$diary);
        $this->display("modify");
    }
    public function do_modify($id,$title,$tag,$content,$visible){
        $last_modify_date = date("Y-m-d H:i:s");
        $data = array('title'=>$title,'tag'=>$tag,'content'=>$content,'visible'=>$visible,'last_modify_date'=>$last_modify_date);
        if($this->diary_model->where("id=".$id)->save($data) != false)
            $this->success("修改成功！",U("Diary/index"));
        else
            $this->error("修改失败，请稍后重试！");
    }
    //删除日记
    public function delete($id){
        if($this->diary_model->where("diary_id=".$id)->limit(1)->delete() != false)
            $this->ajaxReturn(array('error'=>0),'json');
        else
            $this->ajaxReturn(array('error'=>1),'json');
    }
    public function load_diarys_html(){
        $page = I('get.page');
        $type = I('get.type');
        if($type=='init'){
            $response['error'] = 2;
            $this->ajaxReturn($response,'json');
        }
        else{
            C('LAYOUT_ON',FALSE);
            $cdt['userName'] = $_SESSION['USER_NAME'];
            $diarys = $this->diary_model->where($cdt)->order('date desc')->limit($page*$this->page_size,$this->page_size)->select();
            for ($i=0; $i < count($diarys); $i++) { 
                    $diarys[$i]['tag'] = explode(" ", $diarys[$i]['tag']);
                }
            $this->assign('diarys',$diarys);
            $html = $this->fetch("diarys");
            $response['error'] = 0;
            $response['html'] = $html;
            $this->ajaxReturn($response,'json');
        }
    }
}