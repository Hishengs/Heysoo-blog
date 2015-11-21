//用户相关的服务
heysoo.service('User',function($http){
	//获取用户相关配置项
	this.getUserConfig = function(){
		return $http({
			method:'GET',
			url:home_path+"/User/ng_get_user_config.html"
		});
	}
});