<?php
namespace Home\Controller;
use Think\Controller;
class IndexController extends Controller {
	private $login_status = false;
	private $piece_model;

    public function index(){
        if(!empty($_COOKIE['history_url']))redirect($_COOKIE['history_url']);
    	if(session('LOGIN_STATUS')){
            //check_history_url();
            C('LAYOUT_ON',TRUE);
    		$this->piece_model = D("Piece");
    		$cdt['isPublic'] = 1;
    		$pieces = $this->piece_model->where($cdt)->order('date desc')->limit(15)->select();
            $user_info = A('User')->get_user_info(session('USER_NAME'));
            $essay_nums = A('Essay')->get_essay_nums(session('USER_NAME'));
            $diary_nums = A('Diary')->get_diary_nums(session('USER_NAME'));
            $piece_nums = A('Piece')->get_piece_nums(session('USER_NAME'));
            for ($i=0; $i < count($pieces); $i++) { 
                $pieces[$i]['tag'] = explode(" ", $pieces[$i]['tag']);
            }
    		$this->assign('pieces',$pieces)->assign('user',$user_info)->assign(array('essay_nums'=>$essay_nums,'diary_nums'=>$diary_nums,'piece_nums'=>$piece_nums));
    		//获取用户配置
            $user_config = A('User')->get_user_config($_SESSION['USER_ID']);
            $this->assign('user_config',$user_config);
            $this->display();
    	}else{
            $this->redirect("Action/login");
        }
    }
    public function get_index_page(){
        if($_SESSION['LOGIN_STATUS']){
        //set_history_url(U('Index/index'));
        C('LAYOUT_ON',FALSE);//关闭模板布局
        $this->piece_model = D('Piece');
        $cdt['isPublic'] = 1;
        $pieces = $this->piece_model->where($cdt)->order('date desc')->limit(15)->select();
        for ($i=0; $i < count($pieces); $i++) { 
                $pieces[$i]['tag'] = explode(" ", $pieces[$i]['tag']);
            }
        $this->assign('pieces',$pieces);
        $result = $this->fetch("index");
        $this->ajaxReturn($result,'json');
      }else $this->error('尚未登录，无法操作！',U("Index/login"));
    }
    //view页面
    public function view(){
        $type = I('get.type');
        $id = I('get.id');
        switch ($type) {
            case 'essay':
                $this->assign('view',$this->getEssay($id));
                break;
            
            default:
                # code...
                break;
        }
        $this->display(":view");
    }
    public function get_view_page(){
        C('LAYOUT_ON',FALSE);//关闭模板布局
        $type = I('get.type');
        $id = I('get.id');
        switch ($type) {
            case 'essay':
                $this->assign('view',$this->getEssay($id));
                break;
            
            default:
                $this->assign('view',$this->getEssay($id));
                break;
        }
        $result = $this->fetch(":view");
        $this->ajaxReturn($result,'json');
    }
    //获取文章
   public function getEssay($id){
        $cdt['id'] = $id;
        return D('Essay')->where($cdt)->limit(1)->find();
   }
   //加载碎片
   public function load_pieces(){
        C('LAYOUT_ON',FALSE);
        $startNum = I('get.startNum');
        $piece_model = D('Piece');
        $pieces = $piece_model->where("visible=1")->limit($startNum,10)->order("date desc")->select();
        if($pieces != false){
            for ($i=0; $i < count($pieces); $i++) { 
                $pieces[$i]['tag'] = explode(" ", $pieces[$i]['tag']);
            }
            $this->assign('pieces',$pieces);
            $response['error'] = 0;
            $response['html'] = $this->fetch("explore");
        }else
            $response['error'] = 1;
        $this->ajaxReturn($response,'json');
   }
}