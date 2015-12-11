heysoo.config(['$stateProvider',function($stateProvider){
	$stateProvider.state('search',{
        url:'/search',
        views:{
            'content':{templateUrl:tpl_search_url+"/search.html"}
        }
    });
}]);