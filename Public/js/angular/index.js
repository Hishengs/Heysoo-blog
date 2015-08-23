var m_index = angular.module('Index',['infinite-scroll','ui.router']);
/*Controller*/
/*m_index.controller('c_app',function($scope,$state,$http){
  $scope.getPage = function(page){
    if(page === 'piece'){
      var url = "/Heysoo/Home/Piece/ng_get_piece_page.html";
      $http.get(url).success(function(res){
        $scope.pieces = res;
        $state.go('piece');
      });
    }else return;
  }
});*/
