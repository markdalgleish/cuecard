var socket = io && io.connect();

$(function(){
	if (socket) {
		$('div.slide').on('activateslide.fathom', function(){
			var data = {
				index: $(this).index()
			};

			socket.emit('activateslide', data);
		});
	}
});