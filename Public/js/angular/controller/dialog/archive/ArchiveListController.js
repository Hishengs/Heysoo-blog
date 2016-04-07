heysoo.register.controller('ArchiveListController',['$http','$scope','$rootScope','params','$ocLazyLoad','ngDialog',
	function($http,$scope,$rootScope,params,$ocLazyLoad,ngDialog){
	$scope.title = params.dialog_title;
	//----------- 获取用户所有的归档 ---------- 
	$http({
        method:'POST',
        url:home_path+'/Archive/getList.html',
        data:{}
    }).success(function(res){
    	console.log(res);
        if(res.error === 0){
            $scope.archives = res.archives;
        }else{hMessage(res.msg);}
    });
    /*//----------- 确认选择 --------------
    $scope.confirmSelect = function(){
        $scope.$emit('visibleDialogReturn',{action:'confirm',selected_tags:checked_tags});
        $scope.closeThisDialog(0);
    }*/
    //----------- 提前加载新建和编辑的控制器 -----------
    $ocLazyLoad.load([public_path+'/js/angular/controller/dialog/archive/AddArchiveController.js',
        public_path+'/js/angular/controller/dialog/archive/EditArchiveController.js'])
    .then(function(){},function(e){});
	//------------ 新建标签 --------------
	$scope.addArchive = function(){
		ngDialog.openConfirm({
            template: public_path+'/templates/dialog/archive/add.html',
            className: 'ngdialog-theme-default ngdialog-width-sm', //弹窗的类名
            controller : 'AddArchiveController',
            preCloseCallback: function(){ //关闭前的触发事件
                //return confirm('你确定要退出吗？');
                return true;
            },
            closeByDocument: false, //点击背景关闭弹窗
            closeByEscape: false, //通过键盘Esc按钮关闭弹窗
            showClose: false, //显示关闭按钮
            scope: $scope,
            appendTo: '#archive-list-dialog', //绑定到哪个元素节点
            resolve: { //将所需参数传递给弹窗的控制器
                params : function(){
                    return {
                        dialog_title:'新建归档'
                    };
                }
            }
        }).then(function (value) {
        }, function (reason) {
        });
	}
	//------------ 双击编辑归档 --------------
	$scope.editArchive = function(index,id){
		if(id == 1 || $scope.archives[index].name.trim() == '默认')return;
		$scope.edit_archive = $scope.archives[index];
		console.log('双击编辑归档');
		ngDialog.openConfirm({
            template: public_path+'/templates/dialog/archive/edit.html',
            className: 'ngdialog-theme-default ngdialog-width-sm', //弹窗的类名
            controller : 'EditArchiveController',
            preCloseCallback: function(){ //关闭前的触发事件
                //return confirm('你确定要退出吗？');
                return true;
            },
            closeByDocument: false, //点击背景关闭弹窗
            closeByEscape: false, //通过键盘Esc按钮关闭弹窗
            showClose: false, //显示关闭按钮
            scope: $scope,
            appendTo: '#archive-list-dialog', //绑定到哪个元素节点
            resolve: { //将所需参数传递给弹窗的控制器
                params : function(){
                    return {
                        dialog_title:'编辑归档',
                        edit_archive:$scope.edit_archive
                    };
                }
            }
        }).then(function (value) {
        }, function (reason) {
        });
	}
	//----------- 监听添加、编辑归档操作的返回结果 --------------
    $scope.$on('archiveAddDialogReturn',function(event,mass){
        console.log('监听到添加归档返回结果');
        console.log(mass);
        $scope.archives.push(mass.added_archive);
    });
    $scope.$on('archiveEditDialogReturn',function(event,mass){
        console.log(mass);
        if(mass.action == 'save'){
            _.map($scope.archives,function(item){
                if(item.id == mass.saved_archive.id)item.name = mass.saved_archive.name;
                return item;
            });
        }else if(mass.action == 'delete'){
            $scope.archives = _.reject($scope.archives,function(item){
                return item.id == mass.id;
            });
        }
    });
    //----------- 退出窗口 --------------
	$scope.cancel = function(){
		$scope.$emit('archiveDialogReturn',{action:'cancel'});
		$scope.closeThisDialog(0);
	}
}]);