//image container and layout parameters
var $content = $('.container#log');
var gridSettings = {
	containerWidth:  window.innerWidth <1000 ? 1000 : (window.innerWidth +2),
	columnCount:     2,
	spacing:         10
}
var active_tag = null;
var posts = JEKYLL_POST_IMAGES;

//image layout logic
//via: https://github.com/naturalatlas/image-layout/blob/master/examples/index.js
function generateGrid(options, images) {

	// check if previously-created div exists
	var _photoset = document.getElementById('photoset');

	// calculate positioning
	var photoset = document.createElement('div');
	photoset.setAttribute('id','photoset');
	photoset.setAttribute('class','photos');
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

	if(_photoset){
		container.replaceChild(photoset, _photoset);
	} else{
		container.appendChild(photoset);
	}

	//run everything once images are loaded
	$content.imagesLoaded({ background: '.tile' }).always(function(){
		$('#loading-animation').addClass('hide').removeClass('show');
		$content.addClass('show').removeClass('hide');
	});
	
}

//tag logic
//via: https://esthermakes.tech/blog/2015/03/18/filtering-posts-by-tags-with-jekyll/
function filter(tag) {
	event.preventDefault();

	//deselect if tag is already selected
	active_tag = active_tag == tag ? null : tag;

	setActiveTag(active_tag);
	filterPosts(active_tag);
}

function setActiveTag(_tag) {

	//loop through all tag items and remove active class
	var items = document.getElementsByClassName('blog-tag-item');
	for(var i=0; i<items.length; i++){
		items[i].setAttribute('class','blog-tag-item');
	}

	if(_tag){
		//set select tag's item to active
		var item = document.getElementById(_tag + '-item');
		if(item){
			item.setAttribute('class','blog-tag-item active');
		}
	}

}

//filter posts by tag
function filterPosts(_tag) {
	if(_tag){
		posts = [];
		JEKYLL_POST_IMAGES.forEach(function(d){
			if(d.post_tags.includes(_tag)){
				posts.push(d);
			}
		});
	} else{
		posts = JEKYLL_POST_IMAGES;
	}
	generateGrid(gridSettings, posts);	
}

generateGrid(gridSettings, posts);

window.onresize = function(){
	gridSettings.containerWidth = window.innerWidth <1000 ? 1000 : (window.innerWidth +2);
	generateGrid(gridSettings, posts);
}
