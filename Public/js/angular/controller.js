/*controller of angular*/
m_index.controller('c_index',function($scope,$rootScope,$state,$http,Piece){
  //$state.go('root');
    $rootScope.avatar = public_path+"/img/me.jpg";
    //$scope.indexLoadMoreBtn = '<i class="hs-icon-arrow-down"></i> 加载更多';
    //$scope.datas = new Piece();
    $rootScope.mask_show = false;
    var url = home_path+"/Index/ng_index.html";
    console.log(url);
    
    $http.get(url).success(function(res){
      $rootScope.index_items = res;
      $scope.index_page = 2;
  });
  setLightBox();
  $state.go('home');
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
  //靠近左侧显示
  $('body').mousemove(function(e) { 
    var xx = e.originalEvent.x || e.originalEvent.layerX || 0; 
    if(xx <= 20){
      $("#content").css('padding-left','400px');
      $("#left-panel").fadeIn(500);
    }
  }); 
  //双击隐藏
  $scope.toggleSidePanel = function(){
    $("#left-panel").fadeOut(500,function(){
    $("#content").css('padding-left',0);
    });
  }
});
//文章，碎片，日记发布
m_index.controller('c_edit',function($scope,$state,$http){
    $scope.edit_visible = "1";
    $scope.edit_type = "piece";
    var url = home_path+"/Essay/ng_essay_post.html";
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
//碎片
m_index.controller('c_piece',function($scope,$rootScope,$state,$http){
  $scope.showCmt = function(id,piece_id){
    $rootScope.piece_id = piece_id;
    $rootScope.cmt_obj_id = id;
    $rootScope.cmt_obj = $rootScope.index_items[id];
    $("body").css('overflow-y','hidden');
    $state.go('comment');
    $rootScope.mask_show = true;
    updatePieceCmt(piece_id);
  }
})
m_index.controller('c_comment',function($scope,$rootScope,$state,$http){
  $scope.closeCmt = function(){
    $("body").css('overflow-y','auto');
    $rootScope.mask_show = false;
    $state.go('home');
  }
  //点击元素以外隐藏
    /*$(document).one('click',function(e){
    var target = $(e.target); 
    if(target.closest("#piece-comment").length == 0){ 
      console.log('关闭评论');
      $("body").css('overflow-y','auto');
      $rootScope.mask_show = false;
      $state.go('home');
    } 
    e.stopImmediatePropagation();//阻止事件向上冒泡
  });*/
  //提交评论
  $scope.postPieceCmt = function(){
    var piece_id = $rootScope.piece_id;
    $("button.post-piece-comment-btn").html('<i class="icon-spinner"></i> 发布中...');
    piece_cmt_editor.sync(); //同步编辑器内容
    var content = $("form.piece-comment-post-form").children("textarea[name='piece-comment-edit']").val();
    $http({
          method:'POST',
          url:home_path+"/Piece/post_comment.html",
          data:{'piece_id':piece_id,'comment_content':content}
        }).success(function(res){
          if(res.error === 0){
            //清空编辑器
        piece_cmt_editor.html('');
        $("button.post-piece-comment-btn").html('发 布');
              hMessage(res.msg);
              updatePieceCmt(piece_id);
          }else{hMessage(res.msg);}
      });
  }
})