//controller of tag
heysoo.controller('c_tag',function($scope,$rootScope,$state,$http){
  $rootScope.tag_tab = "essay";
  $rootScope.tag_tip = true;
  $http.get(home_path+"/User/get_user_tag.html?type=essay").success(function(res){
    if(res.error === 0){
      $rootScope.tag_items = res.items;
      if(res.items.length > 0)$rootScope.tag_tip = false;
    }
  });
  $state.go("tag_essay");
  $scope.tagSwitchTab = function(tab,id){
    $rootScope.tag_tab = tab;
    $http.get(home_path+"/User/get_user_tag.html?type="+tab).success(function(res){
      if(res.error === 0){
        $rootScope.tag_items = res.items;
        if(res.items.length > 0)$rootScope.tag_tip = false;
        else $rootScope.tag_tip = true;
      }
    });
    $state.go("tag_"+tab);
  }
  $scope.newTagModal = function(type){
    $("#tag_new_modal").modal('toggle');
  }
  $scope.newTag = function(type){
    $("#tag_new_modal").modal('toggle');
    hMessage('创建成功！');
  }
  //移除标签
  $scope.removeTag = function(tag_id){
    $("#tag_"+tag_id).remove();
    hMessage('移除成功！');
  }
});
heysoo.controller('c_tag_essay',function($scope,$rootScope,$http){
 //
});