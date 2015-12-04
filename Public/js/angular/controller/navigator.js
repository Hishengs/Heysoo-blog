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
  $scope.togglePublisher = function(){
    //动态创建一个编辑器
    $(function(){
      var editor = editormd("editormd", {
              path : public_path+"/editor/meditor/lib/",
              height:250,
              toolbarIcons:function(){
                return ["bold","italic","quote","list-ul","list-ol","hr","link","image","emoji","watch","preview","fullscreen"]
              },
              emoji:true,
              watch:false,
              placeholder:"在此输入内容"
          });
    });
    $('#publisher').slideToggle();
  }
});