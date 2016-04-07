heysoo.config(['$stateProvider',function($stateProvider){
	$stateProvider.state('edit',{
        url:'/edit/:type/:action',
        views:{
            'content':{templateUrl:tpl_essay_url+"/edit.html"}
        },
        resolve:{
            deps: ['$ocLazyLoad',function($ocLazyLoad){
                return $ocLazyLoad.load([public_path+'/js/angular/controller/publish.js']);
            }]
        }
    }).state('essay',{
        url:'/essay/page/:page',
        views:{
            'content':{templateUrl:tpl_essay_url+"/index.html"}
        },
        resolve:{
            deps: ['$ocLazyLoad',function($ocLazyLoad){
                return $ocLazyLoad.load([public_path+'/js/angular/controller/essay.js']);
            }]
        }
    }).state('view',{
        url:'/view/:id',
        params:{id:null},
        controller:'c_view',
        views:{
            'content':{templateUrl:tpl_essay_url+"/view.html"}
        },
        resolve:{
            deps: ['$ocLazyLoad',function($ocLazyLoad){
                return $ocLazyLoad.load([public_path+'/js/angular/controller/essay.js']);
            }]
        }
    }).state('setting_profile_userName',{
        url:'/modifyUserName',
        //parent:'setting',
        views:{
            'mask':{templateUrl:tpl_action_url+"/setting/modifyUserName.html"}
        }
    }).state('modify',{
        url:'/edit/:type/:action/:id',
        views:{
            'content':{templateUrl:tpl_essay_url+"/edit.html"}
        },
        resolve:{
            deps: ['$ocLazyLoad',function($ocLazyLoad){
                return $ocLazyLoad.load([public_path+'/js/angular/controller/publish.js']);
            }]
        }
    });
}]);