//待办事项
heysoo.register.controller('todo',function($scope,$rootScope,$state,$http,$q){
	$scope.numPerPage = 5;
	$scope.cdt = {start_time:'',end_time:'',deadline:'',urgent_level:'0',key_words:'',address:'',status:'',p:{page:1,numPerPage:$scope.numPerPage}};//查询条件
	$scope.is_empty = false;
	$scope.show = {search:false,add:false};
	$scope.loadMoreText = '加载更多';
	$scope.todos = [];

	$scope.doSearch = function(){
		var cdt = angular.copy($scope.cdt);
		cdt.start_time = cdt.start_time?(Date.parse(cdt.start_time)+"").substring(0,10):"";
		cdt.end_time = cdt.end_time?(Date.parse(cdt.end_time)+"").substring(0,10):"";
		cdt.deadline = cdt.deadline?(Date.parse(cdt.deadline)+"").substring(0,10):"";
		console.log(cdt);
		//cdt = JSON.stringify(cdt);
		var deferred = $q.defer();
		$http({
		    method:'POST',
            url:home_path+'/Todo/getList.html',
            data:cdt	
		}).success(function(data){
			deferred.resolve(data);
		}).error(function(data, status, headers, config){
			deferred.reject(data);
		});
		return deferred.promise;
	}
	//获取待办事项列表
	$scope.search = function(){
		$scope.cdt.p.page = 1;
		$scope.doSearch().then(function(res){
			console.log(res);
			if(res.error == 0){
				$scope.todos = res.todos;
				$scope.is_empty = $scope.todos.length<=0;
				$scope.loadMoreText = '加载更多';
			}else {
				hMessage(res.msg);
			}
		},function(data){
			hMessage('获取待办事项列表失败！');
			console.log(data);
		});
	}
	$scope.search();
	//加载更多
	$scope.loadMore = function(){
		$scope.loadMoreText = '正在加载...';
		$scope.cdt.p.page = Math.ceil($scope.todos.length/$scope.numPerPage)+1;
		$scope.doSearch().then(function(res){
			console.log(res);
			if(res.error == 0){
				$scope.todos = $scope.todos.concat(res.todos);
				$scope.is_empty = $scope.todos.length<=0;
				$scope.loadMoreText = !res.todos.length?'没有更多了':'加载更多';
			}else {
				hMessage(res.msg);
				$scope.loadMoreText = '加载更多';
			}
		},function(data){
			hMessage('获取待办事项列表失败！');
			console.log(data);
			$scope.loadMoreText = '获取待办事项列表失败！';
		});
	}
	//重置查询条件
	$scope.resetQuery = function(){
		$scope.cdt = {start_time:'',end_time:'',deadline:'',urgent_level:'0',key_words:'',address:'',status:'',p:{page:1,numPerPage:$scope.numPerPage}};//查询条件
	}
	//新增待办事项
	$scope.todo = {content:'',urgent_level:'1',deadline:'',address:''};
	$scope.add = function(){
		var todo = angular.copy($scope.todo);
		todo.deadline = todo.deadline?(Date.parse(todo.deadline)+"").substring(0,10):"";
		console.log(todo);
		$http({
		    method:'POST',
            url:home_path+'/Todo/add.html',
            data:todo	
		}).success(function(res){
			console.log(res);
			if(res.error == 0){
				hMessage(res.msg);
				$scope.show = {search:false,add:false};
				$scope.search();
			}else {
				hMessage(res.msg);
			}
		});
	}
	//删除待办事项
	$scope.delete = function(id){
		console.log(id);
		if(confirm('确定删除该事项？'))
		$http({
		    method:'POST',
            url:home_path+'/Todo/delete.html',
            data:{id:id}	
		}).success(function(res){
			console.log(res);
			if(res.error == 0){
				hMessage(res.msg);
				var deleted_todo = document.getElementById('todo-'+id);
				deleted_todo.parentNode.removeChild(deleted_todo);
			}else {
				hMessage(res.msg);
			}
		});
	}
	//更新待办事项
	$scope.update = function(){}
	//标为已办
	$scope.setDone = function(id){
		console.log(id);
		$http({
		    method:'POST',
            url:home_path+'/Todo/set_done.html',
            data:{id:id}	
		}).success(function(res){
			console.log(res);
			if(res.error == 0){
				hMessage(res.msg);
				_.map($scope.todos,function(item){
					if(item.id==id)item.status=1;
				});
			}else {
				hMessage(res.msg);
			}
		});
	}
	//撤销已办
	$scope.resetDone = function(id){
		console.log(id);
		$http({
		    method:'POST',
            url:home_path+'/Todo/reset_done.html',
            data:{id:id}	
		}).success(function(res){
			console.log(res);
			if(res.error == 0){
				hMessage(res.msg);
				_.map($scope.todos,function(item){
					if(item.id==id)item.status=0;
				});
			}else {
				hMessage(res.msg);
			}
		});
	}
	//显示搜索区域
	$scope.toggleSearch = function(){
		//$scope.show.search = !$scope.show.search;
		$scope.show = {search:!$scope.show.search,add:false};
		//$scope.resetQuery();
	}
	//显示新建区域
	$scope.toggleAdd = function(){
		$scope.show = {add:!$scope.show.add,search:false};
		$scope.todo = {content:'',urgent_level:'1',deadline:'',address:''};
	}
	//筛选状态
	$scope.filterStatus = function(){
		if(arguments[0] !== undefined)$scope.cdt.status = arguments[0];
		else $scope.cdt.status = '';
		$scope.search();
	}
});