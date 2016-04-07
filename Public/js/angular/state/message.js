heysoo.config(['$stateProvider',function($stateProvider){
	$stateProvider.state('message',{
        url:'/message',
        views:{
            'content':{templateUrl:tpl_message_url+"/message.html"}
        },
        resolve:{
            deps: ['$ocLazyLoad',function($ocLazyLoad){
                return $ocLazyLoad.load([public_path+'/js/angular/controller/message.js']);
            }]
        }
    }).state('msg_comment',{
        url:'/comment',
        parent:'message',
        views:{
            'message':{templateUrl:tpl_message_url+"/comment.html"}
        },
        resolve:{
            deps: ['$ocLazyLoad',function($ocLazyLoad){
                return $ocLazyLoad.load([public_path+'/js/angular/controller/message.js']);
            }]
        }
    }).state('msg_at',{
        url:'/at',
        parent:'message',
        views:{
            'message':{templateUrl:tpl_message_url+"/at.html"}
        }
    }).state('msg_whisper',{
        url:'/whisper',
        parent:'message',
        views:{
            'message':{templateUrl:tpl_message_url+"/whisper.html"}
        }
    }).state('msg_notice',{
        url:'/notice',
        parent:'message',
        views:{
            'message':{templateUrl:tpl_message_url+"/notice.html"}
        }
    });
}]);