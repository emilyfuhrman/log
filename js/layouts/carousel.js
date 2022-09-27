/**
 * Simple jQuery Infinite Carousel
 * SOURCE: https://codepen.io/matthewwilliams/pen/Vayrjv
 */
var threshold = 150,
    slideWidth = 500,
    dragStart, 
    dragEnd;
var cache = [];
var posts = JEKYLL_ARRAY;

$('.next').click(function(){ shiftSlide(this,-1) })
$('.prev').click(function(){ shiftSlide(this, 1) })

// carousel.on('mousedown', function(){
//   if (carousel.hasClass('transition')) return;
//   dragStart = event.pageX;
//   $(this).on('mousemove', function(){
//     dragEnd = event.pageX;
//     $(this).css('transform','translateX('+ dragPos() +'px)')
//   })
//   $(document).on('mouseup', function(){
//     if (dragPos() > threshold) { return shiftSlide(1) }
//     if (dragPos() < -threshold) { return shiftSlide(-1) }
//     shiftSlide(0);
//   })
// });

function dragPos() {
  return dragEnd - dragStart;
}

function shiftSlide(_elem, _direction) {
  var focus_id = $(_elem).parent().attr('id');
  var carousel = $('#' +focus_id +' .carousel');

  if (carousel.hasClass('transition')) return;
  dragEnd = dragStart;
  $(document).off('mouseup')
  carousel.off('mousemove')
          .addClass('transition')
          .css('transform','translateX(' + (_direction * slideWidth) + 'px)'); 
  setTimeout(function(){
    if (_direction === 1) {
      $('#' +focus_id +' .slide:first').before($('#' +focus_id +' .slide:last'));
    } else if (_direction === -1) {
      $('#' +focus_id +' .slide:last').after($('#' +focus_id +' .slide:first'));
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

window.onload = function(){
  preloadImages();
}