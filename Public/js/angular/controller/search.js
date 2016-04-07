heysoo.register.controller('c_search',function($scope,$http,Search,User){
	$scope.search_type = '1';
	$scope.search_key = "";
	$scope.search_tip = '';
	$scope.piece_items = [];//搜索结果
	$scope.essay_items = [];
	$scope.user_items = [];
	$scope.search_tab = 'piece';
	$scope.search_tpl_url = public_path+"/templates/piece/pieces.html";

	$scope.switchSearchTab = function(tab){
		$scope.search_tab = tab;
		if(tab === 'piece')$scope.search_type='1';
		else if(tab === 'essay')$scope.search_type='2';
		else if(tab === 'user')$scope.search_type='3';
		$scope.search();
	}
	$scope.search = function(){
		if(isEmpty($scope.search_key)){$scope.search_tip = '<i class="hs-icon-warning"></i> 请输入关键词！';return;}
		$scope.search_tip = '<i class="hs-icon-spinner"></i> 正在拼命搜索中...';
		switch($scope.search_type){
			case '1'://碎片
			default:
				$scope.search_tab = 'piece';
				$scope.search_tpl_url = public_path+"/templates/piece/pieces.html";
				Search.searchPiece($scope.search_key).success(function(res){
					console.log(res);
					if(res.error === 0){
						$scope.piece_items = res.items;
						$scope.search_tip = '';
					}else {$scope.piece_items = [];$scope.search_tip = '<i class="hs-icon-warning"></i> '+res.msg;}
				});
				break;
			case '2'://文章
				$scope.search_tab = 'essay';
				$scope.search_tpl_url = public_path+"/templates/essay/essays.html";
				Search.searchEssay($scope.search_key).success(function(res){
					console.log(res);
					if(res.error === 0){
						$scope.essay_items = res.items;
						$scope.search_tip = '';
					}else {$scope.essay_items = [];$scope.search_tip = '<i class="hs-icon-warning"></i> '+res.msg;}
				});
				break;
			case '3'://用户
				$scope.search_tab = 'user';
				$scope.search_tpl_url = public_path+"/templates/user/user_items.html";
				Search.searchUser($scope.search_key).success(function(res){
					console.log(res);
					if(res.error === 0){
						$scope.user_items = res.items;
						$scope.search_tip = '';
					}else {$scope.user_items = [];$scope.search_tip = '<i class="hs-icon-warning"></i> '+res.msg;}
				});
				break;
		}
	}
	//添加关注
	$scope.addFollow = function(user_id,index){
		User.addFollow(user_id).success(function(res){
			if(res.error === 0){
				hMessage('关注成功！');
				$scope.user_items[index].is_followed = true;
			}
			else hMessage(res.msg);
		});
	}
	//取消关注
	$scope.disFollow = function(user_id,index){
		User.disFollow(user_id).success(function(res){
			if(res.error === 0){
				hMessage('取消关注成功！');
				$scope.user_items[index].is_followed = false;
			}
			else hMessage(res.msg);
		});
	}
});