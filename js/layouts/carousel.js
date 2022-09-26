/**
 * Simple jQuery Infinite Carousel
 * SOURCE: https://codepen.io/matthewwilliams/pen/Vayrjv
 */
var focus_id = '_0';
var carousel = $('#' +focus_id +' .carousel'),
    threshold = 150,
    slideWidth = 500,
    dragStart, 
    dragEnd;

$('#' +focus_id +' .next').click(function(){ shiftSlide(-1) })
$('#' +focus_id +' .prev').click(function(){ shiftSlide(1) })

carousel.on('mousedown', function(){
  if (carousel.hasClass('transition')) return;
  dragStart = event.pageX;
  $(this).on('mousemove', function(){
    dragEnd = event.pageX;
    $(this).css('transform','translateX('+ dragPos() +'px)')
  })
  $(document).on('mouseup', function(){
    if (dragPos() > threshold) { return shiftSlide(1) }
    if (dragPos() < -threshold) { return shiftSlide(-1) }
    shiftSlide(0);
  })
});

function dragPos() {
  return dragEnd - dragStart;
}

function shiftSlide(direction) {
  if (carousel.hasClass('transition')) return;
  dragEnd = dragStart;
  $(document).off('mouseup')
  carousel.off('mousemove')
          .addClass('transition')
          .css('transform','translateX(' + (direction * slideWidth) + 'px)'); 
  setTimeout(function(){
    if (direction === 1) {
      $('#' +focus_id +' .slide:first').before($('#' +focus_id +' .slide:last'));
    } else if (direction === -1) {
      $('#' +focus_id +' .slide:last').after($('#' +focus_id +' .slide:first'));
    }
    carousel.removeClass('transition')
    carousel.css('transform','translateX(0px)'); 
  },700)
}