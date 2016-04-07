heysoo.config(['$stateProvider',function($stateProvider){
	$stateProvider.state('home',{
        url:'/',
        controller:'c_piece',
        views:{
            'content':{templateUrl:tpl_index_url+"/index.html"}
        },
        resolve:{
            deps: ['$ocLazyLoad',function($ocLazyLoad){
                return $ocLazyLoad.load([public_path+'/js/angular/controller/piece.js']);
            }]
        }
    }).state('index',{
        url:'/index',
        controller:'c_piece',
        views:{
            'content':{templateUrl:tpl_index_url+"/index.html"}
        },
        resolve:{
            deps: ['$ocLazyLoad',function($ocLazyLoad){
                return $ocLazyLoad.load([public_path+'/js/angular/controller/piece.js']);
            }]
        }
    });
}]);