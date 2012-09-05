var listen = function(server) {
	var io = require('socket.io').listen(server);

	io.sockets.on('connection', function(socket) {

		socket.on('activateslide', function(data) {
			socket.broadcast.emit('activateslide', {
				indexh: typeof data.indexh === 'number' ? data.indexh : undefined,
				indexv: typeof data.indexv === 'number' ? data.indexv : undefined
			});
		});

	});
};

exports.listen = listen;