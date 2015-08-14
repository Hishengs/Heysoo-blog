var index_module = angular.module('Index',['infinite-scroll']);
angular.module('infinite-scroll').value('THROTTLE_MILLISECONDS', 250);
index_module.controller('IndexController',function($scope,Piece){
	$scope.avatar = public_path+"/img/me.jpg";
	/*$scope.loadMore = function(){
		var last = $scope.pieces[$scope.pieces.length - 1];
		var startNum = $("div.piece").length;
		console.log('请求的文章ID是：'+startNum);
		$("button.load-more").html('加载中...');
		var url = "/Heysoo/Home/Index/update_pieces.html?startNum="+startNum;
		$http.get(url).success(function(response){
			//$scope.pieces = response;
			$scope.pieces.push(response);
			$scope.hide = false;
			console.log(response);
			$("button.load-more").html('加载更多');
		});
	}*/
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