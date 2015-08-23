/*angular config*/
/*Config*/
var tpl_piece_url = public_path+'/templates/Piece/index.html';
var tpl_edit_url = public_path+'/templates/Essay/edit.html';
var tpl_essay_url = public_path+'/templates/Essay/index.html';
var tpl_view_url = public_path+'/templates/Essay/view.html';
var tpl_index_url = public_path+'/templates/Index/index.html';
m_index.config(['$locationProvider', '$urlRouterProvider', function($locationProvider, $urlRouterProvider) {
    //$locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise("");
}]);
//httpProvider
m_index.config(['$httpProvider',function($httpProvider){
   // Use x-www-form-urlencoded Content-Type
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
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
    $stateProvider.state('root',{
        url:''
    }).state('piece',{
        url:'/piece/page=:page',
        views:{
            'content':{templateUrl:tpl_piece_url}
        }
    }).state('edit',{
        url:'/edit',
        views:{
            'content':{templateUrl:tpl_edit_url}
        }
    }).state('essay',{
        url:'/essay/page=:page',
        views:{
            'content':{templateUrl:tpl_essay_url}
        }
    }).state('view',{
        url:'/view/:id',
        views:{
            'content':{templateUrl:tpl_view_url}
        }
    });
}]);
//deal unsafe:javascript:...
m_index.config(function($compileProvider){
      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript):/);
});