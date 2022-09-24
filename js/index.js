var Layout_Slides = function(){

	return {
		posts:JEKYLL_ARRAY,
		posts_display:[],

		display_settings:{
			cell_w:window.innerHeight,
			img_height:window.innerHeight *0.8
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

		//recompute image widths, etc.
		processData:function(){

			var self = vis;
			var maxW = 0;

			self.posts_display = JSON.parse(JSON.stringify(self.posts));
			self.posts_display.forEach(function(d,i){
				d.display = {};
				d.display.images = [];

				d.display.pane_w = 0;
				d.images.forEach(function(_d,_i){

					var img_obj = {};
					var w_orig = parseFloat(_d.width),
							h_orig = parseFloat(_d.height);

					img_obj.width = w_orig*(self.display_settings.img_height/h_orig);
					img_obj.height = self.display_settings.img_height;
					img_obj.ext = _d.ext;
					img_obj.meta = _d.meta;
					img_obj.path = _d.path;

					d.display.images.push(img_obj);
					self.display_settings.cell_w = 
						img_obj.width >self.display_settings.cell_w ? img_obj.width : self.display_settings.cell_w;
				});
			});
			self.posts_display.forEach(function(d,i){
				d.display.pane_w = d.display.images.length*self.display_settings.cell_w;
				d.display.pane_h = self.display_settings.img_height;
			});
		},

		//layout logic
		generatePanes:function(){

			var self = vis;
			var panes,
					sliders,
					imageCells,
					images;

			panes = self.c.selectAll('div.pane')
				.data(self.posts_display)
				.join(
					function(enter){
						return enter.append('div')
							.classed('pane',true)
							.style('height',function(d){ return d.display.pane_h +'px'; });
					}
				);

			sliders = panes.selectAll('div.slider')
				.data(function(d){ return [d]; })
				.join(
					function(enter){
						return enter.append('div')
							.classed('slider',true)
							.style('width',function(d,i){ return d.display.pane_w +'px'; })
							.style('height',function(d){ return d.display.pane_h +'px'; })
							.style('left',function(d){return (d.display.pane_w/4)*-1 +'px'; })
							;
					}
				);

			imageCells = sliders.selectAll('div.imageCell')
				.data(function(d){ return d.display.images; })
				.join(
					function(enter){
						return enter.append('div')
							.classed('imageCell',true)
							.style('width',function(d){ return self.display_settings.cell_w +'px'; })
							.style('height',function(d){ return self.display_settings.img_height +'px'; })
							;
					}
				);

			images = imageCells.selectAll('img.tile')
				.data(function(d){ return [d]; })
				.join(
					function(enter){
						return enter.append('img')
							.classed('tile',true)
							.attr('src',function(d){ return d.path; })
							.style('width',function(d){ return d.width +'px'; })
							.style('padding',function(d){ return '0 ' +(self.display_settings.cell_w -d.width)/2 +'px'; })
							;
					}
				);

			panes.selectAll('div.arr')
				.data(function(d){
					return d.display.images.length >2 ? ['l','r'] : false;
				})
				.join(
					function(enter){
						return enter.append('div')
							.attr('class',function(d){ return 'arr ' +d; })
							.style('margin-top',function(d){ 
								return (self.display_settings.img_height/2)*-1 -40/2 -20 +'px'; 
							})
							.on('click',function(d){

							});
					}
				);

			self.c_jq.imagesLoaded( '.tile' ).always(function(){
				self.showGrid();
			});

		},

		advanceSlider:function(_dir){

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
