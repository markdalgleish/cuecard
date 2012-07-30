var socket = io && io.connect();

if (socket) {
	socket.on('activateslide', function (data) {
		console.log(data);
		Reveal.navigateTo(data.indexh, data.indexv);
	});
}