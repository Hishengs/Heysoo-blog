<?php
namespace Home\Controller;
use Think\Controller;
/**
 * Base Controller
 * Author:Hisheng
 * Last modify date:2016/04/29
 */
class BaseController extends Controller {
	
    function __construct(){
        parent::__construct();
        //check auth
    }
}