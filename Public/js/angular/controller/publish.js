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
    window.essay_editor = editormd("essay-editor", essay_editor_opt);
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
      if(isEmpty($scope.edit_song_key)){hMessage("输入不能为空！");return;}
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
})
.controller('c_song_search',function($scope,$rootScope){
  //往编辑器插入音乐
  $scope.insertMusicBox = function(song_id){
    music_frame = '<iframe class="netease-music" frameborder="no" border="0" marginwidth="0" marginheight="0" min-width='+music_player_width+' height=86 src="http://music.163.com/outchain/player?type=2&id='+song_id+'&auto=0&height=66"></iframe>';
    //edit_post.appendHtml(music_frame);
    $rootScope.current_editor.insertValue(music_frame);
    $('#song_search_modal').modal('toggle');
  }
});