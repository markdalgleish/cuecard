var socket = io && io.connect();

$(function(){
	$('#cuecard-toolbar button.prev').click(function(){
		window.fathom.prevSlide();
	});

	$('#cuecard-toolbar button.next').click(function(){
		window.fathom.nextSlide();
	});

	if (socket) {
		$('div.slide').on('activateslide.fathom', function(){
			var data = {
				index: $(this).index()
			};

			socket.emit('activateslide', data);
		});
	}
});