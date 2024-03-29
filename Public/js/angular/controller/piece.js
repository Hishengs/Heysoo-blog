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