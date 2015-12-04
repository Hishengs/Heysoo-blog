//文章，碎片，日记发布
heysoo.controller('c_edit',function($scope,$state,$http){
    $scope.edit_visible = "1";//可见性
    $scope.edit_type = "essay";
    $scope.post_piece_check = true;//是否同时发布碎片
    $scope.edit_song_key = '';//查找音乐的关键词
    $scope.songs = new Array();
    $scope.song_search_tip_show = false;
    $scope.song_search_tip = '查询中...';
    var url = home_path+"/Action/ng_deal_post.html";//post url
    $scope.editPost = function(){
      console.log($scope.post_piece_check);
      $scope.edit_content = window.essay_editor.getPreviewedHTML();//获取markdown编辑器的html
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
      $scope.songs = new Array();
      $url = home_path+'/Essay/song_search.html?s_key='+$scope.edit_song_key;
      $http.get($url).success(function(res){
        if(res.songs.length){
          $scope.songs = res.songs;
          var songs_num = res.songs.length;
          $scope.song_search_tip = '共找到 '+ songs_num +' 首相关歌曲';
          $scope.song_search_tip_show = true;
        }
        else {$scope.song_search_tip_show = true;$scope.song_search_tip = '无相关歌曲';}
        //$('#edit_song_search_modal').modal('toggle');
      });
    }
    //往编辑器插入音乐
    $scope.insertMusicBox = function(song_id){
      music_frame = '<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=380 height=86 src="http://music.163.com/outchain/player?type=2&id='+song_id+'&auto=0&height=66"></iframe>';
      edit_post.appendHtml(music_frame);
      $('#edit_song_search_modal').modal('toggle');
    }
});