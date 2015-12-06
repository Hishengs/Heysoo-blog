
//用户相关的服务
heysoo.service('User',function($http){
	//获取用户相关配置项
	this.getUserConfig = function(){
		return $http({
			method:'GET',
			url:home_path+"/User/ng_get_user_config.html"
		});
	}
});
//碎片服务
heysoo.service('Piece',function($http){
	//获取主页的碎片信息
	
	//删除碎片
	this.delete = function(piece_id){
		return $http({
			method:'POST',
			url:home_path+"/Piece/delete.html",
			data:{piece_id:piece_id}
		});
	}
	//获取碎片评论
	this.getPieceComments = function(piece_id){
		return $http({
			method:'GET',
			url:home_path+"/Piece/get_piece_comment.html?piece_id="+piece_id
		});
	}
	//提交碎片评论
	this.postComment = function(comment){
		return $http({
			method:'POST',
			url:home_path+"/Piece/post_comment.html",
			data:comment
		});
	}
	//删除碎片评论
	this.deleteComment = function(comment_id){
		return $http({
			method:'POST',
			url:home_path+"/Piece/delete_comment.html",
			data:{comment_id:comment_id}
		});
	}
});






//Netease Music Service
heysoo.service('Music',function($http){
	//查找歌曲
	this.search = function(key){
		return $http({
			url:home_path+'/Essay/song_search.html?s_key='+key,
			method:'GET'
		});
	}
});