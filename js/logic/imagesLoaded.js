$('.container#log').imagesLoaded( '.tile' ).always(function(){
	d3.select('#loading-animation').classed('hide',true);
	d3.select('.container#log').classed('hide',false).classed('show',true);
});