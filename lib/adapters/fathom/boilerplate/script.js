$(function(){
	window.fathom = new Fathom('#presentation', {
		displayMode: 'multi',
		margin: 50,
		scrollLength: 800,
		portable: false
	});
	
	$('pre').addClass('prettyprint').addClass('linenums');
	
	prettyPrint();
});