heysoo.controller('c_view',function($scope,$rootScope,$http,$stateParams){
  $scope.essay_view_tip_show = false;
  $rootScope.reply_to_id = $rootScope.parent_cmt_id = null;
  url = home_path+"/Essay/ng_view.html?id="+$stateParams.id;
  progress_bar.start();
  //动态创建editor
  window.essay_comment_editor = editormd("essay-comment-editor", essay_comment_editor_opt);

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
    window.essay_comment_reply_editor = editormd("essay-comment-reply-editor", essay_comment_reply_editor_opt);
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
      essay_modify_editor_opt.value = res.items.content?res.items.content:'';
      window.essay_modify_editor = editormd("essay-modify-editor", essay_modify_editor_opt);
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