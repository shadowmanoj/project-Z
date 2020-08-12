AOS.init({
  duration: 1000
});


var jumboHeight = $('.jumbotron').outerHeight();
function parallax(){
    var scrolled = $(window).scrollTop();
    $('.video-backgrorund').css('height', (jumboHeight-scrolled) + 'px');
}

$(window).scroll(function(e){
    parallax();
});