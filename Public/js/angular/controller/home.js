heysoo.controller('c_index',function($scope,$rootScope,$state,$stateParams,$http,$timeout,Piece,ipCookie,User){
    $rootScope.mask_show = false;
    $rootScope.style = {};
    //获取用户配置
    User.getUserConfig().success(function(res){
      if(res.error === 0){
        $rootScope.user_config = res.user_config;
        $rootScope.interface_color = res.user_config.interface_color?res.user_config.interface_color:ipCookie('interface_color');//主题颜色
        $rootScope.mainBg = res.user_config.main_bg;//主页背景
        $rootScope.sideBarBg = res.user_config.sidebar_bg; //边栏背景
        $rootScope.style.sidebar_bg = {'background-image': 'url('+$rootScope.sideBarBg+'?imageView2/2/w/400)'};
        $rootScope.style.main_bg = {'background-image': 'url('+$rootScope.mainBg+')'};
      }else hMessage(res.msg);
    });
    $http.get(home_path+"/Index/ng_index.html").success(function(res){
      $rootScope.index_items = res;
      $scope.index_page = 2;
    });
    $state.go('home');
    //首頁加載更多按鈕
    $scope.indexLoadMore = function(){
      $('a.index-load-more').html('<i class="hs-icon-spinner"></i> 加载中...');
      $http.get(home_path+"/Index/ng_index.html?index_page="+$scope.index_page).success(function(res){
        $('a.index-load-more').html('<i class="hs-icon-arrow-down"></i> 加载更多');
        if(!res.length){hMessage('沒有更多了！');return;}
        for (var i = 0; i < res.length; i++) {
            $scope.index_items.push(res[i]);
        }
        $scope.index_page++;
    });
    }

    $scope.getPage = function(page){
        progress_bar.start();
        if(page === 'piece'){
          var url = home_path+"/Piece/ng_get_piece_page.html";
          var c_state = 'piece';
          $rootScope.item_nums = $rootScope.piece_nums;
        }else if(page === 'essay'){
          var url = home_path+"/Essay/ng_get_essay_page.html";
          var c_state = 'essay';
          $rootScope.item_nums = $rootScope.essay_nums;
          $scope.view_path = home_path+"/Essay/ng_view.html";
        }else return;
        $http.get(url).success(function(res){
            $rootScope.items = res.items;
            if(res.items.length < 1)$scope.res_empty = true;
            else $scope.res_empty = false;
            $scope.page = res.page;
            $state.go(c_state,{page:1});
            paginator_index = 1;
            progress_bar.done();
        });
    }
    //发布
    $scope.showPublish = function(){
      $scope.edit_post_path = home_path+"/Action/deal_post.html";
      $state.go('edit');
    }
    //文章详情页
    $scope.getViewPage = function(id){
      $state.go('view',{id:id});
      /*url = home_path+"/Essay/ng_view.html?id="+id;
      progress_bar.start();
      $http.get(url).success(function(res){
            $scope.essay = res.essay;
            $scope.comments = res.comments;
            if(res.comments.length < 1)$rootScope.essay_comments_tip_show = true;
            else $rootScope.essay_comments_tip_show = false;
            $scope.essay_comment_on = res.essay_comment_on;
            $scope.avatar_path = public_path+"/img/me.jpg";
            $state.go('view',{id:id});
            $(document).scrollTop(0);
            setLightBox();
            progress_bar.done();
      });*/
    }
    //删除
    $scope.deleteItem = function(type,id){
      if(confirm('你确定要删除？')){
        var url = home_path+"/Action/ng_delete.html";
          $http.get(url,{params:{'type':type,'id':id}}).success(function(res){
              if(res.error === 0){
                $("#"+id).remove();
                hMessage(res.msg);
              }else{hMessage(res.msg);}
          });
      }
    }
    //修改
    $scope.modify = function(type,id){
      $rootScope.type = type;
      $rootScope.id = id;
      $state.go('modify',{type:type,id:id});
    }
    //消息面板
    $scope.showMessage = function(){
      progress_bar.start();
      $scope.msg_tip_show = false;
      var msg_url = home_path+"/Message/get_msg_list.html";
      $http.get(msg_url).success(function(res){
        if(res.error === 0){
           $scope.msgs = res.items;
           $scope.senders = res.senders;
           if(res.items.length < 1)$scope.msg_tip_show = true;
           else $scope.msg_tip_show = false;
         }else{$scope.msg_tip_show = true;}
         progress_bar.done();
         $rootScope.unread_msg_num = '';
      });
      $state.go('message');
      $state.go('msg_comment');
    }
    //标签面板
    $scope.showTag = function(){
      $state.go('tag');
    }
    //设置面板
    $scope.showSetting = function(){
      $scope.setting_tab = 'profile';
      /*var url = home_path+"/User/ng_get_user_info.html";
      $http.get(url).success(function(res){
        $scope.user_info = res.items;
      });*/
      $scope.origin_user_avatar_path = "FgW07muueXq9EI9OIdezcY5ODe4f";
      $state.go('setting');
      $state.go('setting_profile');
    }
    //搜索面板
    $scope.showSearch = function(){
      $state.go('search');
    }
    //好友
    $scope.showFollow = function(){
      $rootScope.follow_items = new Array(0);
      $state.go('follow');
      var url = home_path+"/User/get_follow_list.html?type=followed";
      $http.get(url).success(function(res){
        if(res.error === 0 && res.items.length > 0){
          $rootScope.follow_items = res.items;
          $rootScope.follow_tip_show = false;
        }else $rootScope.follow_tip_show = true;
      });
      $state.go("follow_followed");
    }
    //查看用户主页
    $rootScope.viewUser = function(userName){
      var url = home_path+"/User/index.html?user="+userName;
      window.open(url);
    }
});
//管理分頁
var paginator_index = 1;
var num_per_page = 10;
var url_prefix = home_path+"/Action/ng_paginator.html";
heysoo.controller('c_paginator',function($scope,$rootScope,$state,$http){
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
    }else if(action === 'next'){
      url = url_prefix+"?type="+type+"&page="+parseInt(paginator_index+1);
    }else{
      console.log(action);
      if(parseInt(action) === paginator_index)return;
      url = url_prefix+"?type="+type+"&page="+parseInt(action);
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