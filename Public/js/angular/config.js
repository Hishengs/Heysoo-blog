/*angular config*/
/*Config*/
var tpl_piece_url = public_path+'/templates/Piece';
var tpl_essay_url = public_path+'/templates/Essay';
var tpl_index_url = public_path+'/templates/Index/index.html';
var tpl_message_url = public_path+'/templates/message';
var tpl_tag_url = public_path+'/templates/tag';
var tpl_search_url = public_path+'/templates/search.html';
var tpl_setting_url = public_path+'/templates/setting';
var tpl_follow_url = public_path+'/templates/follow';
var tpl_action_url = public_path+'/templates/action';

m_index.config(['$locationProvider', '$urlRouterProvider', '$compileProvider',function($locationProvider, $urlRouterProvider,$compileProvider) {
    //$locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise("");
    //deal unsafe:javascript:...
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript):/);
}]);
//httpProvider
m_index.config(['$httpProvider',function($httpProvider){
   // Use x-www-form-urlencoded Content-Type
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
  $httpProvider.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
  //The workhorse; converts an object to x-www-form-urlencoded serialization.
  var param = function(obj) {
    var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
    for(name in obj) {
      value = obj[name];
      if(value instanceof Array) {
        for(i=0; i<value.length; ++i) {
          subValue = value[i];
          fullSubName = name + '[' + i + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value instanceof Object) {
        for(subName in value) {
          subValue = value[subName];
          fullSubName = name + '[' + subName + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value !== undefined && value !== null)
        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
    }
    return query.length ? query.substr(0, query.length - 1) : query;
  };
  // Override $http service's default transformRequest
  $httpProvider.defaults.transformRequest = [function(data) {
    return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
  }];
}]);


//stateProvider
m_index.config(['$stateProvider',function($stateProvider){
    $stateProvider.state('home',{
        url:'/'
    }).state('piece',{
        url:'/piece/page/:page',
        views:{
            'content':{templateUrl:tpl_piece_url+"/index.html"}
        }
    }).state('edit',{
        url:'/edit',
        views:{
            'content':{templateUrl:tpl_essay_url+"/edit.html"}
        }
    }).state('essay',{
        url:'/essay/page/:page',
        views:{
            'content':{templateUrl:tpl_essay_url+"/index.html"}
        }
    }).state('view',{
        url:'/view/:id',
        params:{id:null},
        controller:'c_view',
        views:{
            'content':{templateUrl:tpl_essay_url+"/view.html"}
        }
    }).state('comment',{
        url:'/comment/:id',
        views:{
            'mask':{templateUrl:tpl_piece_url+"/comment.html"}
        }
    }).state('setting_profile_userName',{
        url:'/modifyUserName',
        //parent:'setting',
        views:{
            'mask':{templateUrl:tpl_action_url+"/setting/modifyUserName.html"}
        }
    }).state('modify',{
        url:'/modify/type/:type/id/:id',
        views:{
            'content':{templateUrl:tpl_essay_url+"/modify.html"}
        }
    }).state('message',{
        url:'/message',
        views:{
            'content':{templateUrl:tpl_message_url+"/message.html"}
        }
    }).state('msg_comment',{
        url:'/comment',
        parent:'message',
        views:{
            'message':{templateUrl:tpl_message_url+"/comment.html"}
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
    }).state('tag',{
        url:'/tag',
        views:{
            'content':{templateUrl:tpl_tag_url+"/tag.html"}
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
    }).state('setting',{
        url:'/setting',
        views:{
            'content':{templateUrl:tpl_setting_url+"/setting.html"}
        }
    }).state('search',{
        url:'/search',
        views:{
            'content':{templateUrl:tpl_search_url}
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
    }).state('follow',{
        url:'/follow',
        views:{
            'content':{templateUrl:tpl_follow_url+"/follow.html"}
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
