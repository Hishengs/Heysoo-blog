/*angular config*/
/*Config*/
var tpl_piece_url = public_path+'/templates/Piece/index.html';
var tpl_edit_url = public_path+'/templates/Essay/edit.html';
var tpl_essay_url = public_path+'/templates/Essay/index.html';
var tpl_view_url = public_path+'/templates/Essay/view.html';
var tpl_index_url = public_path+'/templates/Index/index.html';
var tpl_cmt_url = public_path+'/templates/Piece/comment.html';
var tpl_modify_url = public_path+'/templates/Essay/modify.html';
var tpl_message_url = public_path+'/templates/message/message.html';
var tpl_tag_url = public_path+'/templates/tag.html';
var tpl_setting_url = public_path+'/templates/setting/setting.html';
var tpl_search_url = public_path+'/templates/search.html';
var tpl_comment_url = public_path+'/templates/message/comment.html';
var tpl_whisper_url = public_path+'/templates/message/whisper.html';
var tpl_at_url = public_path+'/templates/message/at.html';
var tpl_notice_url = public_path+'/templates/message/notice.html';
var tpl_profile_url = public_path+'/templates/setting/profile.html';
var tpl_interface_url = public_path+'/templates/setting/interface.html';
var tpl_push_url = public_path+'/templates/setting/push.html';
var tpl_privacy_url = public_path+'/templates/setting/privacy.html';
var tpl_follow_url = public_path+'/templates/follow/follow.html';
var tpl_followed_url = public_path+'/templates/follow/followed.html';
var tpl_following_url = public_path+'/templates/follow/following.html';
m_index.config(['$locationProvider', '$urlRouterProvider', function($locationProvider, $urlRouterProvider) {
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise("");
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
            'content':{templateUrl:tpl_piece_url}
        }
    }).state('edit',{
        url:'/edit',
        views:{
            'content':{templateUrl:tpl_edit_url}
        }
    }).state('essay',{
        url:'/essay/page/:page',
        views:{
            'content':{templateUrl:tpl_essay_url}
        }
    }).state('view',{
        url:'/view/:id',
        views:{
            'content':{templateUrl:tpl_view_url}
        }
    }).state('comment',{
        url:'/comment/:id',
        views:{
            'mask':{templateUrl:tpl_cmt_url}
        }
    }).state('modify',{
        url:'/modify/type/:type/id/:id',
        views:{
            'content':{templateUrl:tpl_modify_url}
        }
    }).state('message',{
        url:'/message',
        views:{
            'content':{templateUrl:tpl_message_url}
        }
    }).state('msg_comment',{
        url:'/comment',
        parent:'message',
        views:{
            'message':{templateUrl:tpl_comment_url}
        }
    }).state('msg_at',{
        url:'/at',
        parent:'message',
        views:{
            'message':{templateUrl:tpl_at_url}
        }
    }).state('msg_whisper',{
        url:'/whisper',
        parent:'message',
        views:{
            'message':{templateUrl:tpl_whisper_url}
        }
    }).state('msg_notice',{
        url:'/notice',
        parent:'message',
        views:{
            'message':{templateUrl:tpl_notice_url}
        }
    }).state('tag',{
        url:'/tag',
        views:{
            'content':{templateUrl:tpl_tag_url}
        }
    }).state('setting',{
        url:'/setting',
        views:{
            'content':{templateUrl:tpl_setting_url}
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
            'v_setting':{templateUrl:tpl_profile_url}
        }
    }).state('setting_interface',{
        url:'/interface',
        parent:'setting',
        views:{
            'v_setting':{templateUrl:tpl_interface_url}
        }
    }).state('setting_push',{
        url:'/push',
        parent:'setting',
        views:{
            'v_setting':{templateUrl:tpl_push_url}
        }
    }).state('setting_privacy',{
        url:'/privacy',
        parent:'setting',
        views:{
            'v_setting':{templateUrl:tpl_privacy_url}
        }
    }).state('follow',{
        url:'/follow',
        views:{
            'content':{templateUrl:tpl_follow_url}
        }
    }).state('follow_followed',{
        url:'/followed',
        parent:'follow',
        views:{
            'follow':{templateUrl:tpl_followed_url}
        }
    }).state('follow_following',{
        url:'/following',
        parent:'follow',
        views:{
            'follow':{templateUrl:tpl_following_url}
        }
    });
}]);
//deal unsafe:javascript:...
m_index.config(function($compileProvider){
      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript):/);
});