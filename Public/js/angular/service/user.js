//用户相关的服务
heysoo.service('User',['$http',function($http){
	//获取用户相关配置项
	this.getUserConfig = function(){
		return $http({
			method:'GET',
			url:home_path+"/User/ng_get_user_config.html"
		});
	}
	//获取用户基本信息
	this.getUserInfo = function(user_id){
		return $http({
			method:'GET',
			url:home_path+"/User/ng_get_user_info.html?user_id="+user_id
		});
	}
	//获取关注信息
	this.getFollowInfo = function(user_id){
		return $http({
			method:'GET',
			url:home_path+"/User/get_follow_info.html?user_id="+user_id
		});
	}
	//添加关注
	this.addFollow = function(user_id){
		return $http({
			method:'GET',
			url:home_path+"/User/follow.html?action=add&user_id="+user_id
		});
	}
	//取消关注
	this.disFollow = function(user_id){
		return $http({
			method:'GET',
			url:home_path+"/User/follow.html?action=dis&user_id="+user_id
		});
	}
	//获取碎片
	this.getPieces = function(user_id,page){
		return $http({
			method:'POST',
			url:home_path+"/User/get_pieces.html",
			data:{'user_id':user_id,'page':page}
		});
	}
	//获取文章
	this.getEssays = function(user_id,page){
		return $http({
			method:'POST',
			url:home_path+"/User/get_essays.html",
			data:{'user_id':user_id,'page':page}
		});
	}
}]);