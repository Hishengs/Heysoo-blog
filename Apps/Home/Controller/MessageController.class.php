<?php
namespace Home\Controller;
use Think\Controller;
/**
 * deal message
 * Author:Hisheng
 * Last modify date:2015/09/28
 */
class MessageController extends Controller {
	private $msg_model;
	
    function __construct(){
        parent::__construct();
        if(empty($_SESSION['USER_ID']))exit(C('SITE_LANG.LOGIN_ALERT'));//check login
        $this->msg_model = D('Message');
    }
    public function index(){
    	echo "Hello,".C('SITE_LANG.SITE_NAME');
    }
    //push a message into database
    public function msg_push($msg_type='system',$msg_type_id=0,$msg_obj_type=null,$msg_obj_id=null,$msg_date,$msg_sender_id,
    	$msg_receiver_id,$msg_content,$msg_link=null){
    	$data = array('msg_type'=>$msg_type,'msg_type_id'=>$msg_type_id,'msg_obj_type'=>$msg_obj_type,
    		'msg_obj_id'=>$msg_obj_id,'msg_date'=>$msg_date,'msg_sender_id'=>$msg_sender_id,
    		'msg_receiver_id'=>$msg_receiver_id,'msg_content'=>$msg_content,
    		'msg_link'=>$msg_link);
    	if($this->msg_model->add($data) != false)return true;
    	else return false;
    }
    //pop a message 
    public function msg_pop($msg_id){
    	$res = $this->msg_model->where('msg_id='.$msg_id)->find();
    	if($res != false)$this->ajaxReturn(array('error'=>0,'data'=>$res),'json');
    	else $this->ajaxReturn(array('error'=>1,'msg'=>C('MSG_GET_FAILED')),'json');
    }
    //get messages list
    public function get_msg_list(){
    	$type = I('get.type')?I('get.type'):'comment';
    	$id = I('get.id')?I('get.id'):1;
    	$user_id = session('USER_ID');
              if($type == "notice")
    	   $cdt = array('msg_type'=>$type,'msg_type_id'=>$id);
              else $cdt = array('msg_receiver_id'=>$user_id,'msg_type'=>$type,'msg_type_id'=>$id);
    	$response = $this->msg_model->where($cdt)->order('msg_is_read asc,msg_date desc')->select();
    	if($response != false){
                            $this->set_msg_read();//将消息设置为已读
    		for($i=0;$i<count($response);$i++){
    			$senders[$i] = A('User')->get_name_by_id($response[$i]['msg_sender_id']);
    		}
    		$this->ajaxReturn(array('error'=>0,'items'=>$response,'senders'=>$senders),'json');
    	}
    	else $this->ajaxReturn(array('error'=>1,'msg'=>'消息获取失败','items'=>array()),'json');
    }
    //get unread message number
    public function get_unread_msg_num($user_id=null){
        $user_id = $user_id?$user_id:session('USER_ID');
        $cdt = array('msg_receiver_id'=>$user_id,'msg_is_read'=>0);
        $res = $this->msg_model->where($cdt)->count();
        if($res != false)return $res;
        else return;
    }
    public function ng_get_unread_msg_num(){
        $user_id = I('get.user_id');
        $unread_msg_num = $this->get_unread_msg_num($user_id);
        $this->ajaxReturn(array('unread_msg_num'=>$unread_msg_num));
    }
    //set message read
    public function set_msg_read($user_id=null){
        $user_id = $user_id?$user_id:session('USER_ID');
        $cdt = array('msg_receiver_id'=>$user_id,'msg_is_read'=>0);
        $data = array('msg_is_read'=>1);
        $res = $this->msg_model->where($cdt)->save($data);
        /*if($res != false)$this->ajaxReturn(array('error'=>0));
        else $this->ajaxReturn(array('error'=>1));*/
    }
}