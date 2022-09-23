var Layout_Slides = function(){

	return {
		posts:JEKYLL_ARRAY,
		posts_display:[],

		display_settings:{
			elementHeight:window.innerHeight *0.8,
			img_marginH:120,
			img_marginV:0
		},

		// media_cutoff:750,

		// grid_settings:{
		// 	containerWidth:window.innerWidth <this.media_cutoff ? this.media_cutoff : (window.innerWidth +2),
		// 	idealElementHeight:500,
		// 	spacing:30
		// },

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

		//recompute image widths, etc.
		processData:function(){

			var self = vis;

			self.posts_display = JSON.parse(JSON.stringify(self.posts));
			self.posts_display.forEach(function(d,i){
				d.display = {};
				d.display.images = [];

				d.display.pane_w = 0;
				d.images.forEach(function(_d,_i){

					var obj = {};
					var w_orig = parseFloat(_d.width),
							h_orig = parseFloat(_d.height);

					obj.width = w_orig*(self.display_settings.elementHeight/h_orig);
					obj.height = self.display_settings.elementHeight;
					obj.ext = _d.ext;
					obj.meta = _d.meta;
					obj.path = _d.path;

					d.display.images.push(obj);
					d.display.pane_w +=obj.width;
				});

				d.display.pane_w +=(d.display.images.length*(self.display_settings.img_marginH*2));
				d.display.pane_h = self.display_settings.elementHeight;
			});
		},

		//layout logic
		generatePanes:function(){
			
			var panes,
					sliders,
					images;

			panes = vis.c.selectAll('div.pane')
				.data(vis.posts_display)
				.join(
						function(enter){
							return enter.append('div')
								.classed('pane',true)
								.style('height',function(d){ return d.display.pane_h +'px'; })
								.style('padding',function(d){ return (window.innerHeight -d.display.pane_h)/2 +'px 0'; });
						}
				);

			sliders = panes.selectAll('div.slider')
				.data(function(d){ return [d]; })
				.join(
						function(enter){
							return enter.append('div')
								.classed('slider',true)
								.style('width',function(d,i){ return d.display.pane_w +'px'; })
								.style('height',function(d){ return d.display.pane_h +'px'; });
						}
				);

			images = sliders.selectAll('img.tile')
				.data(function(d){ return d.display.images; })
				.join(
						function(enter){
							return enter.append('img')
								.classed('tile',true)
								.attr('src',function(d){ return d.path; })
								.style('width',function(d){ return d.width +'px'; })
								.style('height',function(d){ return d.height +'px'; })
								.style('margin',function(){
									var m_t = vis.display_settings.img_marginV +'px',
											m_r = vis.display_settings.img_marginH +'px';
									return m_t +' ' +m_r;
								});
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
vis.processData();
vis.generatePanes();

window.onresize = function(){
	// vis.grid_settings.containerWidth = window.innerWidth <vis.media_cutoff ? vis.media_cutoff : (window.innerWidth +2);
	// vis.generateGridDimensions(vis.grid_settings, vis.tiles);
}
