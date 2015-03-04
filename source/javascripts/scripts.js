API.onError = function(errors) {
  var $errorList = $('<ul>', { class: 'errors'} )
    , $cartErrorsLocation = $('#cart_form .header')
    , $productErrorsLocation = $('#product_form');

  $.each(errors, function(index, error) {
    $errorList.append($('<li>').html(error));
  });

  if ($cartErrorsLocation.length > 0) {
    $cartErrorsLocation.prepend($errorList);
    $('.cart-wrapper').scrollTop(0);
  } else if ($productErrorsLocation.length > 0) {
    $productErrorsLocation.prepend($errorList);
  }
}

function resizeSlideshow() {
  $('#slideshow:visible article').each(function() {
    var $article = $(this)
      , $image = $article.find('img')
      , newHeight = Math.max($(window).height() - $('body > header').outerHeight(), 450);

    $article.css({height: newHeight});
    if ($image.outerWidth() > $(window).outerWidth()) {
      $image.css({marginLeft: ($(window).outerWidth() - $image.outerWidth()) / 2})
    }
    else { 
	    $image.css({marginLeft: 0})
    }
    $('#slideshow').css({height: newHeight});
  });
}

function changeImage(index) {
  var $allThumbs = $('#thumbs ul li')
    , $newSelection = $allThumbs.eq(index % $allThumbs.length);

  $allThumbs.removeClass('selected');
  $newSelection.addClass('selected');

  $('.primary_image').attr('src', $newSelection.find('a').attr('href'));
}

function showCart() {
  var $overlay = $('<div>', { class: 'overlay' });

  $overlay.load('/cart' + ' .cart-wrapper', function() {
    $('body').addClass('no-scroll');
    $('body > footer').before($overlay);

    $overlay.fadeIn();

  });
}

function updateCart() {
  var $overlay = $('.content, .overlay').last();

  $overlay.load('/cart' + ' .cart-wrapper');
}

$(window).on('resize', function() {
  if ($(window).width() <= 690) {
    var newTop = $('header .logo').outerHeight() + 20;

    $('header .cart').css({paddingTop: newTop});
    $('header .light_cart').css({top: newTop});
  } else {
    $('header .cart').removeAttr('style');
    $('header .light_cart').removeAttr('style');
  }
  resizeSlideshow();
})

$(document).ready(function() {
  var $document = $(this);
  resizeSlideshow();

  // Initialize slider on homepage
  if ($('.wmuSliderWrapper').children().length > 1) {
    $('.example1').wmuSlider({
      animation: 'slide',
      slideshow: true,
      slideshowSpeed: 4000,
      navigationControl: true,
      paginationControl: true
    })
  }

  

  // Slide out sidebar
  $document.on('click', 'aside > a', function(e) {
    e.preventDefault();

    $('aside').toggleClass('expand');

  // Show more products
  }).on('click', '.more', function(e) {
    e.preventDefault();

    var $button = $(this)
      , currentPage = parseInt($button.attr('data-current-page'))
      , nextPage = currentPage + 1
      , totalPages = parseInt($button.attr('data-total-pages'));

    $.get($button.attr('href'), function(response) {
      var products = $(response).find('.product_list li');

      $('.product_list ul').append(products.fadeIn());

    });

    if (nextPage == totalPages) {
      $button.hide();
    } else {
      $button.attr('href', $button.attr('href').replace(/page=\d+/, 'page=' + (nextPage + 1)));
      $button.attr('data-current-page', nextPage);
    }

  // Remove product from cart
  }).on('click', '.remove', function(e) {
    e.preventDefault();

    Cart.removeItem($(this).data('item-id'), function(cart) {
      $('header .cart a > span').html(Format.money(cart.total, true, true));

      updateCart();
    });

  }).on('click', '[data-show-cart]', function(e) {
    e.preventDefault();

    showCart();

  // Close and remove overlays
  }).on('click', 'body:not(.cart) .close_overlay a', function(e) {
    e.preventDefault();

    $(this).closest('.overlay').fadeOut(function() {
      $(this).remove();
      $('body').removeClass('no-scroll');
    });

  // Swap out product images
  }).on('click', '#thumbs a', function(e) {
    e.preventDefault();

    changeImage($('#thumbs ul li').index($(this).closest('li')));

  // Switch to next/prev product image
  }).on('click', '#prev, #next', function(e) {
    e.preventDefault();

    var currentIndex = $('#thumbs ul li.selected').index();
    
    if ($(e.target).attr('id') == 'next') {
      currentIndex++;
    } else {
      currentIndex--;
    }

    changeImage(currentIndex);
  }).on('click', '[data-add-to-cart]', function(e) {
    e.preventDefault();

    var $button = $(this)
      , $productInput = $(this).prev('input, select');

    Cart.addItem($productInput.val(), 1, function(cart) {
      $('#product_form .errors').remove();

      $('header .cart a > span').html(Format.money(cart.total, true, true));

      $button.text('Added!');
      setTimeout(function() {
        $button.text('Add to cart');
      }, 1000);

      $('header .cart').append($("<div class='light_cart'></div>").append($("<div class='green_cart'></div>")));
      $(window).trigger('resize');
      $('.green_cart').animate({ height: "60px" }, 'slow');

      setTimeout(function() {
        $('.green_cart').fadeOut('slow', function() {
          $(this).parent().remove();
        })
      }, 1500);
    });

  // Add full text back
  }).on('click', '.cart-wrapper #update', function(e) {
    e.preventDefault();

    Cart.updateFromForm('cart_form', function(cart) {
      $('header .cart a > span').html(Format.money(cart.total, true, true));

      updateCart();
    });
  })
});

$(document).ready(function() {
  
  var $searchBar = $('.search_bar')
    , $searchButton = $searchBar.find('input[type="submit"]')
    , $searchField = $searchBar.find('input[type="search"]')
    , $searchImg = $searchBar.find('img');

  $searchButton.hide();

  $searchField.on('click', function() {
    $searchButton.show();
    $searchBar.addClass('search_bar_border');
    $searchImg.addClass('imgAdd');
  });
  
  $searchField.on('focusout', function() {
      setTimeout(function() {
        $searchButton.hide();
        $searchBar.removeClass('search_bar_border');
        $searchImg.removeClass('imgAdd');
  
        if (this.value == '') {
          this.value = 'Search Products...';
        }
      }, 200);
    });

  $searchButton.on('click', function() {
    $searchButton.hide();
    $searchBar.removeClass('search_bar_border');
    $searchImg.removeClass('imgAdd');
  });

  $searchField.on('focus', function() {
    if (this.value == 'Search Products...') {
      this.value = '';
    }
  });

  $searchField.on('focusout', function() {
    if (this.value == '') {
      this.value = 'Search Products...';
    }
  });

  $(function() {
		$('a[href*=#]:not([href=#])').click(function() {
			if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
				var target = $(this.hash);
				target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
			if (target.length) {
				$('html,body').animate({
					scrollTop: target.offset().top
				}, 1000);
				return false;
			}
			}
			});
		});

		$(function() {
      $(".categories a").each(function(){
        if ($(this).attr("href") == window.location.pathname) {
        $(this).parent().addClass("current");
        }
      });
    });
    
});
