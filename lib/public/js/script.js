var socket = io && io.connect('http://localhost');

$(function(){
	var fathom = new Fathom('#presentation', {
		displayMode: 'multi',
		margin: 50,
		scrollLength: 800
	});
	
	$('pre').addClass('prettyprint').addClass('linenums');
	
	prettyPrint();

	if (socket) {
		$('div.slide').on('activateslide.fathom', function(){
			var data = {
				index: $(this).index()
			};

			socket.emit('activateslide', data);
		});

		socket.on('activateslide', function (data) {
			fathom.scrollToSlide( $('div.slide').eq(data.index) );
		});
	}
});