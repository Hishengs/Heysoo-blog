heysoo.config(['$stateProvider',function($stateProvider){
	$stateProvider.state('search',{
        url:'/search',
        views:{
            'content':{templateUrl:tpl_search_url+"/search.html"}
        },
        resolve:{
            deps: ['$ocLazyLoad',function($ocLazyLoad){
                return $ocLazyLoad.load([public_path+'/js/angular/controller/search.js']);
            }]
        }
    });
}]);