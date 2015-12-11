heysoo.config(['$stateProvider',function($stateProvider){
	$stateProvider.state('user',{
        url:'/user/:user_id',
        views:{
            'content':{templateUrl:tpl_user_url+"/user.html"}
        }
    });
}]);