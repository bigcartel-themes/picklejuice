function changeImage(index) {
  var $allThumbs = $('#thumbs ul li')
    , $newSelection = $allThumbs.eq(index % $allThumbs.length);

  $allThumbs.removeClass('selected');
  $newSelection.addClass('selected');

  $('.primary_image').attr('src', $newSelection.find('a').attr('href'));
}

function closeDropdowns() {
  $('.wrapper-dropdown').removeClass('active').find('.dropdown').removeAttr('style');
}

function renderCustomDropdowns($element, callback) {
  var $selectBoxes = $element.find('select:not("[data-rendered]")');

  $selectBoxes.each(function(index, el) {
    var $select = $(el)
      , $newSelect = $('<div>', { id: 'dd', class: 'wrapper-dropdown' }).append(
        $('<div>').text('Choose an option'),
        $('<ul>', { class: 'dropdown' })
      );

    $select.find('option:not([value=""])').each(function(index, el) {
      $newSelect.find('ul').append(
        $('<li>').text($(el).text())
      );
    });

    $select.attr('data-rendered', 'data-rendered').hide().before($newSelect);
  });

  if (callback) { callback() };
}

function showCart() {
  var $overlay = $('<div>', { class: 'overlay' });

  $overlay.load('/cart' + ' .cart-wrapper');

  $('body > footer').before($overlay);

  setTimeout(function() {
    renderCustomDropdowns($overlay, function() {
      $overlay.fadeIn();
    });
  }, 50);
}

function updateCart() {
  var $overlay = $('.overlay');

  $overlay.load('/cart' + ' .cart-wrapper');

  setTimeout(function() {
    renderCustomDropdowns($overlay);
  }, 100);
}

$(window).load(function() {
  $('#loading').fadeOut(1500, function() {
    $(this).remove();
  });
});

$(document).ready(function() {
  var $document = $(this);

  renderCustomDropdowns($('body'));

  // Initialize slider on homepage
  $('.example1').wmuSlider({
    animation: 'slide',
    slideshow: true,
    slideshowSpeed: 4000,
    navigationControl: false,
    paginationControl: false,
    touch: true,
  });

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
      $('.cart a > span').html(Format.money(cart.subtotal, true, true));

      updateCart();
    });

  // Open custom select box
  }).on('click', '.wrapper-dropdown', function(e) {
    e.stopPropagation();

    var $dropdown = $(this);

    if ($dropdown.hasClass('active')) {
      $dropdown.removeClass('active');
      $dropdown.find('.dropdown').removeAttr('style');
    } else {
      $dropdown.addClass('active');
      $dropdown.find('.dropdown').css({ maxHeight: 210 });
    }

  // Make a selection in custom select box
  }).on('click', '.dropdown li', function(e) {
    e.stopPropagation();

    var $selection = $(this)
      , $dropdown = $selection.closest('.wrapper-dropdown')
      , $selectBox = $dropdown.next('select')
      , $selectedOption = $selectBox.children().filter('option:not([value=""])').eq($selection.index());

    $dropdown.find('div').text($selectedOption.text());
    $selectBox.val($selectedOption.attr('value'));

    closeDropdowns();

  // Show cart.
  }).on('click', '[data-show-cart]', function(e) {
    e.preventDefault();

    showCart();

  // Close and remove overlays
  }).on('click', '.close_overlay', function(e) {
    e.preventDefault();

    $(this).closest('.overlay').fadeOut(function() {
      $(this).remove();
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
      $('.cart a > span').html(Format.money(cart.subtotal, true, true));
    });
    
    $('.cart').append($("<div class='light_cart'></div>").append($("<div class='green_cart'></div>")));
    $('.green_cart').animate({
		  height: "60px"
		}, 'slow');
		setTimeout(function() {
		    $('.green_cart').fadeOut('slow', function() {
		    $(this).parent().remove();
		    })
		  }, 1500);
	
		
		    

  // Add full text back
  }).on('click', '#more_button', function(e) {
  	e.preventDefault();
  	var $truncateText = $('.truncate');
  	$('#more_button').toggleClass('less_button');
		if ($truncateText.text().length > 250) {
			$truncateText.succinct({
			    size: 250,
			    ignore: false
			});

		}
		else {
			$truncateText.text(window.fullText);
		}
  }).on('click', '.cart-wrapper :submit', function(e) {
    e.preventDefault();

    Cart.updateFromForm('cart_form', function(cart) {
      $('.cart a > span').html(Format.money(cart.subtotal, true, true));

      updateCart();
    });
  })
});

$(document).ready(function() {
  // Click outside select box to close it
  $(document).on('click', function(e) {
    if ($('.wrapper-dropdown.active').length > 0) {
      e.stopPropagation()

      if ($(this).closest('.wrapper-dropdown.active').length == 0) {
        closeDropdowns();
      }
    }
  });

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

	var $truncateText = $('.truncate')

	if ($truncateText.text().length > 250) {
		window.fullText = $truncateText.text();

		$truncateText.succinct({
		    size: 250,
		    ignore: false
		});

	}
  else {
  	$('#more_button').hide();
  }

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







