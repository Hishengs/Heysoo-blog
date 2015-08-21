var index_module = angular.module('Index',['infinite-scroll','ui.router']);
angular.module('infinite-scroll').value('THROTTLE_MILLISECONDS', 250);
//首页滑动加载控制器
index_module.controller('IndexController',function($scope,Piece){
	$scope.avatar = public_path+"/img/me.jpg";
	$scope.datas = new Piece();
});
index_module.filter('trustHtml', function ($sce) {
        return function (input) {
            return $sce.trustAsHtml(input);
        }
});
//数据工厂
index_module.factory('Piece', function($http) {
  var Piece = function() {
    this.pieces = [];
    this.busy = false;
    this.end = false;
    this.close = false;
  };

  Piece.prototype.loadMore = function() {
  	if(this.close) return;
    if (this.busy) return;
    if(this.end){/*hMessage('没有更多了！'); */this.close = true; return;}
    this.busy = true;

    var startNum = $("div.piece").length;
	$("button.load-more").html('加载中...');
	var url = "/Heysoo/Home/Index/update_pieces.html?startNum="+startNum;

    $http.get(url).success(function(data) {
      if(data.length < 1)this.end = true;
      var pieces = data;
      console.log(pieces);
      for (var i = 0; i < pieces.length; i++) {
        this.pieces.push(pieces[i]);
      }
      this.busy = false;
      $("button.load-more").html('加载更多');
    }.bind(this));
  };

  return Piece;
});
//首页碎片评论控制器
index_module.controller('pieceCmtCrl',function($scope){
	//
});

//路由配置
index_module.config(['$locationProvider', '$urlRouterProvider', function($locationProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/blog/index");
}]);