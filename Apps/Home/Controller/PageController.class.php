<?php
namespace Home\Controller;
use Think\Controller;
class PageController extends Controller {
	public function side_panel{
		C('LAYOUT_ON',FALSE);
		return $this->ajaxReturn($this->fetch(),'json');
	}
}