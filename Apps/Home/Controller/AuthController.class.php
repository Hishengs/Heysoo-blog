<?php
namespace Home\Controller;
use Think\Controller;
use Org\Util\DBUtil;
use Org\Util\ObjectArray;
/**
 * 鉴权相关的操作
 * Author:Hisheng
 * Last modify date:2016/04/29
 */
class AuthController extends Controller {
	private $visible_tag_model;
	
    function __construct(){
        parent::__construct();
        //if(empty($_SESSION['USER_ID']))exit(C('SITE_LANG.LOGIN_ALERT'));//check login
        $this->visible_tag_model = D('VisibleTag');
    }
    public function index(){
    	echo "Hello,".C('SITE_LANG.SITE_NAME');
    }
    //检查文章可见性权限，过滤不可见的文章
    public function filter_invisible_essay($essays){
        $visible_essays = [];
        $auth_essays = [];
        //将所有的公开文章和自己的文章筛选出来推入可见文章数组，剩下的推入待鉴权数组，记住要保持原先数组顺序
        foreach ($essays as $key => $value) {
            if($value['visible'] == 1 || (!empty($_SESSION['USER_ID']) && $value['user_id'] == $_SESSION['USER_ID'])){
                $value['hs_seq'] = $key;//添加一个顺序字段，保持原先数组顺序
                array_push($visible_essays, $value);
            }
            else if($value['visible'] > 1){//大于1的都是选择可见或则选择不可见的
                $value['hs_seq'] = $key;
                array_push($auth_essays, $value);
            }
        }
        if(!empty($_SESSION['USER_ID']) && count($auth_essays)){//如果当前用户已经登陆
            //将鉴权数组中当前用户无权可见的文章筛选掉
            foreach ($auth_essays as $essay) {
                //$visible_tags = explode(',', $essay['visible_tag']);//可见性标签id数组
                $visible_tags = $essay['visible_tag'];
                //获取对该文章可见的用户id数组
                $visible_user_ids = $this->visible_tag_model->where(array('id'=>array('in',$visible_tags)))->getField('friends',true);
                $visible_user_ids = $visible_user_ids?implode(',', $visible_user_ids):'';
                $visible_user_ids = !empty($visible_user_ids)?explode(',', $visible_user_ids):[];
                //$this->ajaxReturn(array('error'=>0,'visible_user_ids'=>$visible_user_ids,'user_id'=>$_SESSION['USER_ID']),'json');
                //$this->ajaxReturn(array('error'=>0,'in'=>in_array($_SESSION['USER_ID'], $visible_user_ids)?'yes':'no'),'json');
                //$this->ajaxReturn(array('error'=>0,'essay'=>$essay),'json');
                if(in_array($_SESSION['USER_ID'], $visible_user_ids))array_push($visible_essays, $essay);//如果当前用户id存在可见用户id数组
            }
        }
        //重新排序
        $visible_essays = ObjectArray::sortByField($visible_essays,'hs_seq');
        return $visible_essays;
    }
    //检查碎片可见性权限，过滤不可见的碎片
    public function filter_invisible_piece($pieces){
        $visible_pieces = [];
        $auth_pieces = [];
        //将所有的公开碎片和自己的碎片筛选出来推入可见碎片数组，剩下的推入待鉴权数组，记住要保持原先数组顺序
        foreach ($pieces as $key => $value) {
            if($value['visible'] == 1 || (!empty($_SESSION['USER_ID']) && $value['user_id'] == $_SESSION['USER_ID'])){
                $value['hs_seq'] = $key;//添加一个顺序字段，保持原先数组顺序
                array_push($visible_pieces, $value);
            }
            else if($value['visible'] > 1){//大于1的都是选择可见或则选择不可见的
                $value['hs_seq'] = $key;
                array_push($auth_pieces, $value);
            }
        }
        if(!empty($_SESSION['USER_ID']) && count($auth_pieces)){//如果当前用户已经登陆
            //将鉴权数组中当前用户无权可见的碎片筛选掉
            foreach ($auth_pieces as $piece) {
                $visible_tags = $piece['visible_tag'];
                //获取对该碎片可见的用户id数组
                $visible_user_ids = $this->visible_tag_model->where(array('id'=>array('in',$visible_tags)))->getField('friends',true);
                $visible_user_ids = $visible_user_ids?implode(',', $visible_user_ids):'';
                $visible_user_ids = !empty($visible_user_ids)?explode(',', $visible_user_ids):[];
                if(in_array($_SESSION['USER_ID'], $visible_user_ids))array_push($visible_pieces, $piece);//如果当前用户id存在可见用户id数组
            }
        }
        //重新排序
        $visible_pieces = ObjectArray::sortByField($visible_pieces,'hs_seq');
        return $visible_pieces;
    }
}