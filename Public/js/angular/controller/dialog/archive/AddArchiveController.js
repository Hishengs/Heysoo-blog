heysoo.register.controller('AddArchiveController',['$http','$scope','$rootScope','params','ngDialog',
	function($http,$scope,$rootScope,params,ngDialog){
	$scope.title = params.dialog_title;
	$scope.added_archive = '';
	//----------- 确认添加归档 ----------
	$scope.addArchiveConfirm = function(){
		if($scope.added_archive.trim() == '默认'){
			hMessage('该归档名不可用！');return;
		}else if(hs.isEmpty($scope.added_archive)){
			hMessage('归档名不能为空！');return;
		}
		console.log($scope.added_archive);
		$http({
	        method:'POST',
	        url:home_path+'/Archive/add.html',
	        data:{name:$scope.added_archive}
	    }).success(function(res){
	    	console.log(res);
	        if(res.error === 0){
                $scope.$emit('archiveAddDialogReturn',{action:'confirm',added_archive:{name:$scope.added_archive,id:res.id}});
                $scope.closeThisDialog(0);
	        }else{hMessage(res.msg);}
	    });
	}
	//----------- 退出窗口 --------------
	$scope.cancel = function(){
		$scope.closeThisDialog(0);
	}
}]);