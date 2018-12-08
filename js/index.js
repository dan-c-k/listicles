$(function () {
  var $slides = $('.slides');
  var margin = 100;
  var $slideWidth = $($slides[0]).width();
  var $slideOverallWidth = $slideWidth + margin;
  var $sliderWrapper = $('.slider-wrapper');
  var $slidesWrapper = $('.slides-wrapper');
  var $btnNext = $('.btn-next');
  var $btnPrev = $('.btn-prev');


  var slidesWrapperWidth = function slidesWrapperWidth() {
    var slidesAmount = 3;
    var overallWidth = $slideWidth * slidesAmount;
    $slidesWrapper.css('width', overallWidth + margin * slidesAmount - 1);
  };

  var sliderWrapperWidth = function sliderWrapperWidth() {
    $sliderWrapper.css('width', $slideWidth + margin);
  };
  var calcMoveAmount = function calcMoveAmount(index, type) {
    var isNext = type === '+';
    var pastAmount = index * $slideOverallWidth;
    var newAmount = void 0;
    var newIndex = void 0;
    if (!isNext && index === 0) {
      newAmount = 0;
      newIndex = 0;
    } else if (isNext && index === $slides.length - 1) {
      newAmount = pastAmount;
      newIndex = index;
    } else {
      newAmount = isNext ? pastAmount + $slideOverallWidth : pastAmount - $slideOverallWidth;
      newIndex = isNext ? index + 1 : index - 1;
    }
    var parallaxAmount = newIndex / $slides.length * 100;
    $slides.find('.img-wrapper').css({
      'background-position': parallaxAmount + '% 50%' });

    $slides.removeClass('active to-right to-left');
    $($slides[newIndex]).addClass('active');
    return moveSliderBy(newAmount);
  };

  var moveSliderBy = function moveSliderBy(amount) {
    $slidesWrapper.css('transform', 'translate3d(-' + amount + 'px, 0, 0)');

  };

  sliderWrapperWidth();
  slidesWrapperWidth();

  $btnNext.click(function () {
    var index = $('.slides.active').index();
    calcMoveAmount(index, '+');
  });
  $btnPrev.click(function () {
    var index = $('.slides.active').index();
    calcMoveAmount(index, '-');
  });
});