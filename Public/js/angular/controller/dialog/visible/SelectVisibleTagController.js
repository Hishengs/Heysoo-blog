heysoo.register.controller('SelectVisibleTagController',['$http','$scope','$rootScope','params','ngDialog','$ocLazyLoad',
	function($http,$scope,$rootScope,params,ngDialog,$ocLazyLoad){
	$scope.title = params.dialog_title;
	$scope.visible_type = params.visible_type;
	$scope.friends = [];
	$scope.tags = [];
	$scope.checked_tags = [];
    //------------ 获取用户标签 ------------
	$http({
        method:'POST',
        url:home_path+'/Tag/getList.html',
        data:{}
    }).success(function(res){
    	console.log(res);
        if(res.error === 0){
            $scope.tags = res.tags;
            _.map($scope.tags,function(item){
                item.checked = false;
                return item;
            });
        }else{hMessage(res.msg);}
    });
    //------------ 获取用户好友列表 ------------
	$http({
        method:'POST',
        url:home_path+'/Tag/getFriendList.html',
        data:{}
    }).success(function(res){
    	console.log(res);
        if(res.error === 0){
            $scope.friends = res.friends;
            _.map($scope.friends,function(item){
                item.checked = false;
                return item;
            });
        }else{hMessage(res.msg);}
    });
    //----------- 提前加载新建和编辑的控制器 -----------
    $ocLazyLoad.load([public_path+'/js/angular/controller/dialog/visible/AddVisibleTagController.js',
        public_path+'/js/angular/controller/dialog/visible/EditVisibleTagController.js'])
    .then(function(){},function(e){});
	//------------ 新建标签 --------------
	$scope.addVisibleTag = function(){
		ngDialog.openConfirm({
            template: public_path+'/templates/dialog/visible/add.html',
            className: 'ngdialog-theme-default ngdialog-width-sm', //弹窗的类名
            controller : 'AddVisibleTagController',
            preCloseCallback: function(){ //关闭前的触发事件
                //return confirm('你确定要退出吗？');
                return true;
            },
            closeByDocument: false, //点击背景关闭弹窗
            closeByEscape: false, //通过键盘Esc按钮关闭弹窗
            showClose: false, //显示关闭按钮
            scope: $scope,
            appendTo: '#visible-tag-select-dialog', //绑定到哪个元素节点
            resolve: { //将所需参数传递给弹窗的控制器
                params : function(){
                    return {
                        friends:$scope.friends,
                        dialog_title:'添加可见性标签'
                    };
                }
            }
        }).then(function (value) {
        }, function (reason) {
        });
	}
	//------------ 单击选中标签 --------------
	$scope.selectTag = function(index,id){
		console.log('单击选中标签');
        $scope.tags[index].checked = !$scope.tags[index].checked;
        var flag = $scope.checked_tags.indexOf($scope.tags[index].id);
        if(flag >= 0)$scope.checked_tags.splice(flag,1);//已经存在数组中
        else $scope.checked_tags.push($scope.tags[index].id);
        console.log($scope.checked_tags);
	}
	//------------ 双击编辑标签 --------------
	$scope.editVisibleTag = function(index,id){
		$scope.edit_tag = $scope.tags[index];
		console.log('双击编辑标签');
		ngDialog.openConfirm({
            template: public_path+'/templates/dialog/visible/edit.html',
            className: 'ngdialog-theme-default ngdialog-width-sm', //弹窗的类名
            controller : 'EditVisibleTagController',
            preCloseCallback: function(){ //关闭前的触发事件
                //return confirm('你确定要退出吗？');
                return true;
            },
            closeByDocument: false, //点击背景关闭弹窗
            closeByEscape: false, //通过键盘Esc按钮关闭弹窗
            showClose: false, //显示关闭按钮
            scope: $scope,
            appendTo: '#visible-tag-select-dialog', //绑定到哪个元素节点
            resolve: { //将所需参数传递给弹窗的控制器
                params : function(){
                    return {
                        friends:$scope.friends,
                        dialog_title:'编辑可见性标签',
                        edit_tag:$scope.edit_tag
                    };
                }
            }
        }).then(function (value) {
        }, function (reason) {
        });
	}
    //----------- 监听添加、编辑标签操作的返回结果 --------------
    $scope.$on('visibleTagAddDialogReturn',function(event,mass){
        console.log('监听到添加标签返回结果');
        console.log(mass);
        $scope.tags.push(mass.added_tag);
    });
    $scope.$on('visibleTagEditDialogReturn',function(event,mass){
        console.log(mass);
        if(mass.action == 'save'){
            _.map($scope.tags,function(item){
                if(item.id == mass.saved_tag.id)item.name = mass.saved_tag.name;
                return item;
            });
        }else if(mass.action == 'delete'){
            $scope.tags = _.reject($scope.tags,function(item){
                return item.id == mass.id;
            });
        }
    });
	//----------- 退出窗口 --------------
	$scope.cancel = function(){
		$scope.$emit('visibleDialogReturn',{action:'cancel'});
		$scope.closeThisDialog(0);
	}
    //----------- 确认选择 --------------
    $scope.confirmSelect = function(){
        var checked_tags = _.filter($scope.tags,function(item){
            return $scope.checked_tags.indexOf(item.id) >= 0;
        });
        //checked_tags = _.pluck(checked_tags,'name');
        $scope.$emit('visibleDialogReturn',{action:'confirm',selected_tags:checked_tags});
        $scope.closeThisDialog(0);
    }
}]);