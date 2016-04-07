heysoo.register.controller('c_user',['$scope','$http','$stateParams','User',
	function($scope,$http,$stateParams,User){
	$scope.post_tab = 'piece';
	$scope.user = {};
	$scope.follow = {is_followed:false,is_self:false};
	$scope.tpl_url = public_path+"/templates/piece/pieces.html";
	$scope.post_page = 1;
	$scope.piece_items = [];
	$scope.essay_items = [];
	$scope.load_more_tip_text = '<i class="hs-icon-arrow-down"></i> 加载更多';
	//获取用户信息
	User.getUserInfo($stateParams.user_id).success(function(res){
		if(res.error === 0){
			$scope.user = res.user;
		}else hMessage(res.msg);
	});
	//获取关注信息
	User.getFollowInfo($stateParams.user_id).success(function(res){
		if(res.error === 0){
			$scope.follow = res.follow;
		}else hMessage(res.msg);
	});
	
	//添加关注
	$scope.addFollow = function(user_id){
		User.addFollow(user_id).success(function(res){
			if(res.error === 0){hMessage('关注成功！');$scope.follow.is_followed=true;}
			else hMessage(res.msg);
		});
	}
	//取消关注
	$scope.disFollow = function(user_id){
		User.disFollow(user_id).success(function(res){
			if(res.error === 0){hMessage('取消关注成功！');$scope.follow.is_followed=false;}
			else hMessage(res.msg);
		});
	}
	//获取用户的碎片
	$scope.getUserPieces = function(user_id,post_page){
		$scope.load_more_tip_text = '<i class="hs-icon-spinner"></i> 加載中...';
		User.getPieces(user_id,post_page).success(function(res){
			if(res.error === 0){
				if(res.pieces.length){
					for (var i = 0,ilen=res.pieces.length; i < ilen; i++) {
			            $scope.piece_items.push(res.pieces[i]);
			        }
			        $scope.load_more_tip_text = '<i class="hs-icon-arrow-down"></i> 加载更多';
				}else{
					if(post_page==1)
						$scope.load_more_tip_text = '<i class="hs-icon-warning"></i> 暂无碎片！';
					else $scope.load_more_tip_text = '<i class="hs-icon-warning"></i> 没有更多碎片了！';
				}
			}
		});
	}
	//获取用户的文章
	$scope.getUserEssays = function(user_id,post_page){
		$scope.load_more_tip_text = '<i class="hs-icon-spinner"></i> 加載中...';
		User.getEssays(user_id,post_page).success(function(res){
			console.log(res);
			if(res.error === 0){
				if(res.essays.length){
					for (var i = 0,ilen=res.essays.length; i < ilen; i++) {
			            $scope.essay_items.push(res.essays[i]);
			        }
			        $scope.load_more_tip_text = '<i class="hs-icon-arrow-down"></i> 加载更多';
				}else{
					if(post_page==1)
						$scope.load_more_tip_text = '<i class="hs-icon-warning"></i> 暂无文章！';
					else $scope.load_more_tip_text = '<i class="hs-icon-warning"></i> 没有更多文章了！';
				}
			}
		});
	}
	//获取碎片
	$scope.getUserPieces($stateParams.user_id,$scope.post_page);
	//加载更多
	$scope.loadMore = function(user_id){
		++$scope.post_page;
		if($scope.post_tab == 'piece')$scope.getUserPieces(user_id,$scope.post_page);
		else $scope.getUserEssays(user_id,$scope.post_page);
	}
	//切换tab
	$scope.switchPostTab = function(tab){
		$scope.post_tab = tab;
		$scope.post_page=1;
		
		//更新
		if($scope.post_tab=='piece'){
			$scope.piece_items = [];
			$scope.tpl_url = public_path+"/templates/piece/pieces.html";
			$scope.getUserPieces($scope.user.id,$scope.post_page);
		}
		else{
			$scope.essay_items = [];
			$scope.tpl_url = public_path+"/templates/essay/essays.html";
			$scope.getUserEssays($scope.user.id,$scope.post_page);
		}
	}
}]);