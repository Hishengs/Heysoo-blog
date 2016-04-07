heysoo.config(['$stateProvider',function($stateProvider){
	$stateProvider.state('user',{
        url:'/user/:user_id',
        views:{
            'content':{templateUrl:tpl_user_url+"/user.html"}
        },
        resolve:{
            deps: ['$ocLazyLoad',function($ocLazyLoad){
                return $ocLazyLoad.load([public_path+'/js/angular/controller/user.js']);
            }]
        }
    });
}]);