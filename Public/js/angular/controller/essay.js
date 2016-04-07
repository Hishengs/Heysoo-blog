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