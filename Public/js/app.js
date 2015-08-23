var c_path = "/Heysoo/Home/";
var m_index = angular.module('Index',['infinite-scroll','ui.router']);
/*angular config*/
/*Config*/
var tpl_piece_url = public_path+'/templates/Piece/index.html';
var tpl_edit_url = public_path+'/templates/Essay/edit.html';
var tpl_essay_url = public_path+'/templates/Essay/index.html';
var tpl_view_url = public_path+'/templates/Essay/view.html';
m_index.config(['$locationProvider', '$urlRouterProvider', function($locationProvider, $urlRouterProvider) {
    //$locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise("");
}]);
//httpProvider
/*m_index.config(['$httpProvider',function($httpProvider){
	//
}]);*/
//stateProvider
m_index.config(['$stateProvider',function($stateProvider){
    $stateProvider.state('piece',{
        url:'/piece',
        views:{
            'content':{templateUrl:tpl_piece_url}
        }
    }).state('edit',{
        url:'/edit',
        views:{
            'content':{templateUrl:tpl_edit_url}
        }
    }).state('essay',{
        url:'/essay',
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
/*controller of angular*/
m_index.controller('c_content',function($scope,$state,$http){
  //$state.go('piece');
})
m_index.controller('c_index',function($scope,$state,$http,Piece){
    $scope.avatar = public_path+"/img/me.jpg";
    //$scope.datas = new Piece();
    $scope.getPage = function(page){
        //showLoadingMask('content');
        progress_bar.start();
        if(page === 'piece'){
          var url = "/Heysoo/Home/Piece/ng_get_piece_page.html";
          var c_state = 'piece';
        }else if(page === 'essay'){
          var url = "/Heysoo/Home/Essay/ng_get_essay_page.html";
          var c_state = 'essay';
          $scope.view_path = c_path+"Essay/ng_view.html";
        }else return;
        $http.get(url).success(function(res){
            $scope.items = res.items;
            $scope.page = res.page;
            $state.go(c_state);
            //hideMask();
            progress_bar.done();
        });
    }
    $scope.edit = function(){
      $scope.edit_post_path = home_path+"/Action/deal_post.html";
      $state.go('edit');
    }
    $scope.getViewPage = function(id){
      url = c_path+"Essay/ng_view.html?id="+id;
      progress_bar.start();
      $http.get(url).success(function(res){
            $scope.essay = res.essay;
            $scope.comments = res.comments;
            $scope.avatar_path = public_path+"/img/me.jpg";
            $state.go('view',{id:id});
            $(document).scrollTop(0);
            setLightBox();
            progress_bar.done();
      });
    }
});
m_index.controller('c_edit',function($scope,$state,$http){
    $scope.edit_visible = "1";
    $scope.edit_type = "piece";
    var url = home_path+"/Essay/ng_essay_post.html";
    console.log(url);
    $scope.editPost = function(){
      $scope.edit_content = edit_post.html();
      console.log("title:"+$scope.edit_title);
      console.log("tag:"+$scope.edit_tag);
      console.log("type:"+$scope.edit_type);
      console.log("visible:"+$scope.edit_visible);
      console.log("content:"+$scope.edit_content);
      /*$.ajax({
        url:url,
        type:'POST',
        data:{
          'title':$scope.edit_title,
          'tag':$scope.edit_tag,
          'type':$scope.edit_type,
          'visible':$scope.edit_visible,
          'content':$scope.edit_content
        },
        dataType:'json',
        success:function(res){
          console.log(res);
          if(res.error === 0){
            hMessage(res.msg);
            //$state.go('piece');
          }else{hMessage(res.msg);}
        }
      });*/
      $http({
        method:'POST',
        url:url,
        data:{
          'title':$scope.edit_title,
          'tag':$scope.edit_tag,
          'type':$scope.edit_type,
          'visible':$scope.edit_visible,
          'content':$scope.edit_content
        }
      }).success(function(res){
        console.log(res);
        if(res.error === 0){
          hMessage(res.msg);
          //$state.go('piece');
        }else{hMessage(res.msg);}
      });
    }
});
/*Factory*/
m_index.factory('Piece', function($http) {
  var Piece = function() {
    this.pieces = [];
    this.busy = false;
    this.end = false;
    this.close = false;
  };

  Piece.prototype.loadMore = function() {
    if(this.close) return;
    if (this.busy) return;
    if(this.end){this.close = true; return;}
    this.busy = true;

    var startNum = $("div.piece").length;
    var url = "/Heysoo/Home/Index/update_pieces.html?startNum="+startNum;

    $http.get(url).success(function(data) {
      if(data.length < 1)this.end = true;
      var pieces = data;
      for (var i = 0; i < pieces.length; i++) {
        this.pieces.push(pieces[i]);
      }
      this.busy = false;
    }.bind(this));
    //$tempalteCache.remove(url);
  };

  return Piece;
});
/*Filter*/
m_index.filter('trustHtml', function ($sce) {
        return function (input) {
            return $sce.trustAsHtml(input);
        }
});
m_index.filter('subStr', function () {
        return function (input,limit) {
            //去掉所有的html标记
            return input.replace(/<[^>]+>/g,"").substr(0,limit);
        }
});