/*controller of angular*/
m_index.controller('c_index',function($scope,$rootScope,$state,$http,Piece){
  //$state.go('root');
    $rootScope.avatar = public_path+"/img/me.jpg";
    //$scope.indexLoadMoreBtn = '<i class="hs-icon-arrow-down"></i> 加载更多';
    //$scope.datas = new Piece();
    $rootScope.mask_show = false;
    var url = home_path+"/Index/ng_index.html";
    
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
            if(res.items.length < 1)$scope.res_empty = true;
            else $scope.res_empty = false;
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
            if(res.comments.length < 1)$scope.essay_comments_tip_show = true;
            else $scope.essay_comments_tip_show = false;
            $scope.essay_comment_on = res.essay_comment_on;
            $scope.avatar_path = public_path+"/img/me.jpg";
            $state.go('view',{id:id});
            $(document).scrollTop(0);
            setLightBox();
            progress_bar.done();
      });
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
      var url = home_path+"/User/ng_get_user_info.html";
      $http.get(url).success(function(res){
        $scope.user_info = res.items;
      });
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
      $state.go('follow');
      $state.go("follow_followed");
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
    var url = home_path+"/Action/ng_deal_post.html";
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
          edit_post.html('');
          $state.go($scope.edit_type);
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
  $scope.showCmt = function(id,piece_id,user_id){
    $rootScope.piece_id = piece_id;
    $rootScope.piece_user_id = user_id;
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
          data:{'obj_id':$rootScope.piece_user_id,'piece_id':piece_id,'comment_content':content}
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
//文章修改
m_index.controller('c_modify',function($scope,$rootScope,$state,$http){
  var url = home_path+"/Action/ng_modify.html";
  $http.get(url,{params:{'type':$rootScope.type,'id':$rootScope.id}}).success(function(res){
      if(res.error === 0){
        console.log(res);
        modify_editor.html(res.items.content);
        $scope.essay_title = res.items.title;
        $scope.essay_tag = res.items.tag;
        $scope.essay_visible = res.items.visible;
      }else{hMessage(res.msg);}
  });
  //提交修改
  $scope.postModify = function(){
    var content = modify_editor.html();
    $http({
          method:'POST',
          url:home_path+"/Action/ng_deal_modify.html",
          data:{
            'type':$rootScope.type,'id':$rootScope.id,'content':content,
            'title':$scope.essay_title,'tag':$scope.essay_tag,'visible':$scope.essay_visible
          }
        }).success(function(res){
          if(res.error === 0){
            //清空编辑器
            modify_editor.html('');
            hMessage(res.msg);
            window.history.go(-1);
          }else{hMessage(res.msg);}
    });
  }
})
m_index.controller('c_essay_cmt',function($scope,$state,$http){
  //文章评论
  $scope.postEssayCmt = function(essay_id){
    $("button.post-essay-comment-btn").html('<i class="hs-icon-spinner"></i> 发布中...');
    essay_editor.sync(); //同步编辑器内容
    var content = $("#essay-comment-form").children("textarea[name='comment-content']").val();
    $http({
          method:'POST',
          url:home_path+"/Essay/post_comment.html",
          data:{'essay_id':essay_id,'comment_content':content}
        }).success(function(res){
          if(res.error === 0){
            //清空编辑器
            essay_editor.html('');
            hMessage(res.msg);
            $("button.post-essay-comment-btn").html('发布评论');
            //将新评论插入评论列表
            var html = '<li class="hs-comment">'+
            '<article class="hs-comment essay-comment"><a href="">'+
            '<img class="hs-comment-avatar comment-user-avatar" src="'+public_path+'/img/me.jpg" alt=""/></a>'+
            '<div class="hs-comment-main"><header class="hs-comment-hd">'+
            '<div class="hs-comment-meta"><a href="#link-to-user" class="hs-comment-author">'+res.comment.user+'</a>'+
            '评论于 <time datetime="">'+res.comment.date+'</time></div></header>'+
            '<div class="hs-comment-bd">'+res.comment.content+'</div></div></article></li>';
            $("div.comment-tip").remove();
            $("div.essay-comments").children("ul").prepend(html);
          }else{
            hMessage(res.msg);
            $("button.post-essay-comment-btn").html('发布评论');
          }
    });
  }
})
//消息控制器
m_index.controller('c_message',function($scope,$state,$http){
  $scope.msg_tab = 'comment';
  $scope.msgDetail = function(msg_obj_type,msg_obj_id){
    //console.log('msg_obj_type:'+msg_obj_type+',msg_obj_id:'+msg_obj_id);
    hMessage('msg_obj_type:'+msg_obj_type+',msg_obj_id:'+msg_obj_id);
  }
  //Tab切换
  $scope.msgSwitchTab = function(tab,id){
    $scope.msg_tab = tab;
    var msg_url = home_path+"/Message/get_msg_list.html?type="+tab+"&id="+id;
    $http.get(msg_url).success(function(res){
       if(res.error === 0){
         $scope.msgs = res.items;
         $scope.senders = res.senders;
         if(res.items.length < 1)$scope.msg_tip_show = true;
         else $scope.msg_tip_show = false;
       }else{$scope.msg_tip_show = true;}
    });
    $state.go("msg_"+tab);
  }
});
//设置控制器
m_index.controller('c_setting',function($scope,$state,$http){
  $scope.settingSwitchTab = function(tab){
    $scope.setting_tab = tab;
    $state.go("setting_"+tab);
  }
});
//好友控制器
m_index.controller('c_follow',function($scope,$state,$http){
  $scope.follow_tab = 'followed';
  $scope.followSwitchTab = function(tab){
    $scope.follow_tab = tab;
    $state.go("follow_"+tab);
  }
});