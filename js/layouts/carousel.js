/**
 * Simple jQuery Infinite Carousel
 * SOURCE: https://codepen.io/matthewwilliams/pen/Vayrjv
 */
var threshold = 150,
    slideWidth = util_computeSlideWidth(),
    dragStart, 
    dragEnd;
var carousels = $('.carousel');
var cache = [];
var posts = JEKYLL_ARRAY;

$('.next').click(function(){ shiftSlide( $(this).parent().attr('id'), -1 ) })
$('.prev').click(function(){ shiftSlide( $(this).parent().attr('id'),  1 ) })

// carousels.on('mousedown', function(){
//   var id = $(this).parent().parent().attr('id');
//   if (carousels.hasClass('transition')) return;
//   dragStart = event.pageX;
//   $(this).on('mousemove', function(){
//     dragEnd = event.pageX;
//     $(this).css('transform','translateX('+ dragPos() +'px)')
//   })
//   $(document).on('mouseup', function(){
//     if (dragPos() > threshold) { return shiftSlide(id, 1) }
//     if (dragPos() < -threshold) { return shiftSlide(id, -1) }
//     shiftSlide(id, 0);
//   })
// });

function dragPos() {
  return dragEnd - dragStart;
}

function util_computeSlideWidth(){
  return window.innerWidth - (window.innerWidth*0.25); //must match `.slide` width in CSS
}

function shiftSlide(_id, _direction) {
  var carousel = $('#' +_id +' .carousel');

  if (carousel.hasClass('transition')) return;
  dragEnd = dragStart;
  $(document).off('mouseup')
  carousel.off('mousemove')
          .addClass('transition')
          .css('transform','translateX(' + (_direction * slideWidth) + 'px)'); 
  setTimeout(function(){
    if (_direction === 1) {
      $('#' +_id +' .slide:first').before($('#' +_id +' .slide:last'));
    } else if (_direction === -1) {
      $('#' +_id +' .slide:last').after($('#' +_id +' .slide:first'));
    }
    carousel.removeClass('transition')
    carousel.css('transform','translateX(0px)'); 
  },700)
}

function preloadImage(_url){
  var img = new Image();
  img.src = _url;
  cache.push(img);
}
function preloadImages(){
  posts.forEach(function(p){
    p.images.forEach(function(_p){
      preloadImage(_p.path);
    });
  });
}

window.onresize = function(){
  slideWidth = util_computeSlideWidth();
}
window.onload = function(){
  preloadImages();
}