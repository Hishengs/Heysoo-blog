//待办事项路由
heysoo.config(['$stateProvider',function($stateProvider){
	$stateProvider.state('todo',{
        url:'/todo',
        views:{
            'content':{templateUrl:tpl_todo_url+"/index.html"}
        },
        resolve:{
            deps: ['$ocLazyLoad',function($ocLazyLoad){
                document.title = '待办事项';
                return $ocLazyLoad.load([public_path+'/js/angular/controller/todo.js']);
            }]
        }
    });
}]);