heysoo.config(['$stateProvider',function($stateProvider){
	$stateProvider.state('follow',{
        url:'/follow',
        views:{
            'content':{templateUrl:tpl_follow_url+"/follow.html"}
        },
        resolve:{
            deps: ['$ocLazyLoad',function($ocLazyLoad){
                return $ocLazyLoad.load([public_path+'/js/angular/controller/follow.js']);
            }]
        }
    }).state('follow_followed',{
        url:'/followed',
        parent:'follow',
        views:{
            'follow':{templateUrl:tpl_follow_url+"/followed.html"}
        }
    }).state('follow_following',{
        url:'/following',
        parent:'follow',
        views:{
            'follow':{templateUrl:tpl_follow_url+"/following.html"}
        }
    });
}]);