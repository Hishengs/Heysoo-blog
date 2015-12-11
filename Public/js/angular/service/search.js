/*deal with search engine*/
heysoo.service('Search',function($http){
	//搜索文章
	this.searchEssay = function(search_key){
		return $http({
			method:'POST',
			url:home_path+"/Search/search_essay.html",
			data:{'search_key':search_key}
		});
	}
	//搜索碎片
	this.searchPiece = function(search_key){
		return $http({
			method:'POST',
			url:home_path+"/Search/search_piece.html",
			data:{'search_key':search_key}
		});
	}
	//搜索用户
	this.searchUser = function(search_key){
		return $http({
			method:'POST',
			url:home_path+"/Search/search_user.html",
			data:{'search_key':search_key}
		});
	}
});