//fade in once all images are done
var $content = $('.container#log');

$content.imagesLoaded().always(function(){
	$('#loading-animation').addClass('hide');
	$content.addClass('show');
});