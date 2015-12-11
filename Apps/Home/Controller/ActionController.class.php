<?php
namespace Home\Controller;
use Think\Controller;
use Org\Qiniu;
/**
 * Deal with all action request
 * Author:Hisheng
 * Last modify date:2015/10/01
 */
class ActionController extends Controller {
	
    private $user_model;
    
    function __construct(){
        parent::__construct();
        //if(empty($_SESSION['USER_ID']))exit(C('SITE_LANG.LOGIN_ALERT'));//check login
        $this->user_model = D('User');
        $this->user_config_model = D('UserConfig');
    }

    public function index(){
      echo "Hello,".C('SITE_LANG.SITE_NAME');
    }
    //check if user has logined
    private function isLogined(){
        return $_SESSION['LOGIN_STATUS'];
    }
    //show login page
    public function login() {
        C('LAYOUT_ON',FALSE);//close layout
        $this->assign('verify_code_on',C('LOGIN_VERIFY_CODE_ON'))->assign('slogan',C('SLOGAN')[rand(0,count(C('SLOGAN'))-1)]);
        $this->display(":login");
    }
    //deal login request
    public function do_login(){
        if(IS_POST){
            $email = I('post.email');
            if(empty($email))$this->error(C('SITE_LANG.USER_NAME_EMPTY_TIP'));
            $passwd = I('post.passwd');
            if(empty($passwd))$this->error(C('SITE_LANG.USER_PASSWD_EMPTY_TIP'));
            if(C('LOGIN_VERIFY_CODE_ON')){//whether open login verify code
              $verify_code = I('post.verify_code');
              if(empty($verify_code))$this->error(C('SITE_LANG.VERIFY_CODE_EMPTY_TIP'));
              if(!$this->_check_verify_code($verify_code))$this->error(C('SITE_LANG.VERIFY_CODE_ERROR'));
            }
            $cdt['email'] = $email;
            $result = $this->user_model->where($cdt)->find();
            if(!empty($result)){
                //password encryption
                $salt = $result['salt'];
                $encrypt_times = $result['encrypt_times'];//encrypt times
                for($i=0;$i<$encrypt_times;$i++){
                  $passwd = md5($passwd.$salt);
                }
                if($result['passwd'] == $passwd){
                    //keep a record of user info
                    date_default_timezone_set("Asia/Hong_Kong");
                    $user_ip = $this->_get_user_ip();
                    $data = array('ip'=>$user_ip,'city'=>$this->_get_user_city($user_ip),'last_login_date'=>date('Y-m-d H:i:s'),'is_login'=>1);
                    $cdt = array('userName'=>$result['username']);
                    $this->user_model->where($cdt)->save($data);
                    $_SESSION['USER_NAME'] = $result['username'];
                    $_SESSION['LOGIN_STATUS'] = true;
                    $_SESSION['USER_ID'] = $result['id'];
                    setcookie("userName",$result['username'],time()+30*24*3600,"/");
                    C('LAYOUT_ON',TRUE);
                    //$this->success(C('SITE_LANG.LOGIN_SUCCESS_TIP'),U('Index/index'));
                    redirect(U('Index/index'));
                }else $this->error(C('SITE_LANG.USER_PASSWD_ERROR'));
            }else $this->error(C('SITE_LANG.USER_NOT_EXIST'));
        }
    }
    //show register page
    public function register() {
        C('LAYOUT_ON',FALSE);//close layout
        $this->assign('register_verify_code_on',C('REGISTER_VERIFY_CODE_ON'))->assign('register_invite_code_on',C('REGISTER_INVITE_CODE_ON'))->assign('slogan',C('SLOGAN')[rand(0,count(C('SLOGAN'))-1)]);
        $this->display(":register");
    }
    //deal register request
    public function do_register(){
        if(C('REGISTER_VERIFY_CODE_ON')){//check if register verify code open
            $verify_code = I('post.verify_code');
            if(empty($verify_code))$this->error(C('SITE_LANG.VERIFY_CODE_EMPTY_TIP'));
            if(!$this->_check_verify_code($verify_code))$this->error(C('SITE_LANG.VERIFY_CODE_ERROR'));
        }
        $userName = I('post.userName');
        $str_length = $this->str_length($userName);//count username length
        if($str_length['total_strs'] >15)$this->error(C('SITE_LANG.USER_NAME_FORMAT_ERROR'));
        $passwd = I('post.passwd');
        $email = I('post.email');
        if(!empty($userName) && !empty($passwd) && !empty($email)){
          //check if username is existed
          $cdt['userName'] = $userName;
          if($this->user_model->where($cdt)->find() != false)$this->error(C('SITE_LANG.USER_NAME_EXISTED'));
          else{
            //check email format
            if(!$this->check_email($email))$this->error(C('SITE_LANG.EMAIL_FORMAT_ERROR'));
            //check password format and length
            if(strlen($passwd) < 6)$this->error(C('SITE_LANG.USER_PASSWD_LENGTH_ERROR'));
            //check if email is existed
            $cdt = array('email'=>$email);
            if($this->user_model->where($cdt)->find() != false)$this->error(C('SITE_LANG.EMAIL_EXISTED'));
            //check if invite code open
            if(C('REGISTER_INVITE_CODE_ON')){
              $invite_code = I('post.invite_code');
              if(!empty($invite_code)){
                $cdt = array();
                $cdt['invite_code'] = $invite_code; 
                $res = $this->user_model->where($cdt)->field('id')->find();
                if($res){
                  $this->update_invite_code($res['id']);//update invite code
                }else $this->error(C('SITE_LANG.INVITE_CODE_ERROR'));
              }else $this->error(C('SITE_LANG.INVITE_CODE_EMPTY'));
            }
            //password encryption
            $salt = $this->get_random_str(6);
            $encrypt_times = rand(1,10);//encrypy times
            for($i=0;$i<$encrypt_times;$i++){
              $passwd = md5($passwd.$salt);
            }
            $register_date = date('Y-m-d H:i:s');
            $data = array('userName'=>$userName,'passwd'=>$passwd,'email'=>$email,'salt'=>$salt,'encrypt_times'=>$encrypt_times,'register_date'=>$register_date);
            $res = $this->user_model->data($data)->add();
            if($res !== false){
              //create user configuration at the same time
              $user_config_data = array('user_id'=>$res);
              $this->user_config_model->add($user_config_data);
              $this->success(C('SITE_LANG.REGISTER_SUCCESS'),U('Action/login'));
            }
            else $this->error(C('SITE_LANG.REGISTER_FAILED'));
          }
        }else $this->error(C('SITE_LANG.REGISTER_FORM_NOT_COMPLETE'));

    }
    //get random str of $bit bits
    public function get_random_str($bit){
        $str="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        $key = "";
        for($i=0;$i<$bit;$i++)
          $key .= $str{mt_rand(0,32)};    
        return $key;
    }
    //deal logout
    public function logout(){
        unset($_SESSION['USER_NAME']);
        unset($_SESSION['USER_ID']);
        $_SESSION['LOGIN_STATUS'] = false;
        //$this->success(C('SITE_LANG.LOGOUT_SUCCESS'),U("Action/login"),2);
        redirect(U("Action/login"));
    }
    //create verify code
    public function create_verify_code(){
        $cdt = array('length'=>4,'fontSize'=>16,'imageH'=>40,'imageW'=>240,'useZh'=>true,'fontttf'=>'lthj.ttf');
        $verify = new \Think\Verify($cdt);
        $verify->entry();
    }
    //check verify code
    private function _check_verify_code($code){
        $verify = new \Think\Verify();
        return $verify->check($code);
    }
    //check email format
    public function check_email($email){
      $patten="/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/";
      if(preg_match($patten,$email))return true;
      else return false;
    }
    //check username format
    public function check_username(){
      //
    }
    //count str length,include english,chinese,number,punctuation str length,etc
    public function str_length($str){
      $str = strip_tags(preg_replace("@\s@is",'',$str));//remove spacing,newline and html tags
      $str = str_replace('&nbsp;', '', $str);//remove 'spacing' of html
      preg_match_all("/[0-9]{1}/",$str,$num);  
      preg_match_all("/[a-zA-Z]{1}/",$str,$en);  
      $length = strlen(preg_replace('/[\x00-\x7F]/', '', $str));
      $cn = intval($length / 3);//length of Chinese str
      $en = count($en[0]);//length of English str
      $num = count($num[0]);//length of number
      $total_bytes = strlen($str);//total bytes
      $en_punctuation = $total_bytes - ($cn*3 + $en + $num);//the other un-Chinese punctuation str
      $total_strs = $cn + $en + $num + $en_punctuation;//total str
      return array('total_bytes'=>$total_bytes,'total_strs'=>$total_strs,'cn'=>$cn,'en'=>$en,'num'=>$num,'en_punctuation'=>$en_punctuation);
    }
    /*get client ip*/
    private function _get_user_ip(){
      global $ip;
      if (getenv("HTTP_CLIENT_IP"))
      $ip = getenv("HTTP_CLIENT_IP");
      else if(getenv("HTTP_X_FORWARDED_FOR"))
      $ip = getenv("HTTP_X_FORWARDED_FOR");
      else if(getenv("REMOTE_ADDR"))
      $ip = getenv("REMOTE_ADDR");
      else $ip = "0.0.0.0";
      return $ip;
    }
    /*get user city by ip*/
    private function _get_user_city($ip = ''){
        /*if(empty($ip)){
            $ip = $this->_get_user_ip();
        }
        $res = @file_get_contents('http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js&ip=' . $ip);
        if(empty($res)){ return false; }
        $jsonMatches = array();
        preg_match('#\{.+?\}#', $res, $jsonMatches);
        if(!isset($jsonMatches[0])){ return false; }
        $json = json_decode($jsonMatches[0], true);
        if(isset($json['ret']) && $json['ret'] == 1){
            $json['ip'] = $ip;
            unset($json['ret']);
        }else{
            return false;
        }
        return $json['city'];*/
        $ip_info =  $this->_get_location_info();
        return $ip_info['content']['address'];
    }
    //get Qiniu token
    public function get_qiniu_token(){
      if(empty($_SESSION['USER_ID']))exit(C('SITE_LANG.LOGIN_ALERT'));//check login
      if(isset($_SESSION['USER_ID'])){
        $upload_type = I('get.upload_type');
        $upload_type = $upload_type?$upload_type:'essay';
        $saveKey = $upload_type.'_'.$_SESSION['USER_ID'].'_'.md5(date("Y-m-d H:i:s").C('SITE_PREFIX'));
        $callbackUrl = C('SITE_PREFIX').U("Action/qiniu_callback");//callback url
        $param = array('scope'=>C('QINIU_BUCKET'),'deadline'=>3600+time(),'returnUrl'=>$callbackUrl,'saveKey'=>$saveKey);
        $auth = new \Think\Upload\Driver\Qiniu\QiniuStorage();
        $token = $auth->getToken(C('QINIU_SK'),C('QINIU_AK'),$param);
        $response = array('status'=>'success','token'=>$token);
        $this->ajaxReturn($response,'json');
       }else $this->error(C('SITE_LANG.LOGIN_ALERT'),U('Action/login'));
    }
    //deal callback of Qiniu
    public function qiniu_callback(){
      if(empty($_SESSION['USER_ID']))exit(C('SITE_LANG.LOGIN_ALERT'));//check login
      $upload_ret = base64_decode($_GET['upload_ret']);
      $upload_ret = json_decode($upload_ret,true); //tranform json to array
      if(!empty($upload_ret['key']))
        $this->ajaxReturn(array('error'=>0,'url'=>'https://dn-lanbaidiao.qbox.me/'.$upload_ret['key']),'json');
      else
        $this->ajaxReturn(array('error'=>1,'message'=>C('SITE_LANG.IMAGE_UPLOAD_ERROR')),'json');
    }
    //deal piece,essay,diary post request
    public function ng_deal_post(){
        if(empty($_SESSION['USER_ID']))exit(C('SITE_LANG.LOGIN_ALERT'));//check login
        $visible = I('post.visible');
        $title = I('post.title');
        $tag = I('post.tag');
        $content = I('post.content','','');
        $type = I('post.type');
        switch ($type) {
            case 'piece':
                A('Piece')->ng_piece_post($tag,$content,$visible);
                break;
            case 'essay':
                $post_piece = I('post.post_piece');
                A('Essay')->ng_essay_post($title,$tag,$content,$visible,$post_piece);
                break;
            case 'diary':
                A('Diary')->ng_diary_post($title,$tag,$content,$visible);
                break;
            default:
                $this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.REQUEST_FAILED')),'json');
                break;
        }
    }
    //deal piece,essay,diary modify request
    public function ng_modify(){
        $id = I('get.id');
        $type = I('get.type');
        switch ($type) {
            case 'piece':
                $this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.REQUEST_FAILED')),'json');
                break;
            case 'essay':
                A('Essay')->get_essay($id);
                break;
            case 'diary':
                $this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.REQUEST_FAILED')),'json');
                break;
            default:
                $this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.REQUEST_FAILED')),'json');
                break;
        }
    }
    public function ng_deal_modify(){
        if(empty($_SESSION['USER_ID']))exit(C('SITE_LANG.LOGIN_ALERT'));//check login
        $id = I('post.id');
        $visible = I('post.visible');
        $title = I('post.title');
        $tag = I('post.tag');
        $content = I('post.content','','');
        $type = I('post.type');
        switch ($type) {
            case 'piece':
                $this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.REQUEST_FAILED')),'json');
                break;
            case 'essay':
                $post_piece = I('post.post_piece');
                A('Essay')->do_modify($id,$title,$tag,$content,$visible,$post_piece);
                break;
            case 'diary':
                $this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.REQUEST_FAILED')),'json');
                break;
            default:
                $this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.REQUEST_FAILED')),'json');
                break;
        }
    }
    //deal piece,essay,diary delete
    public function ng_delete(){
        if(empty($_SESSION['USER_ID']))exit(C('SITE_LANG.LOGIN_ALERT'));//check login
        $type = I('get.type');
        $id = I('get.id');
        switch ($type) {
          case 'essay':
            A('Essay')->ng_delete($id);
            break;
          case 'diary':
            $this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.REQUEST_FAILED')),'json');
            break;
          case 'piece':
            A('Piece')->ng_delete($id);
            break;
          default:
            $this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.REQUEST_FAILED')),'json');
            break;
        }
    }
    //deal page pagination
    public function ng_paginator(){
      if(empty($_SESSION['USER_ID']))exit(C('SITE_LANG.LOGIN_ALERT'));//check login
      $type = I('get.type');
      $page = I('get.page');
      switch ($type) {
        case 'piece':
          A('Piece')->ng_get_piece_page($page);
          break;
        case 'essay':
          A('Essay')->ng_get_essay_page($page);
          break;
        default:
          $this->ajaxReturn(array('error'=>1,'msg'=>C('SITE_LANG.REQUEST_FAILED')),'json');
          break;
      }
    }
    private function _get_location_info(){
      $ak = C('BAIDU_MAP_API_AK');
      $ip = $this->_get_user_ip();
      $url = "http://api.map.baidu.com/location/ip?ak=".$ak."&ip=".$ip;
      $res = @file_get_contents($url);
      $res = json_decode($res,true);
      return $res;
    }
    //update user invite code
    public function update_invite_code($user_id){
        $invite_code = $this->get_random_str(6);
        $cdt['invite_code'] = $invite_code;
        //make sure invite code is unique
        while($this->user_model->where($cdt)->find()){
            $invite_code = $this->get_random_str(6);
            $cdt['invite_code'] = $invite_code;
        }
        $data = array('invite_code'=>$invite_code);
        if($this->user_model->where('id='.$user_id)->save($data) !== false)
            return true;
        else return false;
    }    
}