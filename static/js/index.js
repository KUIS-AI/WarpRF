window.HELP_IMPROVE_VIDEOJS = false;

var INTERP_BASE = "./static/interpolation/stacked";
var NUM_INTERP_FRAMES = 240;

var interp_images = [];
function preloadInterpolationImages() {
  for (var i = 0; i < NUM_INTERP_FRAMES; i++) {
    var path = INTERP_BASE + '/' + String(i).padStart(6, '0') + '.jpg';
    interp_images[i] = new Image();
    interp_images[i].src = path;
  }
}

function setInterpolationImage(i) {
  var image = interp_images[i];
  image.ondragstart = function() { return false; };
  image.oncontextmenu = function() { return false; };
  $('#interpolation-image-wrapper').empty().append(image);
}


$(document).ready(function() {
    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function() {
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");

    });

    var options = {
    slidesToScroll: 1,
    slidesToShow: 2.3,
    centerMode: true, // Enable center mode
    loop: true,
    infinite: true,
    autoplay: false,
    autoplaySpeed: 3000,
};

		// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);

    // Loop on each carousel initialized
    for(var i = 0; i < carousels.length; i++) {
    	// Add listener to  event
    	carousels[i].on('before:show', state => {
    		console.log(state);
    	});
    }

    // Access to bulmaCarousel instance of an element
    var element = document.querySelector('#my-element');
    if (element && element.bulmaCarousel) {
    	// bulmaCarousel instance is available as element.bulmaCarousel
    	element.bulmaCarousel.on('before-show', function(state) {
    		console.log(state);
    	});
    }

    /*var player = document.getElementById('interpolation-video');
    player.addEventListener('loadedmetadata', function() {
      $('#interpolation-slider').on('input', function(event) {
        console.log(this.value, player.duration);
        player.currentTime = player.duration / 100 * this.value;
      })
    }, false);*/
    preloadInterpolationImages();

    $('#interpolation-slider').on('input', function(event) {
      setInterpolationImage(this.value);
    });
    setInterpolationImage(0);
    $('#interpolation-slider').prop('max', NUM_INTERP_FRAMES - 1);

    bulmaSlider.attach();

})

// Resize each .bal-container-small to match the aspect ratio of its contained image.
// This keeps the before/after widget responsive: the container height is set to
// containerWidth / (naturalWidth / naturalHeight).
;(function() {
  function setContainerHeightFromImage($container) {
    var img = $container.find('.bal-after img, .bal-before img').first()[0];
    if (!img) return;

    function apply() {
      if (!img.naturalWidth || !img.naturalHeight) return;
      var aspect = img.naturalWidth / img.naturalHeight;
      var width = $container.width();
      var newHeight = Math.round(width / aspect);
      // optional caps to avoid extremely tall widgets on narrow phones
      var maxHeight = Math.round(window.innerHeight * 0.75);
      if (newHeight > maxHeight) newHeight = maxHeight;
      $container.css('height', newHeight + 'px');
    }

    if (img.complete) {
      apply();
    } else {
      // wait for image to load
      $(img).on('load', apply);
    }
  }

  function adjustAllBalContainers() {
    $('.bal-container-small').each(function() {
      setContainerHeightFromImage($(this));
    });
  }

  // Debounce helper
  function debounce(fn, wait) {
    var t = null;
    return function() {
      var args = arguments;
      clearTimeout(t);
      t = setTimeout(function() { fn.apply(null, args); }, wait);
    };
  }

  // Run after DOM ready (covers images already present) and after a short delay
  $(function() { adjustAllBalContainers(); });

  // Recompute on window resize
  $(window).on('resize', debounce(adjustAllBalContainers, 120));

  // Also re-run when orientation changes on mobile
  window.addEventListener('orientationchange', function() {
    setTimeout(adjustAllBalContainers, 200);
  });
})();
