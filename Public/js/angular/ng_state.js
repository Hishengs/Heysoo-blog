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

heysoo.config(['$stateProvider',function($stateProvider){
	$stateProvider.state('setting',{
        url:'/setting',
        views:{
            'content':{templateUrl:tpl_setting_url+"/setting.html"}
        },
        resolve:{
            deps: ['$ocLazyLoad',function($ocLazyLoad){
                return $ocLazyLoad.load([public_path+'/js/angular/controller/setting.js']);
            }]
        }
    }).state('setting_profile',{
        url:'/profile',
        parent:'setting',
        views:{
            'v_setting':{templateUrl:tpl_setting_url+"/profile.html"}
        }
    }).state('setting_interface',{
        url:'/interface',
        parent:'setting',
        views:{
            'v_setting':{templateUrl:tpl_setting_url+"/interface.html"}
        }
    }).state('setting_push',{
        url:'/push',
        parent:'setting',
        views:{
            'v_setting':{templateUrl:tpl_setting_url+"/push.html"}
        }
    }).state('setting_privacy',{
        url:'/privacy',
        parent:'setting',
        views:{
            'v_setting':{templateUrl:tpl_setting_url+"/privacy.html"}
        }
    });
}]);
heysoo.config(['$stateProvider',function($stateProvider){
	$stateProvider.state('tag',{
        url:'/tag',
        views:{
            'content':{templateUrl:tpl_tag_url+"/tag.html"}
        },
        resolve:{
            deps: ['$ocLazyLoad',function($ocLazyLoad){
                return $ocLazyLoad.load([public_path+'/js/angular/controller/tag.js']);
            }]
        }
    }).state('tag_essay',{
        url:'/essay',
        parent:'tag',
        views:{
            'tag':{templateUrl:tpl_tag_url+"/essay_tag.html"}
        }
    }).state('tag_piece',{
        url:'/piece',
        parent:'tag',
        views:{
            'tag':{templateUrl:tpl_tag_url+"/piece_tag.html"}
        }
    }).state('tag_friend',{
        url:'/friend',
        parent:'tag',
        views:{
            'tag':{templateUrl:tpl_tag_url+"/friend_tag.html"}
        }
    });
}]);
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
//待办事项路由
heysoo.config(['$stateProvider',function($stateProvider){
	$stateProvider.state('todo',{
        url:'/todo',
        views:{
            'content':{templateUrl:tpl_todo_url+"/index.html"}
        },
        resolve:{
            deps: ['$ocLazyLoad',function($ocLazyLoad){
                return $ocLazyLoad.load([public_path+'/js/angular/controller/todo.js']);
            }]
        }
    });
}]);