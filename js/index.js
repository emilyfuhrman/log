var Layout_Slides = function(){

	return {
		posts:JEKYLL_ARRAY,
		panes:[],
		tags:[],

		media_cutoff:750,
		grid_settings:{
			containerWidth:window.innerWidth <this.media_cutoff ? this.media_cutoff : (window.innerWidth +2),
			idealElementHeight:500,
			spacing:30
		},

		c_jq:$('.container#log'),
		c:d3.select('.container#log'),
		l:d3.select('#loading-animation'),

		hideGrid:function(){
			vis.l.classed('hide',false);
			vis.c.classed('hide',true).classed('show',false);
		},
		showGrid:function(){
			vis.l.classed('hide',true);
			vis.c.classed('hide',false).classed('show',true);
		},

		//layout logic
		generatePanes:function(){
			
			var panes,
					sliders,
					images;

			panes = vis.c.selectAll('div.pane')
				.data(vis.posts)
				.join(
						function(enter){
							return enter.append('div')
								.classed('pane',true);
						}
				);

			sliders = panes.selectAll('div.slider')
				.data(function(d){ return [d.images]; })
				.join(
						function(enter){
							return enter.append('div')
								.classed('slider',true);
						}
				);

			images = sliders.selectAll('img.tile')
				.data(function(d){ return d; })
				.join(
						function(enter){
							return enter.append('img')
								.classed('tile',true)
								.attr('src',function(d){ return d.path; });
						},
						function(update){
							return update
								.attr('src',function(d){ return d.path; });
						}
				);

			vis.c_jq.imagesLoaded( '.tile' ).always(function(){
				vis.showGrid();
			});

		// tiles = vis.c
		// 	.selectAll(elem_selector)
		// 	.data(_data)
		// 	.join(
		// 		function(enter){
		// 			return enter.append(elem)
		// 				.classed('tile',true)
		// 				.attr('href',function(d){ return d.tile.url || null; })
		// 				.style('width',function(d){ return d.width +'px'; })
		// 				.style('height',function(d){ return window.innerWidth >vis.media_cutoff ? d.height +'px' : ((parseInt(d.tile.height)/parseInt(d.tile.width))*window.innerWidth) +'px'; })
		// 				.style('left',function(d){ return d.x +'px'; })
		// 				.style('top',function(d){ return d.y +'px'; })
		// 				.style('background-image',function(d){ return 'url("' +d.tile.img_src +'")'; })
		// 				;
		// 		},
		// 		function(update){
		// 			return update
		// 				.attr('href',function(d){ return d.tile.url; })
		// 				.style('opacity',0)
		// 				.style('width',function(d){ return d.width +'px'; })
		// 				.style('height',function(d){ return window.innerWidth >vis.media_cutoff ? d.height +'px' : ((parseInt(d.tile.height)/parseInt(d.tile.width))*window.innerWidth) +'px'; })
		// 				.style('left',function(d){ return d.x +'px'; })
		// 				.style('top',function(d){ return d.y +'px'; })
		// 				.style('background-image',function(d){ return 'url("' +d.tile.img_src +'")'; })
		// 				.transition()
		// 				.duration(360)
  //  					.ease(d3.easeLinear)
		// 				.style('opacity',1);
		// 		}
		// 	);

		}
	}
}

var vis = Layout_Slides();
vis.generatePanes();

window.onresize = function(){
	// vis.grid_settings.containerWidth = window.innerWidth <vis.media_cutoff ? vis.media_cutoff : (window.innerWidth +2);
	// vis.generateGridDimensions(vis.grid_settings, vis.tiles);
}
