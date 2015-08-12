function show_user_card(user,url){
	$.ajax({
		url:url,
		type:'GET',
		data:{'user':user},
		dataType:'json',
		success:function(data){
			//console.log(data);
			var html = '<img class="user_card_avatar" src="'+avatar_path+'"><div class="user_card_name">'+data.username+'</div>'+
						'<div class="user_card_signature">'+data.signature+'</div><div class="user_card_action">'+
						'<button class="btn btn-primary btn-block essay"><i class="icon-font"></i> 文章</button>'+
						'<button class="btn btn-primary btn-block diary"><i class="icon-calendar"></i> 日记</button>'+
						'<button class="btn btn-primary btn-block piece"><i class="icon-fire"></i> 碎片</button>'+
						'<button class="btn btn-primary btn-block follow"><i class="icon-plus-sign-alt"></i> 关注他/她</button>'+
						'<button class="btn btn-primary btn-block visit"><i class="icon-eye-open"></i> 访问他/她的主页</button>'+
						'<div>';
			if(!$("#user_card").length>0){
						var user_card = $("<div id='user_card'></div>").html(html);
						$("span.view_userName").append(user_card);
						$("#user_card").show();
			}else{
				$("#user_card").html(html);
				$("#user_card").show();
			}

		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			console.log(user+','+url);
			console.log(XMLHttpRequest);
		}
	});
}
function hide_user_card(){
	$("#user_card").hide();
}
