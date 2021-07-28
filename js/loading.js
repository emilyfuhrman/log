//fade in once all images are done
var $content = $('.container#log');

$content.imagesLoaded({ background: '.img-holder' }).always(function(){
	$('#loading-animation').addClass('hide');
	$content.addClass('show');
});