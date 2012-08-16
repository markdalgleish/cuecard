(function(){
	var socket = io && io.connect();

	$(function(){
		if (socket) {
			socket.on('activateslide', function (data) {
				window.fathom.scrollToSlide( $('div.slide').eq(data.indexh) );
			});
		}
	});
})();