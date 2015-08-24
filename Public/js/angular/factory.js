/*Factory*/
m_index.factory('Piece', function($http) {
  var Piece = function() {
    this.pieces = [];
    this.busy = false;
    this.end = false;
    this.close = false;
  };

  Piece.prototype.loadMore = function() {
    if(this.close) return;
    if (this.busy) return;
    if(this.end){this.close = true; return;}
    this.busy = true;

    var startNum = $("div.piece").length;
    var url = home_path+"/Index/update_pieces.html?startNum="+startNum;

    $http.get(url).success(function(data) {
      if(data.length < 1)this.end = true;
      var pieces = data;
      for (var i = 0; i < pieces.length; i++) {
        this.pieces.push(pieces[i]);
      }
      this.busy = false;
    }.bind(this));
  };

  return Piece;
});