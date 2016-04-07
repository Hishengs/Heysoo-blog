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