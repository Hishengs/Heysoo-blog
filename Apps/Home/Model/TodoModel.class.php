<?php 
namespace Home\Model;
use Home\Model\BaseModel;
class TodoModel extends BaseModel {
    public function __construct($name='',$tablePrefix='',$connection='') {
        parent::__construct();
    }
    public function ofUser($user_id){
    	if(!empty($user_id))return $this->where(array('user_id'=>$user_id));
    	else return $this;
    }
    public function ofAddress($addr){
    	if(!empty($addr))return $this->where(array('address'=>$addr));
    	else return $this;
    }
    public function ofAddressLike($addr){
    	if(!empty($addr))return $this->where(array('address'=>array('like','%'.$addr.'%')));
    	else return $this;
    }
    public function ofContentLike($content){
    	if(!empty($content))return $this->where(array('content'=>array('like','%'.$content.'%')));
    	else return $this;
    }
    public function ofUrgentLevel($urgent_level){
    	if(!empty($urgent_level))return $this->where(array('urgent_level'=>$urgent_level));
    	else return $this;
    }
    public function ofDeadline($deadline){
    	if(!empty($deadline))return $this->ofDate($deadline,'deadline');
    	else return $this;
    }
    public function ofStatus($status){
    	if(strlen(trim($status)))return $this->where(array('status'=>$status));
    	else return $this;
    }
}
?>