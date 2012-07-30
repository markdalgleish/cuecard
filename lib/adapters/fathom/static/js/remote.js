var socket = io && io.connect();

$(function(){
	if (socket) {
		$('div.slide').on('activateslide.fathom', function(){
			var data = {
				indexh: $(this).index()
			};

			socket.emit('activateslide', data);
		});
	}
});