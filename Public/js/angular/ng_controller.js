//边栏管理
heysoo.controller('c_sidePanel',function($http,$rootScope,$scope){
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
  //靠近左侧显示
  /*$('body').mousemove(function(e) { 
    var xx = e.originalEvent.x || e.originalEvent.layerX || 0; 
    if(xx <= 20){
      $("#right-panel").css('padding-left','20%');
      $("#top-bar").css('left','20%');
      $("#left-panel").fadeIn(500);
    }
  }); */
  //双击隐藏
  /*$scope.toggleSidePanel = function(){
    $("#left-panel").fadeOut(500,function(){
    $("#right-panel").css('padding-left',0);
    $("#top-bar").css('left',0);
    });
  }*/
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
    $(function(){
      window.piece_editor = editormd("piece-editor", {
              path : public_path+"/editor/meditor/lib/",
              height:250,
              toolbarIcons:function(){
                return ["bold","italic","quote","list-ul","list-ol","hr","link","image","emoji","watch","preview","fullscreen"]
              },
              emoji:true,
              watch:false,
              htmlDecode:"script,a,img",
              saveHTMLToTextarea:true,
              placeholder:"在此输入内容"
          });
    });
    $('#publisher').slideToggle();
  }
});
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
      $('button.index-load-more').html('<i class="hs-icon-spinner"></i> 加载中...');
      $http.get(home_path+"/Index/ng_index.html?index_page="+$scope.index_page).success(function(res){
        $('button.index-load-more').html('<i class="hs-icon-arrow-down"></i> 加载更多');
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
heysoo.controller('c_view',function($scope,$rootScope,$http,$stateParams){
  $scope.essay_view_tip_show = false;
  $rootScope.reply_to_id = $rootScope.parent_cmt_id = null;
  url = home_path+"/Essay/ng_view.html?id="+$stateParams.id;
  progress_bar.start();
  //动态创建editor
  window.essay_comment_editor = editormd("essay-comment-editor", {//评论框
      path : public_path+"/editor/meditor/lib/",
      height:250,
      toolbarIcons:function(){
        return ["link","image","emoji"]
      },
      emoji:true,
      watch:false,
      htmlDecode:"script,a,img",
      saveHTMLToTextarea:true,
      placeholder:"在此输入内容",
      value:''
  });

  $http.get(url).success(function(res){
    if(res.error === 0){
        $scope.essay = res.essay;
        $scope.comments = res.comments;
        if(res.comments.length < 1)$rootScope.essay_comments_tip_show = true;
        else $rootScope.essay_comments_tip_show = false;
        $scope.essay_comment_on = res.essay_comment_on;
        $scope.avatar_path = public_path+"/img/me.jpg";
        $(document).scrollTop(0);
        setLightBox();
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
    window.essay_comment_reply_editor = editormd("essay-comment-reply-editor", {//回复框
        path : public_path+"/editor/meditor/lib/",
        height:250,
        toolbarIcons:function(){
          return ["link","image","emoji"]
        },
        emoji:true,
        watch:false,
        htmlDecode:"script,a,img",
        saveHTMLToTextarea:true,
        placeholder:"在此输入内容",
        value:''
    });
  }
});
//文章修改
heysoo.controller('c_modify',function($scope,$rootScope,$state,$http,Music){
  $scope.post_piece_check = false;
  var url = home_path+"/Action/ng_modify.html";
  //获取文章内容
  $http.get(url,{params:{'type':$rootScope.type,'id':$rootScope.id}}).success(function(res){
      if(res.error === 0){
        //modify_editor.html(res.items.content);
        $scope.essay_title = res.items.title;
        $scope.essay_tag = res.items.tag;
        $scope.essay_visible = res.items.visible;
      }else{hMessage(res.msg);}
      //动态创建editor
      window.essay_modify_editor = editormd("essay-modify-editor", {
          path : public_path+"/editor/meditor/lib/",
          height:550,
          toolbarIcons:function(){
            return ["bold","italic","quote","list-ul","list-ol","hr","link","image","emoji","watch","preview","fullscreen"]
          },
          emoji:true,
          watch:false,
          htmlDecode:"script,a,img",
          saveHTMLToTextarea:true,
          placeholder:"在此输入内容",
          value:res.items.content?res.items.content:'',
          onload:function(){
            window.essay_modify_editor.setValue(toMarkdown(window.essay_modify_editor.getMarkdown()));
            console.log('get markdown!');
            //console.log(window.essay_modify_editor.getMarkdown());
          }
      });
      //window.essay_modify_editor.setValue(res.items.content?res.items.content:'');
  });
  //查找音乐
  $scope.searchSong = function(){
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
    //var content = modify_editor.html();
    var content = window.essay_modify_editor.getHTML();//获取markdown编辑器的html
    $http({
          method:'POST',
          url:home_path+"/Action/ng_deal_modify.html",
          data:{
            'type':$rootScope.type,'id':$rootScope.id,'content':content,
            'title':$scope.essay_title,'tag':$scope.essay_tag,'visible':$scope.essay_visible,
            'post_piece':$scope.post_piece_check
          }
        }).success(function(res){
          if(res.error === 0){
            //清空编辑器
            //modify_editor.html('');
            window.essay_modify_editor.setValue('');//将编辑器内容置空
            hMessage(res.msg);
            window.history.go(-1);
          }else{hMessage(res.msg);}
    });
  }
})
.controller('c_essay_cmt',function($scope,$rootScope,$state,$http){
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
});
//碎片
heysoo.controller('c_piece',function($scope,$state,Piece){
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
        $scope.piece_comment_tip = '';
        $scope.piece_comment_tip_show = false;
      }else {
        $scope.piece_comment_tip_show = true;
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
});

//消息控制器
heysoo.controller('c_message',function($scope,$state,$http){
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
heysoo.controller('c_message_comment',function($scope,$rootScope,$http){
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
heysoo.controller('c_follow',function($scope,$rootScope,$state,$http){
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
});
//文章，碎片，日记发布
heysoo.controller('c_edit',function($scope,$rootScope,$state,$http,Music){
    $scope.edit_visible = "1";//可见性
    $scope.edit_type = "essay";
    $scope.post_piece_check = true;//是否同时发布碎片
    $scope.edit_song_key = '';//查找音乐的关键词
    $scope.songs = new Array();
    $scope.song_search_tip_show = false;
    var url = home_path+"/Action/ng_deal_post.html";//post url
    //动态创建editor
    window.essay_editor = editormd("essay-editor", {
        path : public_path+"/editor/meditor/lib/",
        height:550,
        toolbarIcons:function(){
          return ["bold","italic","quote","list-ul","list-ol","hr","link","image","emoji","watch","preview","fullscreen"]
        },
        emoji:true,
        watch:false,
        htmlDecode:"script,a,img",
        saveHTMLToTextarea:true,
        placeholder:"在此输入内容",
        value:''
    });
    $scope.editPost = function(){
      console.log($scope.post_piece_check);
      $scope.edit_content = window.essay_editor.getHTML();//获取markdown编辑器的html
      /*$scope.edit_content = edit_post.html();*/
      $http({
        method:'POST',
        url:url,
        data:{
          'title':$scope.edit_title,
          'tag':$scope.edit_tag,
          'type':$scope.edit_type,
          'visible':$scope.edit_visible,
          'content':$scope.edit_content,
          'post_piece':$scope.post_piece_check
        }
      }).success(function(res){
        console.log(res);
        if(res.error === 0){
          hMessage(res.msg);
          //edit_post.html('');
          window.essay_editor.setValue('');//将编辑器内容置空
          if($scope.edit_type == 'essay')
            $state.go('view',{id:res.id});
          else
            {$state.go('home');}
        }else{hMessage(res.msg);}
      });
    }
    //查找音乐
    $scope.searchSong = function(){
      $rootScope.song_search_tip = '查询中...';
      $rootScope.current_editor = window.essay_editor;
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
})
.controller('c_piece_publisher',function($scope,$rootScope,$state,$http,Music){
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
})
.controller('c_song_search',function($scope,$rootScope){
  //往编辑器插入音乐
  $scope.insertMusicBox = function(song_id){
    music_frame = '<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=380 height=86 src="http://music.163.com/outchain/player?type=2&id='+song_id+'&auto=0&height=66"></iframe>';
    //edit_post.appendHtml(music_frame);
    $rootScope.current_editor.insertValue(music_frame);
    $('#song_search_modal').modal('toggle');
  }
});
//设置控制器
heysoo.controller('c_setting',function($scope,$state,$http){
  $scope.settingSwitchTab = function(tab){
    $scope.setting_tab = tab;
    $state.go("setting_"+tab);
  }
});
/**setting*/
heysoo.controller('c_setting_profile',function($scope,$rootScope,$http,$state){
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
heysoo.controller('c_setting_interface',function($scope,$rootScope,$http,$state){
  $scope.modifyInterface = function(option){
    $("#setting_interface_modal_"+option).modal('toggle');
  }
});
//管理对话框
heysoo.controller('c_setting_profile_modal',function($scope,$rootScope,$http){
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
heysoo.controller('c_setting_interface_modal',function($scope,$http,$rootScope,ipCookie){
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
heysoo.controller('c_setting_privacy_modal',function($scope,$http){
  //
});
heysoo.controller('c_setting_push_modal',function($scope,$http){
  //
});
//reset password 重置密码
heysoo.controller('c_reset_passwd',function($scope,$http){
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
heysoo.controller('c_modify_avatar',function($scope,$rootScope,$http,$interval){
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
  }
});
/**setting_push*/
heysoo.controller('c_setting_push',function($scope,$rootScope,$http){
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
heysoo.controller('c_setting_privacy',function($scope,$rootScope,$http){
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
heysoo.controller('c_tag',function($scope,$rootScope,$state,$http){
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
heysoo.controller('c_tag_essay',function($scope,$rootScope,$http){
 //
});
