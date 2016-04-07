heysoo.register.controller('EditVisibleTagController',['$http','$scope','$rootScope','params','ngDialog',
	function($http,$scope,$rootScope,params,ngDialog){
	$scope.title = params.dialog_title;
	$scope.friends = angular.copy(params.friends);
	$scope.saved_tag = angular.copy(params.edit_tag);
	$scope.checked_friends = [];

	console.log('当前编辑的标签\n');
	console.log($scope.saved_tag);
	//----------- 获取该标签下的所有好友 ---------- 
	$http({
        method:'POST',
        url:home_path+'/Tag/getFriendListOfTag.html',
        data:{tag_id:$scope.saved_tag.id}
    }).success(function(res){
    	console.log(res);
        if(res.error === 0){
            $scope.saved_tag.friends = res.friends?res.friends.split(','):[];
            $scope.checked_friends = $scope.saved_tag.friends;
            _.map($scope.friends,function(item){
                if($scope.checked_friends.indexOf(item.id) >= 0)item.checked = true;
                else item.checked = false;
                return item;
            });
        }else{hMessage(res.msg);}
    });
	//----------- 确认保存标签 ----------
	$scope.saveTagConfirm = function(){
		var data = angular.copy($scope.saved_tag);
		if(!$scope.checked_friends.length){
            hMessage('请至少选择一个好友！');return;
        }else if(hs.isEmpty(data.name)){
            hMessage('标签名不能为空！');return;
        }
		data.friends = $scope.checked_friends.toString();
		console.log(data);
		$http({
	        method:'POST',
	        url:home_path+'/Tag/update.html',
	        data:data
	    }).success(function(res){
	    	console.log(res);
	        if(res.error === 0){
	            hMessage('标签更新成功！');
	            $scope.$emit('visibleTagEditDialogReturn',{action:'save',saved_tag:{name:data.name,id:data.id,checked:false}});
	        }else{hMessage(res.msg);}
	    });
	}
	//---------- 删除标签 ----------
	$scope.deleteTag = function(){
		if(confirm('该标签下所有相关的文章可见性将转为仅自己可见，确定要删除该标签？'))
		$http({
	        method:'POST',
	        url:home_path+'/Tag/delete.html',
	        data:{id:$scope.saved_tag.id}
	    }).success(function(res){
	    	console.log(res);
	        if(res.error === 0){
	        	$scope.$emit('visibleTagEditDialogReturn',{action:'delete',id:$scope.saved_tag.id});
	            hMessage('标签删除成功！');
	            $scope.closeThisDialog(0);
	        }else{hMessage(res.msg);}
	    });
	}
	//------------ 单击选中好友 --------------
    $scope.selectFriend = function(index,id){
        console.log('单击选中好友');
        $scope.friends[index].checked = !$scope.friends[index].checked;
        var flag = $scope.checked_friends.indexOf(id);
        if(flag >= 0)$scope.checked_friends.splice(flag,1);//已经存在数组中
        else $scope.checked_friends.push(id);
        console.log($scope.checked_friends);
    }
	//----------- 退出窗口 --------------
	$scope.cancel = function(){
		$scope.closeThisDialog(0);
	}
}]);