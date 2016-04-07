heysoo.register.controller('AddVisibleTagController',['$http','$scope','$rootScope','params','ngDialog',
	function($http,$scope,$rootScope,params,ngDialog){
	$scope.title = params.dialog_title;
	$scope.friends = angular.copy(params.friends);
	$scope.added_tag = {name:'',friends:[]};
	//----------- 确认添加标签 ----------
	$scope.addTagConfirm = function(){
        var data = angular.copy($scope.added_tag);
        if(!data.friends.length){
            hMessage('请至少选择一个好友！');return;
        }else if(hs.isEmpty(data.name)){
            hMessage('标签名不能为空！');return;
        }
		data.friends = data.friends.toString();
		console.log(data);
		$http({
	        method:'POST',
	        url:home_path+'/Tag/add.html',
	        data:data
	    }).success(function(res){
	    	console.log(res);
	        if(res.error === 0){
	            //hMessage('添加标签成功！');
                $scope.$emit('visibleTagAddDialogReturn',{action:'confirm',added_tag:{name:data.name,id:res.id,checked:false}});
                $scope.closeThisDialog(0);
	        }else{hMessage(res.msg);}
	    });
	}
    //------------ 单击选中好友 --------------
    $scope.selectFriend = function(index,id){
        console.log('单击选中好友');
        $scope.friends[index].checked = !$scope.friends[index].checked;
        var flag = $scope.added_tag.friends.indexOf(id);
        if(flag >= 0)$scope.added_tag.friends.splice(flag,1);//已经存在数组中
        else $scope.added_tag.friends.push(id);
        console.log($scope.added_tag.friends);
    }
	//----------- 退出窗口 --------------
	$scope.cancel = function(){
		$scope.closeThisDialog(0);
	}
}]);