"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ease = {
  linear: function linear(t) {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    return t;
  },
  quadraticOut: function quadraticOut(t) {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    return -t * (t - 2);
  },
  quarticOut: function quarticOut(t) {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    return 1 - Math.pow(t - 1, 4);
  } //TODO: Try InOut (http://gizma.com/easing/)
};

var mathx = {
  clamp: function clamp(x, min, max) {
    return Math.min(Math.max(x, min), max);
  },
  scale: function scale(x, inLow, inHigh, outLow, outHigh) {
    return (x - inLow) * (outHigh - outLow) / (inHigh - inLow) + outLow;
  }

  // Test if we're on mobile
};var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

var GooeyTransition = function () {
  function GooeyTransition(svg) {
    _classCallCheck(this, GooeyTransition);

    this.svg = $(svg);
    this.paths = this.svg.find("path");
    this.transitionSpeed = 1.5;
    this.verticalOffset = 0;
    this.pathOffset = 0.04;
  }

  _createClass(GooeyTransition, [{
    key: "getPath",
    value: function getPath(ease1, ease2) {
      if (screen.height > screen.width) {
        return "\n        M 0 1\n        V " + ease1 + "\n        Q 0.2 " + ease2 + " 0.4 " + ease1 + "\n        T 0.8 " + ease1 + "\n        T 1.2 " + ease1 + "\n        V 1\n      ";
      } else {
        return "\n        M 0 1\n        V " + ease1 + "\n        Q 0.125 " + ease2 + " 0.25 " + ease1 + "\n        T 0.5 " + ease1 + "\n        T 0.75 " + ease1 + "\n        T 1 " + ease1 + "\n        V 1\n      ";
      }
    }
  }, {
    key: "render",
    value: function render(t) {
      var T = (t - this.verticalOffset) * this.transitionSpeed;
      for (var i = 0; i < this.paths.length; i++) {
        var ease1 = 1 - ease.quadraticOut(T - i * this.pathOffset);
        var ease2 = 1 - ease.quarticOut(T - i * this.pathOffset);
        $(this.paths[i]).attr("d", this.getPath(ease1, ease2));
      }
    }
  }]);

  return GooeyTransition;
}();

// class GooeyTransitionReverse extends GooeyTransition {
//   constructor(svg) {
//     super(svg);
//     this.pathOffset = -this.pathOffset;
//   }
//   getPath(ease1, ease2) {
//     return `
//       M 0 0
//       V ${ease2}
//       Q 0.125 ${ease2} 0.25 ${ease1}
//       T 0.5 ${ease1}
//       T 0.75 ${ease1}
//       T 1 ${ease2}
//       V 0
//     `;
//   }
// }

var landingTransition = new GooeyTransition("#landing-transition");
var whiteTransition = new GooeyTransition("#white-transition");

var scrollSectionOffset;

var bg = Math.round(Math.random() * 5);
// $("#bg"+bg).fadeIn(1000);

function process() {
  var bgn = (bg + 1) % 4;
  $("#bg" + bg).fadeOut(3000);
  $("#bg" + bgn).fadeIn(3000, function () {
    bg = bgn;
  });
  setTimeout(function () {
    process();
  }, 9000);
}

$("#navbar").css("display", "flex").hide();

// Update anytime page is scrolled.
$(window).scroll(function () {
  // console.log($(".active").attr("href"));

  var t = $(window).scrollTop() / screen.height;

  landingTransition.render(t);
  whiteTransition.render(t);

  // Fade in/out #navbar
  if ($("#navbar").queue().length === 0) {
    if (t > 0.49) {
      $("#navbar").fadeIn(200);
    } else if (t < 0.5) {
      $("#navbar").fadeOut(200);
    }
  }
});

$(window).resize(function () {
  scrollSectionOffset = Math.ceil($("#navbar").height() + parseInt($("section").css("margin-bottom")) / 2);
  $("body").attr("data-offset", scrollSectionOffset);

  whiteTransition.verticalOffset = $("#on-white").offset().top / screen.height - 1;

  $(this).scroll(); // Trigger a scroll update
}).resize();

$(".nav-link").click(function () {
  var target = $(this).attr("href");

  $("html,body").stop().animate({
    scrollTop: $(target).offset().top - scrollSectionOffset + 1
  }, 400, "easeInOutQuad");

  history.replaceState(null, null, target);

  $('.collapse').collapse("hide");
  return false;
});

var gary = 0;
$("#landing-logo").click(function () {
  gary++;
  if (gary == 100) $("#gary").fadeIn(6000);
  if (gary == 101) $("#gary").hide();
});

$(function () {

  process();
  var hash = window.location.hash;
  $(".nav-link[href=\"" + hash + "\"]").click();
});

// $(function() {
//   if (isMobile) {
//     $("#landing-transition").css("top", "-10%");
//   }
// });

// On DOM ready
// $(function(){

//   var $w = $(window),
//       $background = $("#landing-transition");

//   // Fix background image jump on mobile
//   if ((/Android|iPhone|iPad|iPod|BlackBerry/i).test(navigator.userAgent || navigator.vendor || window.opera)) {
//     $background.css({"top": "auto", "bottom": 0});

//     $w.resize(sizeBackground);
//     sizeBackground();
//   }

//   function sizeBackground() {
//      $background.height(screen.height);
//   }
// });