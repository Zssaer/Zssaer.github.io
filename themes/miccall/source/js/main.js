(function ($) {
  skel.breakpoints({
    xlarge: "(max-width: 1680px)",
    large: "(max-width: 1280px)",
    medium: "(max-width: 980px)",
    small: "(max-width: 736px)",
    xsmall: "(max-width: 480px)",
    xxsmall: "(max-width: 360px)",
  });
  
  // $(window).load(function(){
  //   $("body").mCustomScrollbar({
  //     axis:"y",
  //     theme:"dark",
  //     scrollButtons: { enable: true },
  //     advanced:{
  //       autoExpandHorizontalScroll:true //optional (remove or set to false for non-dynamic/static elements)
  //     }
  //   });
  // });
  /**
   * Applies parallax scrolling to an element's background image.
   * @return {jQuery} jQuery object.
   */
  $.fn._parallax = function (intensity) {
    var $window = $(window),
      $this = $(this);

    if (this.length == 0 || intensity === 0) return $this;

    if (this.length > 1) {
      for (var i = 0; i < this.length; i++) $(this[i])._parallax(intensity);

      return $this;
    }

    if (!intensity) intensity = 0.25;

    $this.each(function () {
      var $t = $(this),
        $bg = $('<div class="bg"></div>').appendTo($t),
        on,
        off;

      on = function () {
        $bg.removeClass("fixed").css("transform", "none");

        $window.on("scroll._parallax", function () {
          $bg.css("transform", "none");
        });
      };

      off = function () {
        $bg.addClass("fixed").css("transform", "none");

        $window.off("scroll._parallax");
      };

      // Disable parallax on ..
      if (
        skel.vars.browser == "ie" || // IE
        skel.vars.browser == "edge" || // Edge
        window.devicePixelRatio > 1 || // Retina/HiDPI (= poor performance)
        skel.vars.mobile
      )
        // Mobile devices
        off();
      // Enable everywhere else.
      else {
        skel.on("!large -large", on);
        skel.on("+large", off);
      }
    });

    $window
      .off("load._parallax resize._parallax")
      .on("load._parallax resize._parallax", function () {
        $window.trigger("scroll");
      });

    return $(this);
  };

  $(function () {
    var $window = $(window),
      $body = $("body"),
      $wrapper = $("#wrapper"),
      $tocButton = $("#toc_button"),
      $header = $("#header"),
      $nav = $("#nav"),
      $main = $("#main"),
      $navPanelToggle,
      $navPanel,
      $navPanelInner,
      $tocMenu = $("#toc_menu");

    // Disable animations/transitions until the page has loaded.
    $window.on("load", function () {
      window.setTimeout(function () {
        $body.removeClass("is-loading");
      }, 10);
    });

    // Prioritize "important" elements on medium.
    skel.on("+medium -medium", function () {
      $.prioritize(
        ".important\\28 medium\\29",
        skel.breakpoint("medium").active
      );
    });

    // Scrolly.
    $(".scrolly").scrolly();

    // Background.
    $wrapper._parallax(0.925);

    // Nav Panel.

    // Toggle.
    $navPanelToggle = $(
      '<a href="#navPanel" id="navPanelToggle">Menu</a>'
    ).appendTo($wrapper);

    // Change toggle styling once we've scrolled past the header.
    $header.scrollex({
      bottom: "5vh",
      enter: function () {
        $navPanelToggle.removeClass("alt");
		if (!/Mobi|Android|iPhone/i.test(navigator.userAgent)){
			$tocButton.hide();
			$tocButton.removeClass("content_toc");
		}
      },
      leave: function () {
        $navPanelToggle.addClass("alt");
		if (!/Mobi|Android|iPhone/i.test(navigator.userAgent)){
			$tocButton.show();
			$tocButton.addClass("content_toc");
		}
      },
    });

    $(document).click(function (e) {
      if ($tocMenu.css("visibility") == "visible") {
        var target = $(e.target);
        if (target.closest("#toc_menu").length == 0 && target.closest("#toc_button").length == 0) {
          openTocSidebar();
        }
      }
    });

    // Panel.
    $navPanel = $(
      '<div id="navPanel">' +
        "<nav>" +
        "</nav>" +
        '<a href="#navPanel" class="close"></a>' +
        "</div>"
    )
      .appendTo($body)
      .panel({
        delay: 500,
        hideOnClick: true,
        hideOnSwipe: true,
        resetScroll: true,
        resetForms: true,
        side: "right",
        target: $body,
        visibleClass: "is-navPanel-visible",
      });

    // Get inner.
    $navPanelInner = $navPanel.children("nav");

    // Move nav content on breakpoint change.
    var $navContent = $nav.children();

    skel.on("!medium -medium", function () {
      // NavPanel -> Nav.
      $navContent.appendTo($nav);

      // Flip icon classes.
      $nav.find(".icons, .icon").removeClass("alt");
    });

    skel.on("+medium", function () {
      // Nav -> NavPanel.
      $navContent.appendTo($navPanelInner);

      // Flip icon classes.
      $navPanelInner.find(".icons, .icon").addClass("alt");
    });

    // Hack: Disable transitions on WP.
    if (skel.vars.os == "wp" && skel.vars.osVersion < 10)
      $navPanel.css("transition", "none");

    // Intro.
    var $intro = $("#intro");

    if ($intro.length > 0) {
      // Hack: Fix flex min-height on IE.
      if (skel.vars.browser == "ie") {
        $window
          .on("resize.ie-intro-fix", function () {
            var h = $intro.height();

            if (h > $window.height()) $intro.css("height", "auto");
            else $intro.css("height", h);
          })
          .trigger("resize.ie-intro-fix");
      }

      // Hide intro on scroll (> small).
      skel.on("!small -small", function () {
        $main.unscrollex();

        $main.scrollex({
          mode: "bottom",
          top: "25vh",
          bottom: "-50vh",
          enter: function () {
            $intro.addClass("hidden");
          },
          leave: function () {
            $intro.removeClass("hidden");
          },
        });
      });

      // Hide intro on scroll (<= small).
      skel.on("+small", function () {
        $main.unscrollex();

        $main.scrollex({
          mode: "middle",
          top: "55vh",
          bottom: "-15vh",
          enter: function () {
            $intro.addClass("hidden");
          },
          leave: function () {
            $intro.removeClass("hidden");
          },
        });
      });
    }
  });
})(jQuery);

function openTocSidebar() {
  var toc_menu = $("#toc_menu");
  if (toc_menu.css("visibility") == "hidden") {
    toc_menu.css("visibility", "visible");
    toc_menu.css(
      "animation",
      "slide-right 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both"
    );
    toc_menu.css(
      "-webkit-animation",
      "slide-right 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both"
    );
  } else {
    toc_menu.css(
      "animation",
      "slide-left 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both"
    );
    toc_menu.css(
      "-webkit-animation",
      "slide-left 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both"
    );
  }
}
