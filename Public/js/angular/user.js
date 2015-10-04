var m_user = angular.module('User',['infinite-scroll','ui.router']);
/*Controller*/
var follow = 0;
m_user.controller('c_user',function($scope,$state,$http){
	$scope.follow_btn_html = '<i class="hs-icon-eye"></i> 关注他';
	$scope.userName = $("div.userName").html();
	//查询是否已关注
	var url = home_path+"/User/has_followed.html?userName="+$scope.userName;
	$http.get(url).success(function(res){
		if(res.has_followed === 1){follow = 1;$scope.follow_btn_html = '<i class="hs-icon-eye"></i> 取消关注';}
	});
	//关注
	$scope.follow = function(userName){
		if(follow === 1)follow=0;
		else follow=1;
		var url = home_path+"/User/follow.html?userName="+userName+"&action="+follow;
		$http.get(url).success(function(res){
	        if(res.error === 0){
	        	if(follow === 1){hMessage('关注成功！');$scope.follow_btn_html = '<i class="hs-icon-eye"></i> 取消关注';}
	        	else {hMessage('取消关注成功！');$scope.follow_btn_html = '<i class="hs-icon-eye"></i> 关注他';}
	        }
	        else{
	        	console.log(res);
	        	if(follow === 1)hMessage('关注失败！');
	        	else hMessage('取消关注失败！');
	        }
	    });
	}
	//取消关注
});
/*Filter*/
m_user.filter('trustHtml', function ($sce) {
        return function (input) {
            return $sce.trustAsHtml(input);
        }
});