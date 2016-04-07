heysoo.register.controller('EditArchiveController',['$http','$scope','$rootScope','params','ngDialog',
	function($http,$scope,$rootScope,params,ngDialog){
	$scope.title = params.dialog_title;
	$scope.saved_archive = angular.copy(params.edit_archive);
	//----------- 确认添加归档 ----------
	$scope.saveArchiveConfirm = function(){
		console.log($scope.saved_archive);
		$http({
	        method:'POST',
	        url:home_path+'/Archive/update.html',
	        data:$scope.saved_archive
	    }).success(function(res){
	    	console.log(res);
	        if(res.error === 0){
                $scope.$emit('archiveEditDialogReturn',{action:'save',saved_archive:$scope.saved_archive});
                $scope.closeThisDialog(0);
	        }else{hMessage(res.msg);}
	    });
	}
	//----------- 删除归档 ----------
	$scope.deleteArchive = function(){
		if($scope.saved_archive.id == 1 || $scope.saved_archive.name == '默认'){
			hMessage('默认归档不可删除！');return;
		}
		if(confirm('删除后原归档下的文章将移动到默认归档，确定要删除该归档？'))
		$http({
	        method:'POST',
	        url:home_path+'/Archive/delete.html',
	        data:{id:$scope.saved_archive.id}
	    }).success(function(res){
	    	console.log(res);
	        if(res.error === 0){
	        	hMessage('删除成功！');
                $scope.$emit('archiveEditDialogReturn',{action:'delete',id:$scope.saved_archive.id});
                $scope.closeThisDialog(0);
	        }else{hMessage(res.msg);}
	    });
	}
	//----------- 退出窗口 --------------
	$scope.cancel = function(){
		$scope.closeThisDialog(0);
	}
}]);