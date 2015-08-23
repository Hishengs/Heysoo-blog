/*controller of angular*/
m_index.controller('c_index',function($scope,$rootScope,$state,$http,Piece){
	//$state.go('root');
    $rootScope.avatar = public_path+"/img/me.jpg";
    //$scope.indexLoadMoreBtn = '<i class="hs-icon-arrow-down"></i> 加载更多';
    //$scope.datas = new Piece();
    //$rootScope.paginator_current_page = 1;
    var url = home_path+"/Index/ng_index.html";
   	
    $http.get(url).success(function(res){
	    $scope.index_items = res;
	    //setLightBox();
	    $scope.index_page = 2;
	});
    //首頁加載更多按鈕
    $scope.indexLoadMore = function(){
    	$('button.index-load-more').html('<i class="hs-icon-spinner"></i> 加载中...');
    	//$scope.indexLoadMoreBtn = '<i class="hs-icon-spinner"></i> 加载中...';
    	url = home_path+"/Index/ng_index.html?index_page="+$scope.index_page;
    	$http.get(url).success(function(res){
    		$('button.index-load-more').html('<i class="hs-icon-arrow-down"></i> 加载更多');
    		//$scope.indexLoadMoreBtn = '<i class="hs-icon-arrow-down"></i> 加载更多';
    		if(res.length < 1){hMessage('沒有更多了！');return;}
    		for (var i = 0; i < res.length; i++) {
		        $scope.index_items.push(res[i]);
		    }
		    //setLightBox();
		    $scope.index_page++;
		});
    }

    $scope.getPage = function(page){
        progress_bar.start();
        if(page === 'piece'){
          var url = "/Heysoo/Home/Piece/ng_get_piece_page.html";
          var c_state = 'piece';
          $rootScope.item_nums = $rootScope.piece_nums;
        }else if(page === 'essay'){
          var url = "/Heysoo/Home/Essay/ng_get_essay_page.html";
          var c_state = 'essay';
          $rootScope.item_nums = $rootScope.essay_nums;
          $scope.view_path = home_path+"/Essay/ng_view.html";
        }else return;
        $http.get(url).success(function(res){
            $rootScope.items = res.items;
            $scope.page = res.page;
            $state.go(c_state,{page:1});
            paginator_index = 1;
            progress_bar.done();
        });
    }
    $scope.edit = function(){
      $scope.edit_post_path = home_path+"/Action/deal_post.html";
      $state.go('edit');
    }
    //文章详情页
    $scope.getViewPage = function(id){
      url = home_path+"/Essay/ng_view.html?id="+id;
      progress_bar.start();
      $http.get(url).success(function(res){
            $scope.essay = res.essay;
            $scope.comments = res.comments;
            $scope.avatar_path = public_path+"/img/me.jpg";
            $state.go('view',{id:id});
            $(document).scrollTop(0);
            setLightBox();
            progress_bar.done();
      });
    }
});
//边栏管理
m_index.controller('c_sidePanel',function($http,$rootScope,$scope){
	//ng_init_side_panel
	$scope.avatar = $rootScope.avatar;
	var url = home_path+"/Index/ng_init_side_panel.html";
	$http.get(url).success(function(res){
		if(res.error === 0){
			$rootScope.user = res.user;
			$rootScope.essay_nums = res.essay_nums;
			$rootScope.piece_nums = res.piece_nums;
			$rootScope.diary_nums = res.diary_nums;
		}
	});
});
//文章，碎片，日记发布
m_index.controller('c_edit',function($scope,$state,$http){
    $scope.edit_visible = "1";
    $scope.edit_type = "piece";
    var url = home_path+"/Essay/ng_essay_post.html";
    console.log(url);
    $scope.editPost = function(){
      $scope.edit_content = edit_post.html();
      $http({
        method:'POST',
        url:url,
        data:{
          'title':$scope.edit_title,
          'tag':$scope.edit_tag,
          'type':$scope.edit_type,
          'visible':$scope.edit_visible,
          'content':$scope.edit_content
        }
      }).success(function(res){
        console.log(res);
        if(res.error === 0){
          hMessage(res.msg);
          //$state.go('piece');
        }else{hMessage(res.msg);}
      });
    }
});
//管理分頁
var paginator_index = 1;
var num_per_page = 10;
var url_prefix = home_path+"/Action/ng_paginator.html";
m_index.controller('c_paginator',function($scope,$rootScope,$state,$http){
	$scope.paginator_pages = new Array();
	for (var i = 0; i < $rootScope.item_nums/num_per_page; i++) {
		$scope.paginator_pages[i] = {'id':parseInt(i+1),'name':"第 "+parseInt(i+1)+" 页"}
	};
	$scope.paginator_index = paginator_index;
	$scope.paginator_current_page = $scope.paginator_pages[paginator_index-1];
	$scope.paginator = function(type,action){
		if(action === 'prev'){
			if(paginator_index === 1){hMessage('当前已是第一页');return;}
			url = url_prefix+"?type="+type+"&page="+parseInt(paginator_index-1);
		}else if(action === 'go'){
			if(parseInt($scope.paginator_current_page.id) === paginator_index)return;
			url = url_prefix+"?type="+type+"&page="+parseInt($scope.paginator_current_page.id);
		}else if(action === 'next'){
			url = url_prefix+"?type="+type+"&page="+parseInt(paginator_index+1);
		}
		$http.get(url).success(function(res){
			if(res.error === 0){
				if(res.items.length < 1){hMessage('当前已是最后一页！');return;}
				$rootScope.items = res.items;
				$state.go(type,{page:res.page});
				$(document).scrollTop(0);
				paginator_index = res.page;
			}else{
				hMessage(res.msg);
			}
		});
	}
});