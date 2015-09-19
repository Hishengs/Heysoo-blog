<?php
namespace Home\Controller;
use Think\Controller;
class AuthController extends Controller {
    private $user_model;

    function __construct(){
            parent::__construct();
            $this->user_model = D('User');
    }
    
    public function index(){
        echo 'Hello,Heysoo!';
    }
    //check if user is logined 
    public function is_login(){
        if(isset($_SESSION['USER_ID']))return true;
        else return false;
    }
}
?>