<?php 
namespace Home\Model;
use Think\Model;
class BaseModel extends Model {
    public function __construct($name='',$tablePrefix='',$connection='') {
        parent::__construct();
    }
    public function ofTimeBetween($start_time,$end_time,$fieldName='created_at')
    {
        if ($start_time && $end_time) {
            return $this->where('UNIX_TIMESTAMP('.$fieldName.') >= ' . $start_time)->where('UNIX_TIMESTAMP('.$fieldName.') <= ' . $end_time);
        } else if ($start_time && !$end_time) {
            return $this->where('UNIX_TIMESTAMP('.$fieldName.') >= ' . $start_time);
        } else if (!$start_time && $end_time) {
            return $this->where('UNIX_TIMESTAMP('.$fieldName.') <= ' . $end_time);
        } else {
            return $this;
        }
    }
    public function ofDateBetween($start_date,$end_date,$fieldName='created_at')
    {   
        //对时间进行转化
        $start_date = trim($start_date)?strtotime(date('Y-m-d',$start_date)):'';
        $end_date = trim($end_date)?strtotime(date('Y-m-d',$end_date))+86399:'';
        if ($start_date && $end_date) {
            return $this->where('UNIX_TIMESTAMP('.$fieldName.') >= ' . $start_date)->where('UNIX_TIMESTAMP('.$fieldName.') <= ' . $end_date);
        } else if ($start_date && !$end_date) {
            return $this->where('UNIX_TIMESTAMP('.$fieldName.') >= ' . $start_date);
        } else if (!$start_date && $end_date) {
            return $this->where('UNIX_TIMESTAMP('.$fieldName.') <= ' . $end_date);
        } else {
            return $this;
        }
    }
    public function ofDate($date,$fieldName='created_at')
    {   
        if(!empty(trim($date))){
            if(!strtotime($date)){//时间戳
                return $this->where("UNIX_TIMESTAMP(DATE_FORMAT(".$fieldName.",'%Y-%m-%d')) = ".$date);
            }
            else 
                return $this->where("DATE_FORMAT(".$fieldName.",'%Y-%m-%d') = ".date('Y-m-d',strtotime($date)));
        }else return $this;
    }
}
?>