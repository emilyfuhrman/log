//image container and layout parameters
var $content = $('.container#log');
var gridSettings = {
	containerWidth:  window.innerWidth +2,
	columnCount:     2,
	spacing:         10
}

//image layout logic
//via: https://github.com/naturalatlas/image-layout/blob/master/examples/index.js
function generateGrid(options, images) {

	// calculate positioning
	var photoset = document.createElement('div');
	photoset.className = 'photos';
	// var result = layout(images, options);
	var result = layout_fixedPartition(images, options);

	// build html
	var elements = [];
	var positions = result.positions;
	for (var i = 0, n = positions.length; i < n; i++) {
		elements.push('<div class="tile" style="background-image:url(' + images[i].src + ');width:' + positions[i].width + 'px;height:' + positions[i].height + 'px;left:' + positions[i].x + 'px;top:' + positions[i].y + 'px;position:absolute;"><div id="caption"><span id="meta">' + images[i].meta + '</span><span id="year">' + images[i].post_year + '</span></div></div>');
	}
	photoset.innerHTML = elements.join('');
	photoset.style.width = result.width + 'px';
	photoset.style.height = result.height + 'px';

	var container = document.getElementById('log');
	container.appendChild(photoset);
}

generateGrid(gridSettings, JEKYLL_POST_IMAGES);

//run everything once images are loaded
$content.imagesLoaded({ background: '.tile' }).always(function(){
	$('#loading-animation').addClass('hide');
	$content.addClass('show');
});
