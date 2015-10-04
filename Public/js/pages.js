function getEssayPage(essays){
	var html = "";
	for(var i=1;i<essays.length;i++){
	    html += '<div class="essay">'+
				'<div class="essay_left">'+
				'<img class="essay_avatar" src="__PUBLIC__/img/lion.png" title="访问他/她的主页"/>'+
				'</div>'+
				'<div class="essay_right">'+
				'<div class="bg"></div><div class="essay_triangle"></div>'+
				'<div class="essay_info">'+
				'<span class="essay_author">'+essays[i].author+'  </span>'+
				'<span class="essay_date"><i class="icon-calendar"></i> '+essays[i].date+'</span>'+
				'</div>'+
				'<div class="essay_content">'+
				'<a href="javascript:;"><h4>《'+essays[i].title+'》</h4></a>......'+
				'</div>'+
				'<div class="essay_footer"><i class="icon-tag"></i> '+essays[i].tag+'</div>'+
				'</div>'+
				'</div>';
			}
	return html;
}