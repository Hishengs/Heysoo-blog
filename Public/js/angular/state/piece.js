heysoo.config(['$stateProvider',function($stateProvider){
	$stateProvider.state('piece',{
        url:'/piece/page/:page',
        views:{
            'content':{templateUrl:tpl_piece_url+"/index.html"}
        }/*,
        resolve:{
            deps: ['$ocLazyLoad',function($ocLazyLoad){
                return $ocLazyLoad.load([public_path+'/js/angular/controller/piece.js']);
            }]
        }*/
    }).state('comment',{
        url:'/comment/:id',
        views:{
            'mask':{templateUrl:tpl_piece_url+"/comment.html"}
        }
    });
}]);