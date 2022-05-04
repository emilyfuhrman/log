var generate = function(){

	return {
		tiles:JEKYLL_ARRAY,
		tags:[],
		active_tag:null,

		media_cutoff:750,
		grid_settings:{
			containerWidth:window.innerWidth <this.media_cutoff ? this.media_cutoff : (window.innerWidth +2),
			idealElementHeight:550,
			spacing:1
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

		//generate UI
		setup:function(){

			vis.tiles.forEach(function(d,i){
				d.tags.forEach(function(_d,_i){
					if(vis.tags.indexOf(_d) <0){
						vis.tags.push(_d);
					}
				});
			});
			vis.tags.sort().reverse();

			d3.select('#tag-container')
				.selectAll('div.blog-tag-item')
				.data(vis.tags)
				.join(
					function(enter){
						return enter.append('div')
							.classed('blog-tag-item',true)
							.classed('no-click',function(d){ return vis.tiles[0].type !== 'index'; })
							.append('a')
								.html(function(d){ return d; })
							.on('click',function(d){
								
								var t = this.__data__,
										p = d3.select(this.parentNode);

								vis.setTag(t,p);
								vis.filterTiles();
							});
					}
				);
		},

		//grid layout logic
		//SOURCE: https://github.com/naturalatlas/image-layout/blob/master/examples/index.js
		generateGridDimensions:function(_options, _tiles){
			var result = layout_fixedPartition(_tiles, _options);
			var positions = result.positions;

			vis.generateGrid(positions, _tiles);
		},

		//D3.js update function
		generateGrid:function(_data, _tiles){
			
			var tiles,
					tile_captions;
			var elem = _tiles[0].type === 'index' ? 'a' : 'div';
			var elem_selector = elem +'.tile';

			_data.forEach(function(d,i){
				d.tile = _tiles[i];
			});

			tiles = vis.c
				.selectAll(elem_selector)
				.data(_data)
				.join(
					function(enter){
						return enter.append(elem)
							.classed('tile',true)
							.attr('href',function(d){ return d.tile.url || null; })
							.style('width',function(d){ return d.width +'px'; })
							.style('height',function(d){ return window.innerWidth >vis.media_cutoff ? d.height +'px' : ((parseInt(d.tile.height)/parseInt(d.tile.width))*window.innerWidth) +'px'; })
							.style('left',function(d){ return d.x +'px'; })
							.style('top',function(d){ return d.y +'px'; })
							.style('background-image',function(d){ return 'url("' +d.tile.img_src +'")'; })
							;
					},
					function(update){
						return update
							.attr('href',function(d){ return d.tile.url; })
							.style('opacity',0)
							.style('width',function(d){ return d.width +'px'; })
							.style('height',function(d){ return window.innerWidth >vis.media_cutoff ? d.height +'px' : ((parseInt(d.tile.height)/parseInt(d.tile.width))*window.innerWidth) +'px'; })
							.style('left',function(d){ return d.x +'px'; })
							.style('top',function(d){ return d.y +'px'; })
							.style('background-image',function(d){ return 'url("' +d.tile.img_src +'")'; })
							.transition()
							.duration(360)
     					.ease(d3.easeLinear)
							.style('opacity',1);
					}
				);

				tile_captions = tiles
					.selectAll('div.caption')
					.data(function(d){ return [d]; })
					.join(
						function(enter){
							return enter.append('div')
								.classed('caption',true)
								.html(function(d){ 
									var content_r = d.tile.tile_year ? d.tile.tile_year +'&middot;' +d.tile.tile_month : '';
									return '<span class="meta left">' +(d.tile.meta || '') +'</span><span class="meta right">' +content_r +'</span>';
								});
						},
						function(update){
							return update
								.html(function(d){ 
									var content_r = d.tile.tile_year ? d.tile.tile_year +'&middot;' +d.tile.tile_month : '';
									return '<span class="meta left">' +(d.tile.meta || '') +'</span><span class="meta right">' +content_r +'</span>';
								});
						}
					);

				vis.c_jq.imagesLoaded({ background: '.tile' }).always(function(){
					vis.showGrid();
				});
		},

		//tag logic
		setTag:function(_tag, _parent){

			//if clicked tag is current tag
			if(vis.active_tag && (vis.active_tag == _tag)){
				vis.active_tag = null;

			//if clicked tag is new tag
			} else if(vis.active_tag && (vis.active_tag != _tag)){
				vis.active_tag = _tag;
			}

			//if no previous tag
			else {
				vis.active_tag = _tag;
			}
			
			d3.selectAll('.blog-tag-item').classed('active',function(d){ return d === vis.active_tag; });
		},

		filterTiles:function(){
			var filtered_tiles = vis.tiles.filter(function(d){
				return vis.active_tag ? d.tags.indexOf(vis.active_tag) >=0 : vis.tiles;
			});
			vis.generateGridDimensions(vis.grid_settings, filtered_tiles);
		}
	}
}

var vis = generate();
vis.setup();
vis.generateGridDimensions(vis.grid_settings, vis.tiles);

window.onresize = function(){
	vis.grid_settings.containerWidth = window.innerWidth <vis.media_cutoff ? vis.media_cutoff : (window.innerWidth +2);
	vis.generateGridDimensions(vis.grid_settings, vis.tiles);
}
