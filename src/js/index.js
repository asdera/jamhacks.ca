const ease = {
  quadraticOut: (t) => {
    return -t * (t - 2);
  },
  quarticOut: (t) => {
    return -Math.pow(t - 1, 4) + 1;
  }, //TODO: Try InOut (http://gizma.com/easing/)
}

const mathx = {
  clamp: function(x, min, max) {
    return Math.min(Math.max(x, min), max);
  },
  scale: function(x, inLow, inHigh, outLow, outHigh) {
    return (x - inLow) * (outHigh - outLow) / (inHigh - inLow) + outLow;
  }
}


class GooeyTransition {
  constructor(svg) {
    this.svg = $(svg);
    this.paths = $(svg).find("path");
    this.limit = 0;
    this.gap = 0.05;
  }
  getPath(easeQuad, easeQuart) {
    return `
      M 0 0
      V ${easeQuart}
      Q 12.5 ${easeQuart} 25 ${easeQuad}
      T 50 ${easeQuad}
      T 75 ${easeQuad}
      T 100 ${easeQuart}
      V 0
    `;
  }
  render(t) {
    var easeQuad = mathx.scale(ease.quadraticOut(t), 1, 0, this.limit, $(window).height());
    var easeQuart = mathx.scale(ease.quarticOut(t), 1, 0, this.limit, $(window).height());
    var easeQuad2 = mathx.scale(ease.quadraticOut(t + this.gap), 1, 0, this.limit, $(window).height());
    var easeQuart2 = mathx.scale(ease.quarticOut(t + this.gap), 1, 0, this.limit, $(window).height());
    
    var svgHeight = easeQuad + easeQuad - easeQuart;
    this.svg.css("height", svgHeight);
    this.svg.attr("viewBox", `0 0 100 ${svgHeight}`);
    
    $(this.paths[0]).attr('d', this.getPath(easeQuad, easeQuart));
    $(this.paths[1]).attr('d', this.getPath(easeQuad2, easeQuart2));
  }
}

const landingTransitionScale = 1.5;
const landingTransition = new GooeyTransition("#gooey-bg");
// const footerTransition = new GooeyTransition(0.9, [footer1, footer2]);

// Update anytime page is scrolled.
$(window).scroll(function() {
  // console.log($(".active").attr("href"));
  
  var t = $(window).scrollTop() / $(window).height();
  
  landingTransition.render(mathx.clamp(t*landingTransitionScale, 0, 1));
  
  // footerTransition.render(t*2 - 4);
  
  // Rescale landing
  var landingHeight = mathx.scale(mathx.clamp(t, 0, 1/landingTransitionScale), 1/landingTransitionScale, 0, 0, $(this).height());
  $("#landing").css("height", landingHeight);
  
  // Fade in/out nav-header
  if ($("#nav-header").queue().length == 0 && t > 0.49) {
    $("#nav-header").fadeIn(200);
  }
  else if ($("#nav-header").queue().length == 0 && t < 0.5) {
    $("#nav-header").fadeOut(200);
  }
  
});

$(window).resize(function() {
  landingTransition.limit = $("#nav-header").height();
  
  $(this).scroll(); // Trigger a scroll update
}).resize();

$(".nav-link").click(function() {
  var target = $(this).attr("href");
  console.log("target", target);
  $("html,body").stop().animate({
    scrollTop: $(target).offset().top
  }, 400, "easeInOutQuad");
  return false;
});

$("body").scrollspy({target: "#nav-header"})