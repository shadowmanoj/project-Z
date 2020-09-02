var myVar;

function myFunction(){
    myVar = setTimeout(hiding, 3000);
    myVar = setTimeout(showPage,4000);
}

function showPage(){
    document.getElementById("preload").style.display = "none";
    document.getElementById("myDiv").style.display = "block";
}

function hiding(){
    document.getElementById("preload").style.animation = "fadeout 1s ease";
    document.getElementById("myDiv").style.animation = "fadein 1s ease";
}


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

function newpage(url){
  window.location=url;
  }


