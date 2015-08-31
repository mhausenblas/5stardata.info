$(function(){
	$("#show-data").click(function () {

		$("#hint").slideDown("normal");
		
		$("*[about]").each(function (i) {
			$(this).addClass('highlight');
		});
		
		$("#data *[rel]").each(function (i) {
			$(this).addClass('highlight');
		});
		
		$("#data *[property]").each(function (i) {
			$(this).css('border', '1px dotted red');
		});
		
		$(".highlight").hover(
		function () {
			var htmlStr = "";
			if($(this).attr("about") || $(this).attr("rel")) {
				htmlStr = $(this).html();	
			}
			else {
				htmlStr = $(this).parent().html();
			}
			
			
			$("#data-out").text($.trim(htmlStr));
			$("#data-out").slideDown("normal");
		}, 
		function () {
			$("#data-out").slideDown("normal");
	 		$("#data-out").html("");
		  }
		);
	});
});