var generate = function(){

	return {
		posts:JEKYLL_POST_IMAGES,
		post_tags:[],
		active_tag:null,

		media_cutoff:750,
		grid_settings:{
			containerWidth:window.innerWidth <this.media_cutoff ? this.media_cutoff : (window.innerWidth +2),
			idealElementHeight:550,
			spacing:20
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

			vis.posts.forEach(function(d,i){
				d.post_tags.forEach(function(_d,_i){
					if(vis.post_tags.indexOf(_d) <0){
						vis.post_tags.push(_d);
					}
				});
			});
			vis.post_tags.sort().reverse();

			d3.select('#tag-container')
				.selectAll('div.blog-tag-item')
				.data(vis.post_tags)
				.join(
					function(enter){
						return enter.append('div')
							.classed('blog-tag-item',true)
							.append('a')
								.text(function(d){ return d; })
							.on('click',function(d){
								
								var t = this.__data__,
										p = d3.select(this.parentNode);

								vis.setTag(t,p);
								vis.filterPosts();
							});
					}
				);
		},

		//grid layout logic
		//SOURCE: https://github.com/naturalatlas/image-layout/blob/master/examples/index.js
		generateGridDimensions:function(_options, _posts){
			var result = layout_fixedPartition(_posts, _options);
			var positions = result.positions;

			vis.generateGrid(positions, _posts);
		},

		//D3.js update function
		generateGrid:function(_data, _posts){
			
			var tiles,
					tile_captions;

			_data.forEach(function(d,i){
				d.post = _posts[i];
			});

			tiles = vis.c
				.selectAll('div.tile')
				.data(_data)
				.join(
					function(enter){
						return enter.append('div')
							.classed('tile',true)
							.style('width',function(d){ return d.width +'px'; })
							.style('height',function(d){ return window.innerWidth >vis.media_cutoff ? d.height +'px' : ((parseInt(d.post.height)/parseInt(d.post.width))*window.innerWidth) +'px'; })
							.style('left',function(d){ return d.x +'px'; })
							.style('top',function(d){ return d.y +'px'; })
							.style('background-image',function(d){ return 'url("' +d.post.src +'")'; })
							;
					},
					function(update){
						return update
							.style('opacity',0)
							.style('width',function(d){ return d.width +'px'; })
							.style('height',function(d){ return window.innerWidth >vis.media_cutoff ? d.height +'px' : ((parseInt(d.post.height)/parseInt(d.post.width))*window.innerWidth) +'px'; })
							.style('left',function(d){ return d.x +'px'; })
							.style('top',function(d){ return d.y +'px'; })
							.style('background-image',function(d){ return 'url("' +d.post.src +'")'; })
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
									return '<span class="meta">' +d.post.meta +'</span><span class="year">' +d.post.post_year +'</span>';
								});
						},
						function(update){
							return update
								.html(function(d){ 
									return '<span class="meta">' +d.post.meta +'</span><span class="year">' +d.post.post_year +'</span>';
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

		filterPosts:function(){
			var filtered_posts = vis.posts.filter(function(d){
				return vis.active_tag ? d.post_tags.indexOf(vis.active_tag) >=0 : vis.posts;
			});
			vis.generateGridDimensions(vis.grid_settings, filtered_posts);
		}
	}
}

var vis = generate();
vis.setup();
vis.generateGridDimensions(vis.grid_settings, vis.posts);

window.onresize = function(){
	vis.grid_settings.containerWidth = window.innerWidth <vis.media_cutoff ? vis.media_cutoff : (window.innerWidth +2);
	vis.generateGridDimensions(vis.grid_settings, vis.posts);
}
