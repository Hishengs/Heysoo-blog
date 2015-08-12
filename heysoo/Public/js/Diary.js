function getDiaryPage(url,objId){
	showContentMask(objId);
	$.ajax({
		url:url,
		type:'GET',
		data:{},
		dataType:'json',
		success:function(data){
			$("#"+objId).html(data);
			//console.log(data);
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			alert(errorThrown);
		}
	});
}