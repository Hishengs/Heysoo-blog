//好友控制器
heysoo.register.controller('c_follow',['$scope','$rootScope','$state','$http',function($scope,$rootScope,$state,$http){
  if($rootScope.follow_items.length < 1)$rootScope.follow_tip_show = true;
  else $rootScope.follow_tip_show = false;
  $scope.follow_tab = 'followed';
  $scope.followSwitchTab = function(tab){
    $scope.follow_tab = tab;
    $rootScope.follow_items = new Array(0);
    var url = home_path+"/User/get_follow_list.html?type="+tab;
    $http.get(url).success(function(res){
      if(res.error === 0 && res.items.length > 0){
        $rootScope.follow_items = res.items;
        $rootScope.follow_tip_show = false;
      }else $rootScope.follow_tip_show = true;
    });
    $state.go("follow_"+tab);
    //remove follow
    $scope.remvoeFollow = function(type,follow_id){
      url  = home_path+"/User/remove_follow.html";
      $http({
          method:'POST',
          url:url,
          data:{'type':type,'follow_id':follow_id}
        }).success(function(res){
          if(res.error === 0){
            $("#"+follow_id).remove();
            hMessage(res.msg);
          }else hMessage(res.msg);
      });
    }
  }
}]);