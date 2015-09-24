<?php
namespace Home\Controller;
use Think\Controller;
use Org\Qiniu;
class ActionController extends Controller {
	
    private $user_model;
    //构造函数
    function __construct(){
        parent::__construct();
        $this->user_model = D('User');
        $this->user_config_model = D('UserConfig');
    }

    public function index(){
      //
    }
    //判断是否登录
    private function isLogined(){
        return $_SESSION['LOGIN_STATUS'];
    }
    public function login() {
        C('LAYOUT_ON',FALSE);//关闭模板布局
        $this->assign('verify_code_on',C('LOGIN_VERIFY_CODE_ON'));//是否开启验证码
        $this->display(":login");
    }
    //处理登录请求
    public function do_login(){
        if(IS_POST){
            $userName = I('post.userName');
            if(empty($userName))$this->error('用户名不能为空');
            $passwd = I('post.passwd');
            if(empty($passwd))$this->error('密码不能为空');
            if(C('LOGIN_VERIFY_CODE_ON')){//开启验证码验证
              $verify_code = I('post.verify_code');
              if(empty($verify_code))$this->error('验证码不能为空！');
              if(!$this->check_verify_code($verify_code))$this->error('验证码错误！');
            }
            $cdt['userName'] = $userName;
            $result = $this->user_model->where($cdt)->find();
            if(!empty($result)){
                //对密码混淆加密
                $salt = $result['salt'];
                $crypt_times = $result['crypt_times'];//加密次数
                for($i=0;$i<$crypt_times;$i++){
                  $passwd = md5($passwd.$salt);
                }
                if($result['passwd'] == $passwd){
                    //记录登录信息
                    date_default_timezone_set("Asia/Hong_Kong");
                    $user_ip = $this->get_user_ip();
                    $data = array('ip'=>$user_ip,'city'=>$this->get_user_city($user_ip),'last_login_date'=>date('Y-m-d H:i:s'),'is_login'=>1);
                    $cdt = array('userName'=>$userName);
                    $this->user_model->where($cdt)->save($data);
                    $_SESSION['USER_NAME'] = $userName;
                    $_SESSION['LOGIN_STATUS'] = true;
                    $_SESSION['USER_ID'] = $result['id'];
                    setcookie("userName",$result['userName'],time()+30*24*3600,"/");
                    C('LAYOUT_ON',TRUE);
                    $this->success('登录成功！',U('Index/index'));
                }else $this->error('密码错误！');
            }else $this->error('用户名不存在！');
        }
    }
    public function register() {
        C('LAYOUT_ON',FALSE);//关闭模板布局
        $this->assign('register_verify_code_on',C('REGISTER_VERIFY_CODE_ON'))->assign('register_invite_code_on',C('REGISTER_INVITE_CODE_ON'));
        $this->display(":register");
    }
    //处理注册请求
    public function do_register(){
        if(C('REGISTER_VERIFY_CODE_ON')){//开启验证码验证
            $verify_code = I('post.verify_code');
            if(empty($verify_code))$this->error('验证码不能为空！');
            if(!$this->check_verify_code($verify_code))$this->error('验证码错误！');
        }
        $userName = I('post.userName');
        $str_length = $this->str_length($userName);
        if($str_length['total'] >15 || $str_length['ch']>0)$this->error('请检查你的用户名格式，只能使用中文，英文和数字的组合且不能超过15个字符！');
        $passwd = I('post.passwd');
        $email = I('post.email');
        if(!empty($userName) && !empty($passwd) && !empty($email)){
          //判断用户是否存在
          $cdt['userName'] = $userName;
          if($this->user_model->where($cdt)->find() != false)$this->error('用户已存在，请直接登录！');
          else{
            //判断邮箱格式
            if(!$this->check_email($email))$this->error('邮箱格式不正确！');
            //判断密码格式，位数等
            if(strlen($passwd) < 6)$this->error('请设置至少6位的密码！');
            //判断邮箱存在否
            $cdt = array('email'=>$email);
            if($this->user_model->where($cdt)->find() != false)$this->error('该邮箱已注册过，请直接登录！');
            //对密码混淆加密
            $salt = $this->get_random_str(6);
            $crypt_times = rand(1,10);//加密次数
            for($i=0;$i<$crypt_times;$i++){
              $passwd = md5($passwd.$salt);
            }
            $register_date = date('Y-m-d H:i:s');
            $data = array('userName'=>$userName,'passwd'=>$passwd,'email'=>$email,'salt'=>$salt,'crypt_times'=>$crypt_times,'register_date'=>$register_date);
            $res = $this->user_model->data($data)->add();
            if($res !== false){
              //同时创建配置
              $user_config_data = array('user_id'=>$res);
              $this->user_config_model->add($user_config_data);
              $this->success('注册成功！',U('Action/login'));
            }
            else $this->error('注册失败，请稍后重试！');
          }
        }else $this->error('请填写完整的注册信息！');

    }
    //获取指定位数随机字符串
    function get_random_str($bit){
        $str="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        $key = "";
        for($i=0;$i<$bit;$i++)
         {
             $key .= $str{mt_rand(0,32)};    
         }
         return $key;
    }
    //注销
    function logout(){
      $user_id = $_SESSION['USER_ID'];
        unset($_SESSION['USER_NAME']);
        unset($_SESSION['USER_ID']);
        $_SESSION['LOGIN_STATUS'] = false;
       /* $data['is_login'] = 0;
        $this->user_model->where('id='.$user_id)->save($data);*/
        $this->success('注销成功！',U("Action/login"),2);
    }
    //生成验证码
    public function create_verify_code(){
        $cdt = array('length'=>4,'fontSize'=>16,'imageH'=>40,'imageW'=>240,'useZh'=>true,'fontttf'=>'lthj.ttf');
        $verify = new \Think\Verify($cdt);
        $verify->entry();
    }
    //验证验证码
    public function check_verify_code($code){
        $verify = new \Think\Verify();
        return $verify->check($code);
    }
    //验证邮箱格式
    public function check_email($email){
      $patten="/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/";
      if(preg_match($patten,$email))return true;
      else return false;
    }
    //验证用户名格式
    public function check_username(){
      //
    }
    //计算中文，英文字符个数
    public function str_length($str){
      preg_match_all("/[0-9]{1}/",$str,$num);  
      preg_match_all("/[a-zA-Z]{1}/",$str,$en);  
      $length = strlen(preg_replace('/[\x00-\x7F]/', '', $str));
      $zh = intval($length / 3);
      $en = count($en[0]);
      $num = count($num[0]);
      $total = strlen($str);
      $ch = $total - ($zh*3 + $en + $num);
      $total = $zh + $en + $num + $ch;
      return array('total'=>$total,'zh'=>$zh,'en'=>$en,'num'=>$num,'ch'=>$ch);
    }
    /*获取客户端IP*/
    public function get_user_ip(){
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
    /*根据IP判断所在城市*/
    public function get_user_city($ip = ''){
        if(empty($ip)){
            $ip = $this->get_user_ip();
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
        return $json['city'];
    }
    //获取编辑页面
    public function get_edit_page(){
      C('LAYOUT_ON',FALSE);//关闭模板布局
      $type = I("get.type");
      $page = NULL;
      switch ($type) {
        case 'essay':
          $page = A('Essay')->get_edit_page();
          break;
        
        default:
          $page = A('Essay')->get_edit_page();
          break;
      }
      $this->ajaxReturn($page,'json');
    }
    //获取七牛token
    public function get_qiniu_token(){
      if(isset($_SESSION['USER_ID'])){
        $callbackUrl = C('SITE_PREFIX').U("Action/qiniu_callback");//回调地址
        $param = array('scope'=>C('QINIU_BUCKET'),'deadline'=>3600+time(),'returnUrl'=>$callbackUrl);
        $auth = new \Think\Upload\Driver\Qiniu\QiniuStorage();
        $token = $auth->getToken(C('QINIU_SK'),C('QINIU_AK'),$param);
        $response = array('status'=>'success','token'=>$token);
        $this->ajaxReturn($response,'json');
       }else $this->error('请先登录后再操作！',U('Action/login'));
    }
    //七牛回调
    public function qiniu_callback(){
      $upload_ret = base64_decode($_GET['upload_ret']);
      $upload_ret = json_decode($upload_ret,true); //将json数据转换为数组

      if(!empty($upload_ret['key']))
        //echo json_encode(array('error'=>0,'url'=>'https://dn-lanbaidiao.qbox.me/'.$upload_ret['key']));
        $this->ajaxReturn(array('error'=>0,'url'=>'https://dn-lanbaidiao.qbox.me/'.$upload_ret['key']),'json');
      else
        //echo json_encode(array('error'=>1,'message'=>'图片上传出错！'));
        $this->ajaxReturn(array('error'=>1,'message'=>'图片上传出错！'),'json');
    }
    //处理文章，碎片，日记等的发布
    public function ng_deal_post(){
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
                A('Essay')->ng_essay_post($title,$tag,$content,$visible);
                break;
            case 'diary':
                A('Diary')->ng_diary_post($title,$tag,$content,$visible);
                break;
            default:
                $this->error('请求失败！');
                break;
        }
    }
    public function ng_modify(){
        $id = I('get.id');
        $type = I('get.type');
        switch ($type) {
            case 'piece':
                A('Piece')->get_piece($id);
                break;
            case 'essay':
                A('Essay')->get_essay($id);
                break;
            case 'diary':
                $this->ajaxReturn(array('error'=>1,'msg'=>'请求失败！'),'json');
                break;
            default:
                $this->ajaxReturn(array('error'=>1,'msg'=>'请求失败！'),'json');
                break;
        }
    }
    public function ng_deal_modify(){
        $id = I('post.id');
        $visible = I('post.visible');
        $title = I('post.title');
        $tag = I('post.tag');
        $content = I('post.content','','');
        $type = I('post.type');
        switch ($type) {
            case 'piece':
                A('Piece')->do_modify($id,$tag,$content,$visible);
                break;
            case 'essay':
                A('Essay')->do_modify($id,$title,$tag,$content,$visible);
                break;
            case 'diary':
                A('Diary')->do_modify($id,$title,$tag,$content,$visible);
                break;
            default:
                $this->error('请求失败！');
                break;
        }
    }
    //处理标签
    public function tag(){
      $tag = I('get.tag');
      $response = $this->fetch(":tag");
      $this->ajaxReturn($response,'json');
    }
    //删除操作
    public function ng_delete(){
      $type = I('get.type');
      $id = I('get.id');
      switch ($type) {
        case 'essay':
          A('Essay')->ng_delete($id);
          break;
        
        case 'diary':
          A('Diary')->delete($id);
          break;

        case 'piece':
          A('Piece')->ng_delete($id);
          break;

        default:
          $this->error('请求失败！');
          break;
      }
    }
    public function ng_paginator(){
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
          //
          break;
      }
    }
}