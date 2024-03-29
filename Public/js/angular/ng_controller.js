//边栏管理
heysoo.register.controller('c_sidePanel',function($http,$rootScope,$scope){
  var url = home_path+"/Index/ng_init_side_panel.html";
  $http.get(url).success(function(res){
    if(res.error === 0){
      $rootScope.avatar = res.user.avatar;
      $rootScope.user_info = res.user;
      $rootScope.essay_nums = res.essay_nums;
      $rootScope.piece_nums = res.piece_nums;
      $rootScope.diary_nums = res.diary_nums;
      $rootScope.unread_msg_num = res.unread_msg_num;
    }
  });
  //检测是否是移动设备
  $rootScope.device = isMobile();
  //监听窗口大小变化
  window.onresize = function(){
    $rootScope.device = isMobile();
  }
  //设置定时器，定时获取未读消息数目#每1分钟
  var timer = 60000;
  setInterval(function(){
    var url = home_path+"/Message/ng_get_unread_msg_num.html";
    $http.get(url).success(function(res){
      if(res.unread_msg_num < 1 || $rootScope.unread_msg_num === res.unread_msg_num)timer -= 1000;//若没有新消息或者新消息条目没变化，则加快读取
      else timer += 1000;//若有新消息，则延缓读取
      timer = timer<30000?60000:timer;//如果timer小于一半，则重置timer
      $rootScope.unread_msg_num = res.unread_msg_num;
    });
  },timer);
  //显示发布器
  $rootScope.togglePublisher = function(){
    //动态创建一个编辑器
    window.piece_editor = editormd("piece-editor", piece_editor_opt);
    $('#publisher').slideToggle();
  }
});
heysoo.controller('c_index',function($scope,$rootScope,$state,$stateParams,$http,$timeout,Piece,ipCookie,User){
    //前端路由的统一管理
    $rootScope.$on('$locationChangeStart', function(event){
        if(!ipCookie('fingerprint')){
          //如果未登录，除了注册登陆不允许跳转到别的地方
          console.log(arguments);
          var pattern1 = /\/(view|user)\/[\d]+/i;
          var pattern2 = /\/Action\/register\.html/i;
          if(!pattern1.test(arguments[1])){
            redirect('login');
          }else if(pattern2.test(arguments[1])){
            redirect('register');
          }
        }
    });
    $rootScope.mask_show = false;
    $rootScope.style = {};
    $scope.index_empty = false;
    //获取用户配置
    User.getUserConfig().success(function(res){
      if(res.error === 0){
        console.log($rootScope.user_config);
        $rootScope.user_config = res.user_config;
        $rootScope.interface_color = res.user_config.interface_color?res.user_config.interface_color:ipCookie('interface_color');//主题颜色
        $rootScope.mainBg = res.user_config.main_bg;//主页背景
        $rootScope.sideBarBg = res.user_config.sidebar_bg; //边栏背景
        $rootScope.style.sidebar_bg = {'background-image': 'url('+$rootScope.sideBarBg+'?imageView2/2/w/400)'};
        $rootScope.style.main_bg = {'background-image': 'url('+$rootScope.mainBg+')'};
      }else hMessage(res.msg);
    });
    $http.get(home_path+"/Index/ng_index.html").success(function(res){
      if(res.error === 0){
        $rootScope.index_items = res.pieces;
        if($rootScope.index_items.length <= 0)$scope.index_empty = true;
        else $scope.index_empty = false;
        $scope.index_page = 2;
      }//else if(res.error === 4){hMessage(res.msg);window.location.href='';}
      else hMessage(res.msg);
    });
    //$state.go('home');
    //首頁加載更多按鈕
    $scope.indexLoadMore = function(){
      $('a.index-load-more').html('<i class="hs-icon-spinner"></i> 加载中...');
      $http.get(home_path+"/Index/ng_index.html?index_page="+$scope.index_page).success(function(res){
        if(res.error === 0){
          if(!res.pieces.length){$('a.index-load-more').html('<i class="hs-icon-warning"></i> 没有更多了！');return;}
          for (var i = 0; i < res.pieces.length; i++) {
              $scope.index_items.push(res.pieces[i]);
          }
          $scope.index_page++;
          $('a.index-load-more').html('<i class="hs-icon-arrow-down"></i> 加载更多');
        }else {
          hMessage(res.msg);
          $('a.index-load-more').html('<i class="hs-icon-arrow-down"></i> 加载更多');
        }
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
angular.bootstrap(document.body,['Index']);
heysoo.register.controller('c_essay',['$scope','$rootScope','$http','$stateParams',function($scope,$rootScope,$http,$stateParams){
    //--------------- 获取文章列表 ------------
    $scope.getEssayList = function(){
        var cdt = arguments[0]?arguments[0]:{};
        progress_bar.start();
        $http({
            method:'POST',
            url:home_path+'/Essay/ng_get_essay_page.html',
            data:cdt
        }).success(function(res){
            console.log(res);
            if(res.error === 0){
                $scope.items = res.items;
                if(res.items.length < 1)$scope.res_empty = true;
                else $scope.res_empty = false;
                paginator_index = res.page;
                $rootScope.paginator_pages = [];
                for (var i = 0; i < res.count/num_per_page; i++) {
                    $rootScope.paginator_pages[i] = {'id':parseInt(i+1),'name':"第 "+parseInt(i+1)+" 页"}
                }
                $(document).scrollTop(0);
                progress_bar.done();
                $rootScope.state_history.push('essay');
            }else{hMessage(res.msg);}
        });
    }
    if($stateParams.page == 1)//如果是第一页则需要执行该操作
        $scope.getEssayList();
    //--------------- 获取归档列表 ------------
    if(!$scope.archives)
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
    $scope.selected_archive = 0;
    //--------------- 选择归档 ------------
    $scope.selectArchive = function(id){
        $scope.selected_archive = id;
        if(id!==0)
            $scope.getEssayList({archive_id:id});
        else $scope.getEssayList({});
    }
    //--------------- 分页 ------------
    $scope.esy_paginator = function(action){
        if(action === 'prev'){//前一页
            if(paginator_index === 1){hMessage('当前已是第一页');return;}
            $scope.getEssayList({archive_id:$scope.selected_archive,page:parseInt(paginator_index-1)});
        }else if(action === 'next'){//后一页
            $scope.getEssayList({archive_id:$scope.selected_archive,page:parseInt(paginator_index+1)});
        }else{//任意页
            if(parseInt(action) === paginator_index)return;//如果选择的页数正是当前页数，则忽略
            $scope.getEssayList({archive_id:$scope.selected_archive,page:parseInt(paginator_index)});
        }
    }
}]);
heysoo.register.controller('c_view',['$scope','$rootScope','$http','$stateParams',function($scope,$rootScope,$http,$stateParams){
    $scope.essay_view_tip_show = false;
    $scope.is_logined = true;
    $rootScope.reply_to_id = $rootScope.parent_cmt_id = null;
    url = home_path+"/Essay/ng_view.html?id="+$stateParams.id;
    progress_bar.start();
    //动态创建editor
    window.essay_comment_editor = editormd("essay-comment-editor", essay_comment_editor_opt);

    $http.get(url).success(function(res){
        if(res.error === 0){
            $scope.essay = res.essay;
            document.title = 'Heysoo-'+$scope.essay.title;//设置title
            $scope.comments = res.comments;
            if(res.comments.length < 1)$rootScope.essay_comments_tip_show = true;
            else $rootScope.essay_comments_tip_show = false;
            $scope.essay_comment_on = res.essay_comment_on;
            $scope.is_logined = res.is_logined==1?true:false;
            $scope.avatar_path = public_path+"/img/me.jpg";
            $(document).scrollTop(0);
            window.scrollTo(0,0);
            progress_bar.done();
        }else{
            $scope.essay = $scope.comments = [];
            $rootScope.essay_comments_tip_show = true;
            $scope.essay_comment_on = false;
            $scope.essay_view_tip = "<i class='hs-icon-warning'></i> "+res.msg;
            $scope.essay_view_tip_show = true;
            progress_bar.done();
        }
    });
    //打开回复处理框
    $scope.showEssayReplyCmtModal = function(reply_to_id,parent_cmt_id){
    $rootScope.reply_to_id = reply_to_id;
    $rootScope.parent_cmt_id = parent_cmt_id;
    $('#essay-comment-reply-modal').modal('toggle');
    window.essay_comment_reply_editor = editormd("essay-comment-reply-editor", essay_comment_reply_editor_opt);
    }
}]);
//文章修改
heysoo.register.controller('c_modify',['$scope','$rootScope','$state','$http','Music',function($scope,$rootScope,$state,$http,Music){
    $scope.post = {}
    var url = home_path+"/Action/ng_modify.html";
    //获取文章内容
    $http.get(url,{params:{'type':$rootScope.type,'id':$rootScope.id}}).success(function(res){
      if(res.error === 0){
        $scope.post = {
            title:res.items.title,
            tag:res.items.tag,
            visible:res.items.visible,
            piece_check:false
        }
      }else{hMessage(res.msg);}
      //动态创建editor
      essay_modify_editor_opt.value = res.items.content?res.items.content:'';
      window.essay_modify_editor = editormd("essay-modify-editor", essay_modify_editor_opt);
      //window.essay_modify_editor.setValue(res.items.content?res.items.content:'');
    });
    //查找音乐
    $scope.searchSong = function(){
        if(isEmpty($scope.edit_song_key)){hMessage("输入不能为空！");return;}
        $rootScope.song_search_tip = '查询中...';
        $rootScope.current_editor = window.essay_modify_editor;
        $rootScope.search_songs = new Array();
        Music.search($scope.edit_song_key).success(function(res){
          if(res.songs.length){
            $rootScope.search_songs = res.songs;
            var songs_num = res.songs.length;
            $rootScope.song_search_tip = '共找到 '+ songs_num +' 首相关歌曲';
            $rootScope.song_search_tip_show = true;
          }
          else {$rootScope.song_search_tip_show = true;$rootScope.song_search_tip = '无相关歌曲';}
        });
    }
    //提交修改
    $scope.postModify = function(){
        var content = window.essay_modify_editor.getHTML();//获取markdown编辑器的html
        console.log($scope.post);return;
        $http({
              method:'POST',
              url:home_path+"/Action/ng_deal_modify.html",
              data:{
                'type':$rootScope.type,'id':$rootScope.id,'content':content,
                'title':$scope.post.title,'tag':$scope.post.tag,'visible':$scope.post.visible,
                'post_piece':$scope.post.piece_check
              }
            }).success(function(res){
              if(res.error === 0){
                //清空编辑器
                window.essay_modify_editor.setValue('');//将编辑器内容置空
                hMessage(res.msg);
                //window.history.go(-1);
                $state.go('essay',{page:1});
              }else{hMessage(res.msg);}
        });
    }
}]);
heysoo.register.controller('c_essay_cmt',['$scope','$rootScope','$state','$http',function($scope,$rootScope,$state,$http){
    //文章评论
    $scope.postEssayCmt = function(essay_id){
    $("button.post-essay-comment-btn").html('<i class="hs-icon-spinner"></i> 发布中...');
    var content = window.essay_comment_editor.getHTML();
    //essay_editor.sync(); //同步编辑器内容
    //var content = $("#essay-comment-form").children("textarea[name='comment-content']").val();
    $http({
          method:'POST',
          url:home_path+"/Essay/post_comment.html",
          data:{'essay_id':essay_id,'comment_content':content}
        }).success(function(res){
          if(res.error === 0){
            //清空编辑器
            //essay_editor.html('');
            hMessage(res.msg);
            $("button.post-essay-comment-btn").html('发布评论');
            window.essay_comment_editor.setValue('');
            //将新评论插入评论列表
            var html = '<li class="hs-comment">'+
            '<article class="hs-comment essay-comment"><a href="">'+
            '<img class="hs-comment-avatar comment-user-avatar" src="'+$rootScope.avatar+'" alt=""/></a>'+
            '<div class="hs-comment-main"><header class="hs-comment-hd">'+
            '<div class="hs-comment-meta"><a href="#link-to-user" class="hs-comment-author">'+res.comment.user+'</a>'+
            ' 评论于 <time datetime="">'+res.comment.date+'</time>'+
            '<span class="essay-comment-right" style="float:right;">'+
            '<a href="javascript:;" ng-click="showEssayReplyCmtModal(res.user_id,res.comment_id)">回复</a>'+
            '</span></div></header>'+
            '<div class="hs-comment-bd">'+res.comment.content+'</div></div></article></li>';
            $("div.comment-tip").remove();
            $rootScope.essay_comments_tip_show = false;
            $("div.essay-comments").children("ul").prepend(html);
          }else{
            hMessage(res.msg);
            $("button.post-essay-comment-btn").html('发布评论');
          }
    });
    }
    //回复文章评论
    $scope.replyEssayCmt = function(essay_id){
    $("button.reply-essay-comment-btn").html('<i class="hs-icon-spinner"></i> 发布中...');
    var reply_content = essay_comment_reply_editor.getHTML();
    //essay_reply_editor.sync(); //同步编辑器内容
    //var reply_content = $("#essay-reply-comment-form").children("textarea[name='reply-comment-content']").val();
    $http({
          method:'POST',
          url:home_path+"/Essay/essay_comment_reply.html",
          data:{'essay_id':essay_id,'replyTo_id':$rootScope.reply_to_id,
          'parent_cmt_id':$rootScope.parent_cmt_id,'reply_content':reply_content}
        }).success(function(res){
          if(res.error === 0){
            //清空编辑器
            essay_comment_reply_editor.setValue('');
            //essay_reply_editor.html('');
            hMessage(res.msg);
            $("button.reply-essay-comment-btn").html('发布评论');
            //将新评论插入评论列表
            var html = '<li class="hs-comment">'+
            '<article class="hs-comment essay-comment"><a href="">'+
            '<img class="hs-comment-avatar comment-user-avatar" src="'+public_path+'/img/me.jpg" alt=""/></a>'+
            '<div class="hs-comment-main"><header class="hs-comment-hd">'+
            '<div class="hs-comment-meta"><a href="#link-to-user" class="hs-comment-author">'+res.comment.user+'</a>'+
            '评论于 <time datetime="">'+res.comment.date+'</time>'+
            '<span class="essay-comment-right" style="float:right;">'+
            '<a href="javascript:;" ng-click="showEssayReplyCmtModal(res.user_id,res.comment_id)">回复</a>'+
            '</span></div></header>'+
            '<div class="hs-comment-bd">'+res.comment.content+'</div></div></article></li>';
            $("div.comment-tip").remove();
            $rootScope.essay_comments_tip_show = false;
            $("div.essay-comments").children("ul").prepend(html);
            $('#essay-comment-reply-modal').modal('toggle');
            //$state.go('view',{id:essay_id});
            $state.reload();
            window.location.hash="#essay-comment-lists";
          }else{
            hMessage(res.msg);
            $("button.reply-essay-comment-btn").html('发布评论');
            $('#essay-comment-reply-modal').modal('toggle');
          }
    });
    }
}]);
//碎片
heysoo.register.controller('c_piece',['$scope','$rootScope','$state','Piece','$http','$stateParams',
  function($scope,$rootScope,$state,Piece,$http,$stateParams){
    if($stateParams.page == 1)//如果是第一页则需要执行该操作
    {
        progress_bar.start();
        var url = !$state.is('piece')?home_path+"/Index/ng_index.html":home_path+"/Piece/ng_get_piece_page.html";
        $http.get(url).success(function(res){
            console.log(res);
            $rootScope.items = $state.is('piece')?res.items:res.pieces;
            if($rootScope.items.length < 1)$scope.res_empty = true;
            else $scope.res_empty = false;
            paginator_index = res.page;
            $rootScope.paginator_pages = [];
            for (var i = 0; i < res.count/num_per_page; i++) {
                $rootScope.paginator_pages[i] = {'id':parseInt(i+1),'name':"第 "+parseInt(i+1)+" 页"}
            }
            progress_bar.done();
            if($state.is('piece'))$rootScope.state_history.push('piece');
        });
    }
    //删除碎片
    $scope.deletePiece = function(piece_id){
      if(confirm("你确定要删除该碎片?")){
        Piece.delete(piece_id).success(function(res){
          if(res.error === 0){
            //移除该碎片
            $("#piece-"+piece_id).remove();
            hMessage(res.msg);
          }else hMessage(res.msg);
        });
      }
    }
    $scope.piece_comments = {};
    //更新评论
    $scope.updateComment = function(piece_id){
      Piece.getPieceComments(piece_id).success(function(res){
        if(res.error === 0){
          $scope.piece_comments = res.comments;
          $scope.piece_comments_num = $scope.piece_comments.length;
          console.log('piece_comments_num:',$scope.piece_comments_num);
          $scope.piece_comment_tip = '';
          $scope.piece_comment_tip_show = false;
        }else {
          $scope.piece_comment_tip_show = true;
          $scope.piece_comments_num = '';
          $scope.piece_comment_tip = '<i class="hs-icon hs-icon-warning"></i> '+res.msg;
        }
      });
    }

    //显示评论区
    $scope.pieceCommentToggle = function(piece_id){
      if($('#piece-comment-'+piece_id).css('display') == 'none'){
        $scope.piece_comments = [];
        $scope.piece_comment_tip_show = true;
        $scope.piece_comment_tip = '<i class="hs-icon hs-icon-spinner"></i> 正在获取评论...';
        //获取碎片评论
        $scope.updateComment(piece_id);
      }
      $('#piece-comment-'+piece_id).slideToggle();
    }
    $scope.postedComment = {};//待发布的评论
    $scope.postedComment.reply_to_id = null;
    //评论
    $scope.postComment = function(piece_id,piece_user_id){
      if(!$scope.postedComment.comment_content){
        hMessage("评论内容不能为空！");
        return;
      }
      $scope.postedComment.piece_id = piece_id;
      $scope.postedComment.obj_id = piece_user_id;
      if($scope.postedComment.reply_to_id !== null){//如果是回复
        if($scope.postedComment.comment_content.split(':') !== undefined)
          $scope.postedComment.comment_content = $scope.postedComment.comment_content.split(':')[1];
        else $scope.postedComment.reply_to_id = null;
      }
      console.log($scope.postedComment);
      //{'obj_id':$rootScope.piece_user_id,'piece_id':piece_id,'comment_content':content,'reply_to_id':$scope.piece_comment_reply_to_id}
      Piece.postComment($scope.postedComment).success(function(res){
        if(res.error === 0){
              //清空回复框
              $scope.postedComment.comment_content = "";
              $scope.postedComment.reply_to_id = null;
              $("button.post-piece-comment-btn").html('发 布');
              //更新评论
              $scope.updateComment(piece_id);
              //hMessage(res.msg);
            }else{
              hMessage(res.msg);
            }
      });
    }
    //回复评论
    $scope.replyComment = function(comment_user_id,comment_user_name){
      $scope.postedComment.comment_content = "@"+comment_user_name+" : ";
      $scope.postedComment.reply_to_id = comment_user_id;
    }
    //删除评论
    $scope.deleteComment = function(piece_id,comment_id){
      if(confirm("确定删除该评论?")){
        Piece.deleteComment(comment_id).success(function(res){
          if(res.error === 0){
            //更新评论
            $scope.updateComment(piece_id);
          }else hMessage(res.msg);
        });
      }
    }
}]);
//消息控制器
heysoo.register.controller('c_message',function($scope,$state,$http){
  $scope.msg_tab = 'comment';
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
  //删除消息
  $scope.deleteMsg = function(type,msg_id){
    if(confirm('你确定要删除？')){
        var url = home_path+"/Message/delete_msg.html";
          $http.get(url,{params:{'type':type,'msg_id':msg_id}}).success(function(res){
              if(res.error === 0){
                $("#msg-"+type+"-"+msg_id).remove();
                hMessage(res.msg);
              }else{hMessage(res.msg);}
          });
      }
  }
});
//comment box
heysoo.register.controller('c_message_comment',function($scope,$rootScope,$http){
  $scope.show_piece_text = "查看碎片";
  $scope.show_original_piece = false;
  $scope.showPiece = function(){
    if(!$scope.show_original_piece)
      {$scope.show_original_piece = true;$scope.show_piece_text = "收起碎片";}
    else
       {$scope.show_original_piece = false;$scope.show_piece_text = "查看碎片";}
  }
  $scope.showMsgDetail = function(msg_obj_type,msg_obj_id){
    $scope.current_cmt = null;
    //获取评论详情
    if(msg_obj_type == 'essay')var url = home_path+"/Comment/ng_get_essay_comment.html?cmt_id="+msg_obj_id;
    else if(msg_obj_type == 'piece')var url = home_path+"/Comment/ng_get_piece_comment.html?cmt_id="+msg_obj_id;
    $http.get(url).success(function(res){
      if(res.error === 0){$scope.current_cmt = res.comment;$("#msgDetailModal_"+msg_obj_type).modal('toggle');}
      else hMessage(res.msg);
    });
  }
});
//好友控制器
heysoo.register.controller('c_follow',['$scope','$rootScope','$state','$http',function($scope,$rootScope,$state,$http){
  if($rootScope.follow_items.length < 1)$rootScope.follow_tip_show = true;
  else $rootScope.follow_tip_show = false;
  $scope.follow_tab = 'followed';
  $scope.followSwitchTab = function(tab){
    $scope.follow_tab = tab;
    $rootScope.follow_items = new Array(0);
    var url = home_path+"/User/get_follow_list.html?type="+tab;
    $http.get(url).success(function(res){
      if(res.error === 0 && res.items.length > 0){
        $rootScope.follow_items = res.items;
        $rootScope.follow_tip_show = false;
      }else $rootScope.follow_tip_show = true;
    });
    $state.go("follow_"+tab);
    //remove follow
    $scope.remvoeFollow = function(type,follow_id){
      url  = home_path+"/User/remove_follow.html";
      $http({
          method:'POST',
          url:url,
          data:{'type':type,'follow_id':follow_id}
        }).success(function(res){
          if(res.error === 0){
            $("#"+follow_id).remove();
            hMessage(res.msg);
          }else hMessage(res.msg);
      });
    }
  }
}]);
//文章，碎片，日记发布
heysoo.register.controller('c_edit',['$scope','$rootScope','$state','$http','Music','$ocLazyLoad','ngDialog','$stateParams',
    function($scope,$rootScope,$state,$http,Music,$ocLazyLoad,ngDialog,$stateParams){
    //--------------- 动态创建编辑器 -------------
    $scope.post = {};
    //window.essay_md_editor = editormd("essay-md-editor",essay_md_editor_opt);//初始化Markdown编辑器
    $scope.current_editor = 'markdown';//当前的编辑器类型：markdown/regular
    //两种编辑器的资源路径数组
    var regular_editor_resource = [public_path+'/editor/kindeditor-min.js',public_path+'/editor/themes/simple/simple.css'];
    var markdown_editor_resource = [];
    //------------ 初始化数据 ----------------
    if($stateParams.action == 'new'){//新增文章
        //新建的编辑器由用户偏好来决定
        if($rootScope.user_config.editor=='regular'){
            $scope.ocLazyLoad(regular_editor_resource).then(function(){
                window.essay_editor = KindEditor.create('#essay-editor',regular_essay_editor_opt);
                $scope.current_editor = 'regular';
            },function(e){
                console.log('初始化时加载编辑器出错！');
            });
        }else {
            window.essay_md_editor = editormd("essay-md-editor",essay_md_editor_opt);
            $scope.current_editor = 'markdown';
        }
        $scope.action = 'new';
        $scope.post = {
            title:'',
            tag:'',
            visible:'1',
            visible_tag:'',
            archive:'',
            content:'',
            post_piece:true
        };
        $scope.selected_tags = '';
    }else {//编辑文章
        $scope.action = 'edit';
        //修改的编辑器由文章新建时所使用的编辑器决定
        //---------------- 获取文章内容 ----------------
        $http({
            method:'POST',
            url:home_path+"/Essay/get_essay.html",
            data:{'id':$stateParams.id}
        }).success(function(res){
            console.log(res);
            if(res.error === 0){
                $scope.post = {
                    id:$stateParams.id,
                    title:res.items.title,
                    tag:res.items.tag,
                    visible:res.items.visible,
                    visible_tag:res.items.visible_tag,
                    archive:res.items.archive,
                    content:parseInt(res.items.is_md)?res.items.content_md:res.items.content,
                    piece_check:false
                }
                $scope.selected_tags = res.items.selected_tags;
                //将html转为md
                if(!res.items.is_md){
                    //加载普通编辑器
                    $scope.ocLazyLoad(regular_editor_resource).then(function(){
                        window.essay_editor = KindEditor.create('#essay-editor',regular_essay_editor_opt);
                        window.essay_editor.html($scope.post.content);
                        $scope.current_editor = 'regular';
                    },function(e){
                        console.log('初始化时加载编辑器出错！');
                    });
                }else{
                    window.essay_md_editor = editormd("essay-md-editor",essay_md_editor_opt);//初始化Markdown编辑器
                    $scope.current_editor = 'markdown';
                    setTimeout(function(){window.essay_md_editor.setMarkdown($scope.post.content);},1000);
                }
                /*if($scope.current_editor=='markdown')setTimeout(function(){window.essay_md_editor.setMarkdown($scope.post.content);},1000);
                else setTimeout(function(){window.essay_editor.html($scope.post.content);},1000);*/
            }else{hMessage(res.msg);}
        });
    }
    $scope.edit_song_key = '';//查找音乐的关键词
    $scope.songs = [];
    $scope.song_search_tip_show = false;
    //-------------- 初始化编辑器 ------------
    $http({
        method:'POST',
        url:home_path+'/Essay/get_edit_init_info.html',
        data:{}
    }).success(function(res){
        console.log(res);
        if(res.error === 0){
            $scope.archiveItems = res.data.archive;
            if($scope.action == 'new')
            $scope.post.archive = $scope.archiveItems[0].id;
        }else{hMessage(res.msg);}
    });
    //setTimeout(function(){window.essay_md_editor.fullscreen();},500);
    //--------------- 发布文章 ------------------
    $scope.editPost = function(){
        if($scope.current_editor=='markdown'){
            $scope.post.content = window.essay_md_editor.getHTML();//获取markdown编辑器的html
            $scope.post.content_md = window.essay_md_editor.getMarkdown();
        }else {
            //ps,如果使用普通编辑器，将html转为md可能会有问题
            $scope.post.content_md = toMarkdown(window.essay_editor.html());
            $scope.post.content = window.essay_editor.html();
        }
        $scope.post.is_md = $scope.current_editor=='markdown'?1:0;
        console.log($scope.post);
        if($scope.action == 'new')
            $http({
                method:'POST',
                url:home_path+"/Essay/post.html",
                data:$scope.post
            }).success(function(res){
            console.log(res);
                if(res.error === 0){
                    hMessage(res.msg);
                    //edit_post.html('');
                    window.essay_md_editor.setValue('');//将编辑器内容置空
                    if($scope.edit_type == 'essay')
                        $state.go('view',{id:res.id});
                    else
                    {$state.go('home');}
                }else{hMessage(res.msg);}
            });
        else 
            $http({
                method:'POST',
                url:home_path+"/Essay/update.html",
                data:$scope.post
            }).success(function(res){
            console.log(res);
                if(res.error === 0){
                    hMessage(res.msg);
                    window.essay_md_editor.setValue('');//将编辑器内容置空
                    $state.go('essay',{page:1});
                }else{hMessage(res.msg);}
            });

    }
    //---------------- 查找音乐 --------------
    $scope.searchSong = function(){
      if(isEmpty($scope.edit_song_key)){hMessage("输入不能为空！");return;}
      $rootScope.song_search_tip = '查询中...';
      $rootScope.current_editor = window.essay_md_editor;
      $rootScope.search_songs = new Array();
      Music.search($scope.edit_song_key).success(function(res){
        if(res.songs.length){
          $rootScope.search_songs = res.songs;
          var songs_num = res.songs.length;
          $rootScope.song_search_tip = '共找到 '+ songs_num +' 首相关歌曲';
          $rootScope.song_search_tip_show = true;
        }
        else {$rootScope.song_search_tip_show = true;$rootScope.song_search_tip = '无相关歌曲';}
      });
    }
    //-------------- 编辑可见性 --------------
    $scope.editVisible = function(){
        switch($scope.post.visible){
            case '0':
                visible_type = '仅自己可见';
                break;
            case '2':
                visible_type = '选中可见';
                break;
            case '3':
                visible_type = '选中不可见';
                break;
            case '1':
            default:
                visible_type = '公开';
                break;
        }
        $ocLazyLoad.load([public_path+'/js/angular/controller/dialog/visible/SelectVisibleTagController.js']).then(function(){
            ngDialog.openConfirm({
                template: public_path+'/templates/dialog/visible/index.html',
                className: 'ngdialog-theme-default', //弹窗的类名
                controller : 'SelectVisibleTagController',
                preCloseCallback: function(){ //关闭前的触发事件
                    //return confirm('你确定要退出吗？');
                    return true;
                },
                closeByDocument: false, //点击背景关闭弹窗
                closeByEscape: false, //通过键盘Esc按钮关闭弹窗
                showClose: false, //显示关闭按钮
                scope: $scope,
                appendTo: '#edit', //绑定到哪个元素节点
                resolve: { //将所需参数传递给弹窗的控制器
                    params : function(){
                        return {
                            dialog_title : '选择可见性',
                            visible_type:visible_type
                        };
                    }
                }
            }).then(function (value) {
            }, function (reason) {
            });
        }, function(e){
        });
    }
    //-------------- 监听可见性选项变化 --------------
    $scope.onVisibleChange = function(){
        if($scope.post.visible == 2 || $scope.post.visible == 3)$scope.editVisible();
        else {$scope.selected_tags = '';$scope.post.visible_tag = '';}
    }
    //-------------- 设置可见性 --------------
    $scope.setPieceVisible = function(visible){
      $scope.post.visible = visible+'';
      $scope.onVisibleChange();
    }
    //--------------- 监听可见性弹窗返回结果 -------------
    $scope.$on('visibleDialogReturn',function(event,mass){
        console.log(mass);
        if(mass.action == 'cancel' && $scope.action == 'new'){
            $scope.post.visible = '1';
            $scope.selected_tags = '';
            $scope.post.visible_tag = '';
        }else if(mass.action == 'confirm'){
            //$scope.selected_tags = '#'+mass.selected_tags.join('#');
            $scope.post.visible_tag = _.pluck(mass.selected_tags,'id').toString();
            $scope.selected_tags = '#'+_.pluck(mass.selected_tags,'name').join('#');
        }
    });
    //-------------- 设置归档 --------------
    $scope.setArchive = function(index,id){
      $scope.post.archive = id;
    }
    //--------------- 监听归档弹窗返回结果 -------------
    $scope.$on('archiveDialogReturn',function(event,mass){
        console.log(mass);
        if(mass.action == 'cancel'){
            //更新归档信息
            $http({
                method:'POST',
                url:home_path+'/Archive/getList.html',
                data:{}
            }).success(function(res){
                console.log(res);
                if(res.error === 0){
                    $scope.archiveItems = res.archives;
                }else{hMessage(res.msg);}
            });
        }
    });
    //-------------- 编辑归档 --------------
    $scope.editArchive = function(){
        $ocLazyLoad.load([public_path+'/js/angular/controller/dialog/archive/ArchiveListController.js']).then(function(){
            ngDialog.openConfirm({
                template: public_path+'/templates/dialog/archive/list.html',
                className: 'ngdialog-theme-default', //弹窗的类名
                controller : 'ArchiveListController',
                preCloseCallback: function(){ //关闭前的触发事件
                    //return confirm('你确定要退出吗？');
                    return true;
                },
                closeByDocument: false, //点击背景关闭弹窗
                closeByEscape: false, //通过键盘Esc按钮关闭弹窗
                showClose: false, //显示关闭按钮
                scope: $scope,
                appendTo: 'body', //绑定到哪个元素节点
                resolve: { //将所需参数传递给弹窗的控制器
                    params : function(){
                        return {
                            dialog_title : '归档',
                        };
                    }
                }
            }).then(function (value) {
            }, function (reason) {
            });
        }, function(e){
        });
    }
    //-------------- 是否同时发布碎片 --------------
    $scope.setPieceCheck = function(){
      $scope.post.piece_check = !$scope.post.piece_check;
    }
    //-------------- 更换编辑器 --------------
    $scope.changeEditor = function(){
        //如果要转为普通编辑器需要异步加载脚本文件
        if($scope.current_editor=='markdown'){
            $ocLazyLoad.load([public_path+'/editor/kindeditor-min.js',public_path+'/editor/themes/simple/simple.css']).then(function(){
                //动态创建编辑器
                var essay_content = essay_md_editor.getHTML();
                $scope.current_editor = 'regular';
                window.essay_editor = KindEditor.create('#essay-editor',regular_essay_editor_opt);
                console.log('进入异步加载了');
                essay_editor.html(essay_content);
                $scope.post.content = essay_content;
                var ke_container = document.getElementsByClassName('ke-container')[0];
                if(ke_container !== undefined)ke_container.style.cssText = 'display:block;';
            },function(e){
                console.log('普通编辑器加载出错！');
                return;
            });
        }else {
            $scope.post.content = toMarkdown(window.essay_editor.html());
            essay_md_editor.setMarkdown($scope.post.content);
            $scope.current_editor = 'markdown';
            document.getElementsByClassName('ke-container')[0].style.cssText = 'display:none;';
            window.essay_editor = null;
        }
    }
}]);

heysoo.register.controller('c_piece_publisher',function($scope,$rootScope,$state,$http,Music){
    $scope.piece_visible = "1";//可见性
    $scope.piece_type = "piece";
    $scope.piece_tag = '';
    $scope.edit_song_key = '';
    $scope.post_piece_check = false;//是否同时发布碎片
    //设置可见性
    $scope.setPieceVisible = function(visible){
      $scope.piece_visible = visible+'';
    }
    //查找音乐
    $scope.searchSong = function(){
      if(isEmpty($scope.edit_song_key)){hMessage("输入不能为空！");return;}
      $rootScope.song_search_tip = '查询中...';
      $rootScope.current_editor = window.piece_editor;
      $rootScope.search_songs = new Array();
      Music.search($scope.edit_song_key).success(function(res){
        if(res.songs.length){
          $rootScope.search_songs = res.songs;
          var songs_num = res.songs.length;
          $rootScope.song_search_tip = '共找到 '+ songs_num +' 首相关歌曲';
          $rootScope.song_search_tip_show = true;
        }
        else {$rootScope.song_search_tip_show = true;$rootScope.song_search_tip = '无相关歌曲';}
      });
    }
    
    $scope.postPiece = function(){
      $scope.piece_content = window.piece_editor.getHTML();//获取markdown编辑器的html
      /*console.log({
          'title':'',
          'tag':$scope.piece_tag,
          'type':$scope.piece_type,
          'visible':$scope.piece_visible,
          'content':$scope.piece_content,
          'post_piece':$scope.post_piece_check
        });*/
      $http({
        method:'POST',
        url:home_path+"/Action/ng_deal_post.html",
        data:{
          'title':'',
          'tag':$scope.piece_tag,
          'type':$scope.piece_type,
          'visible':$scope.piece_visible,
          'content':$scope.piece_content,
          'post_piece':$scope.post_piece_check
        }
      }).success(function(res){
        console.log(res);
        if(res.error === 0){
          hMessage(res.msg);
          window.piece_editor.setValue('');//将编辑器内容置空
          $rootScope.togglePublisher();
          if($scope.piece_type == 'essay')
            $state.go('view',{id:res.id});
          else{
            $http.get(home_path+"/Index/ng_index.html").success(function(res){
              $rootScope.index_items = res;
            });
            $state.go('home');
          }
        }else{hMessage(res.msg);}
      });
    }
});
heysoo.register.controller('c_song_search',function($scope,$rootScope){
  //往编辑器插入音乐
  $scope.insertMusicBox = function(song_id){
    music_frame = '<iframe class="netease-music" frameborder="no" border="0" marginwidth="0" marginheight="0" min-width='+music_player_width+' height=86 src="http://music.163.com/outchain/player?type=2&id='+song_id+'&auto=0&height=66"></iframe>';
    //edit_post.appendHtml(music_frame);
    $rootScope.current_editor.insertValue(music_frame);
    $('#song_search_modal').modal('toggle');
  }
});
//设置控制器
heysoo.register.controller('c_setting',function($scope,$state,$http){
  $scope.settingSwitchTab = function(tab){
    $scope.setting_tab = tab;
    $state.go("setting_"+tab);
  }
});
/**setting*/
heysoo.register.controller('c_setting_profile',function($scope,$rootScope,$http,$state){
  $scope.invite_code = $rootScope.user_info.invite_code;

  $scope.modifyProfile = function(option){
    $("#setting_profile_modal_"+option).modal('toggle');
  }
  //生成邀请码
  $scope.createInviteCode = function(){
    $http.get(home_path+"/User/create_invite_code.html").success(function(res){
      if(res.error === 0){
        $scope.invite_code = res.invite_code;
        //hMessage(res.msg);
      }else hMessage(res.msg);
    });
  }
})
heysoo.register.controller('c_setting_interface',function($scope,$rootScope,$http,$state){
  $scope.modifyInterface = function(option){
    $("#setting_interface_modal_"+option).modal('toggle');
  }
});
//管理对话框
heysoo.register.controller('c_setting_profile_modal',function($scope,$rootScope,$http){
  $scope.new_username = $scope.new_signature = '';
  $scope.modifyUserName = function(option){
    $("#setting_profile_modal_"+option).modal('toggle');
    $http({
          method:'POST',
          url:home_path+"/User/modify_userName.html",
          data:{'new_username':$scope.new_username}
        }).success(function(res){
          if(res.error === 0){
            $rootScope.user_info.username = $scope.new_username;
            hMessage('用户名已成功修改为：'+$scope.new_username);
          }else{hMessage(res.msg);}
    });
  }
  $scope.modifySignature = function(option){
    $("#setting_profile_modal_"+option).modal('toggle');
    $http({
          method:'POST',
          url:home_path+"/User/modify_signature.html",
          data:{'new_signature':$scope.new_signature}
        }).success(function(res){
          if(res.error === 0){
            $rootScope.user_info.signature = $scope.new_signature;
            hMessage('签名已成功修改为：'+$scope.new_signature);
          }else{hMessage(res.msg);}
    });
  }
});
heysoo.register.controller('c_setting_interface_modal',function($scope,$http,$rootScope,ipCookie){
  $scope.interface_color = 'primary';
  $scope.interface_mainBg = "bg_day";
  $scope.interface_sideBarBg = "bg_sidebar_lake";
  $scope.modifyTheme = function(option){
    $("#setting_interface_modal_"+option).modal('toggle');
    hMessage('主题定制中，请耐心等候...');
  }
  $scope.modifyColor = function(option){
    $("#setting_interface_modal_"+option).modal('toggle');
    //修改主题颜色
    $http.get(home_path+"/User/modify_interface_color.html?interface_color="+$scope.interface_color).success(function(res){
      hMessage(res.msg);
    });
    $rootScope.interface_color = $scope.interface_color;
    ipCookie('interface_color',$scope.interface_color);
  }
  $scope.modifySidebarBg = function(option){
    $http.get(home_path+"/User/modify_bg.html?type=sidebar&select="+$scope.interface_sideBarBg).success(function(res){
      if(res.error === 0){
        $rootScope.sideBarBg = res.url;
        hMessage(res.msg);
      }
      else hMessage(res.msg);
    });
    $("#setting_interface_modal_"+option).modal('toggle');
  }
  $scope.modifyMainBg = function(option){
    $http.get(home_path+"/User/modify_bg.html?type=mainBg&select="+$scope.interface_mainBg).success(function(res){
      if(res.error === 0){
        $rootScope.mainBg = res.url;
        hMessage(res.msg);
      }
      else hMessage(res.msg);
    });
    $("#setting_interface_modal_"+option).modal('toggle');
  }
});
heysoo.register.controller('c_setting_privacy_modal',function($scope,$http){
  //
});
heysoo.register.controller('c_setting_push_modal',function($scope,$http){
  //
});
//reset password 重置密码
heysoo.register.controller('c_reset_passwd',function($scope,$http){
  $scope.old_passwd = $scope.new_passwd = '';
  $scope.resetPasswd = function(){
    if($scope.old_passwd === '' || $scope.new_passwd === ''){hMessage('密码不能为空！');return;}
    else if($scope.old_passwd === $scope.new_passwd){hMessage('新旧密码不能一样！');return;}
    var url = home_path+"/User/reset_passwd.html";
    $http({
          method:'POST',
          url:url,
          data:{'old_passwd':$scope.old_passwd,'new_passwd':$scope.new_passwd}
        }).success(function(res){
          if(res.error === 0){
            hMessage(res.msg);
            setTimeout(function(){window.location.href=home_path+"/Action/logout.html";},2000);
          }else hMessage(res.msg);
      });
  }
});
//modify user avatar 修改头像
heysoo.register.controller('c_modify_avatar',function($scope,$rootScope,$http,$interval){
  //$scope.selectAvatarBtn = "选择头像";
  $scope.selectAvatar = function(){
    document.getElementById("new_avatar").click();
  }
  $scope.new_avatar = null;
  $scope.uploadAvatarBtn = "上传";
  //获取并设置七牛token
  $http.get(get_token_path+"?upload_type=avatar").success(function(res){
    $scope.upload_avatar_token = res.token;
  });
  //定时获取文件名
  var get_image_name = $interval(function(){
    if(document.getElementById('new_avatar').files[0]){
      document.getElementById('avatar-file-name').innerHTML = document.getElementById('new_avatar').files[0].name;
    }
  },200);
  $scope.uploadAvatar = function(){
    //获取并设置七牛token
    $http.get(get_token_path+"?upload_type=avatar").success(function(res){
      $scope.upload_avatar_token = res.token;
    });
    var uploadable = true;
    var checkTime=200;
    //先检查文件，判空，类型和大小
    var imgFile = document.getElementById("new_avatar").files[0];
    if(imgFile == null){hMessage('请先选择图片！');uploadable = false;}else{
        if(imgFile.type != "image/jpeg" && imgFile.type != "image/jpg" && imgFile.type != "image/png" && uploadable){hMessage('请选择正确的图片格式：jpeg,jpg,png！'); uploadable = false;}
        var imgSize = imgFile.size / (1024*1024);
        if(imgSize > 2 && uploadable){hMessage('上传图片请限制在2M以内！'); uploadable = false;}
    }

   //执行上传操作
      if(uploadable){
        $(".upload-avatar-form").submit();
        $scope.uploadAvatarBtn = "上传中...";
        var stop = $interval(function(){
          if($(window.frames["upload_avatar_ifm"].document).find('pre').html() != undefined)
          {
            var callback = JSON.parse($(window.frames["upload_avatar_ifm"].document).find('pre').html());
            if(callback.error == 0){
              $rootScope.avatar = callback.url;
              $scope.uploadAvatarBtn = "上传成功！";
              hMessage('上传成功！');
              //同步数据库
              var url = home_path+"/User/updateAvatar.html?new_avatar="+$rootScope.avatar;
              $http.get(url).success(function(res){
                $scope.uploadAvatarBtn = "上传";
                if(res.error == 0){
                        console.log('同步成功！');
                  }else console.log('同步失败！');
              });
            }else hMessage('头像修改失败，请稍后重试！');
           $(window.frames["upload_avatar_ifm"].document).find('pre').html('');
            $interval.cancel(stop);
          }
      },checkTime);
    }
    $interval.cancel(get_image_name);
  }
});
/**setting_push*/
heysoo.register.controller('c_setting_push',function($scope,$rootScope,$http){
  $rootScope.user_config.push_comment = $rootScope.user_config.push_comment=='1'?true:false;
  $rootScope.user_config.push_at = $rootScope.user_config.push_at=='1'?true:false;
  $rootScope.user_config.push_whisper = $rootScope.user_config.push_whisper=='1'?true:false;
  $rootScope.user_config.push_notice = $rootScope.user_config.push_notice=='1'?true:false;
 
  $scope.savePush = function(){
    $http({
        method:'POST',
        url:home_path+"/User/modify_push.html",
        data:{
          'comment_on':$rootScope.user_config.push_comment?1:0,
          'at_on':$rootScope.user_config.push_at?1:0,
          'whisper_on':$rootScope.user_config.push_whisper?1:0,
          'notice_on':$rootScope.user_config.push_notice?1:0
        }
      }).success(function(res){
        if(res.error === 0){
          hMessage(res.msg);
        }else{hMessage(res.msg);}
      });
  }
});
/**setting_privacy*/
heysoo.register.controller('c_setting_privacy',function($scope,$rootScope,$http){
  $rootScope.user_config.privacy_followable = $rootScope.user_config.privacy_followable=='1'?true:false;
  $rootScope.user_config.privacy_visitable = $rootScope.user_config.privacy_visitable=='1'?true:false;
  $rootScope.user_config.privacy_essay_comment = $rootScope.user_config.privacy_essay_comment=='1'?true:false;
  $rootScope.user_config.privacy_piece_comment = $rootScope.user_config.privacy_piece_comment=='1'?true:false;
  $scope.savePrivacy = function(){
    $http({
        method:'POST',
        url:home_path+"/User/modify_privacy.html",
        data:{
          'followable':$rootScope.user_config.privacy_followable?1:0,
          'visitable':$rootScope.user_config.privacy_visitable?1:0,
          'essay_comment':$rootScope.user_config.privacy_essay_comment?1:0,
          'piece_comment':$rootScope.user_config.privacy_piece_comment?1:0
        }
      }).success(function(res){
        if(res.error === 0){
          hMessage(res.msg);
        }else{hMessage(res.msg);}
      });
  }
});
//controller of tag
heysoo.register.controller('c_tag',function($scope,$rootScope,$state,$http){
  $rootScope.tag_tab = "essay";
  $rootScope.tag_tip = true;
  $http.get(home_path+"/User/get_user_tag.html?type=essay").success(function(res){
    if(res.error === 0){
      $rootScope.tag_items = res.items;
      if(res.items.length > 0)$rootScope.tag_tip = false;
    }
  });
  $state.go("tag_essay");
  $scope.tagSwitchTab = function(tab,id){
    $rootScope.tag_tab = tab;
    $http.get(home_path+"/User/get_user_tag.html?type="+tab).success(function(res){
      if(res.error === 0){
        $rootScope.tag_items = res.items;
        if(res.items.length > 0)$rootScope.tag_tip = false;
        else $rootScope.tag_tip = true;
      }
    });
    $state.go("tag_"+tab);
  }
  $scope.newTagModal = function(type){
    $("#tag_new_modal").modal('toggle');
  }
  $scope.newTag = function(type){
    $("#tag_new_modal").modal('toggle');
    hMessage('创建成功！');
  }
  //移除标签
  $scope.removeTag = function(tag_id){
    $("#tag_"+tag_id).remove();
    hMessage('移除成功！');
  }
});
heysoo.register.controller('c_tag_essay',function($scope,$rootScope,$http){
 //
});
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