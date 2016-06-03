var heysoo = angular.module('Index',['ui.router','ipCookie','oc.lazyLoad','ngDialog']);

var tpl_piece_url = public_path+'/templates/piece';
var tpl_essay_url = public_path+'/templates/essay';
var tpl_index_url = public_path+'/templates/Index';
var tpl_message_url = public_path+'/templates/message';
var tpl_tag_url = public_path+'/templates/tag';
var tpl_search_url = public_path+'/templates/search';
var tpl_setting_url = public_path+'/templates/setting';
var tpl_follow_url = public_path+'/templates/follow';
var tpl_action_url = public_path+'/templates/action';
var tpl_user_url = public_path+'/templates/user';
var tpl_todo_url = public_path+'/templates/todo';

var loaded_js = [];//保存动态加载过的js文件

heysoo.config(['$locationProvider', '$urlRouterProvider', '$compileProvider','$controllerProvider','$filterProvider','$provide',
    function($locationProvider, $urlRouterProvider,$compileProvider,$controllerProvider,$filterProvider,$provide) {
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise("");
    //deal unsafe:javascript:...
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript):/);
    heysoo.register = {
        controller: $controllerProvider.register,
        directive: $compileProvider.directive,
        filter: $filterProvider.register,
        factory: $provide.factory,
        service: $provide.service
    };
    heysoo.lazyLoad = function(dependencies){
        urls = angular.copy(dependencies);
        return ['$ocLazyLoad',function($ocLazyLoad){
            if(Array.isArray(urls)){
                for(var i=0;i<urls.length;i++){
                    urls[i] = public_path + urls[i];
                }
            }else urls = [public_path + urls];
            return $ocLazyLoad.load(urls);
            /*return $ocLazyLoad.load(urls).then(function () {
                console.log('js 文件加载成功！');
            }, function (e){});*/
        }];
    }
}]);


//httpProvider
heysoo.config(['$httpProvider',function($httpProvider){
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


