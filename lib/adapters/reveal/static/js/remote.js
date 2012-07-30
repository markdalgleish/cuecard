var socket = io && io.connect();

if (socket) {
	Reveal.addEventListener('slidechanged', function(e){
		socket.emit('activateslide', {
			indexh: e.indexh,
			indexv: e.indexv
		});
	});
}