API.onError = function(errors) {
  var $errorList = $('<ul>', { class: 'errors'} )
    , $cartErrorsLocation = $('#cart_form .header')
    , $productErrorsLocation = $('.product-form');

  $.each(errors, function(index, error) {
    $errorList.append($('<li>').html(error));
  });

  if ($cartErrorsLocation.length > 0) {
    $cartErrorsLocation.find('.errors').hide();
    $cartErrorsLocation.prepend($errorList);
    $('.cart-wrapper').scrollTop(0);
  } else if ($productErrorsLocation.length > 0) {
    $productErrorsLocation.find('.errors').hide();
    $productErrorsLocation.prepend($errorList);
  }
}
$(document).keydown(function(event) {
  if (event.keyCode == 27) {
    $('.cart-overlay').fadeOut(function() {
      $('body').removeClass('no-scroll');
    });
  }
});

function changeImage(index) {
  var $allThumbs = $('.product-thumbs > a')
    , $newSelection = $allThumbs.eq(index % $allThumbs.length);

  $allThumbs.removeClass('selected');
  $newSelection.addClass('selected');

  $('.primary_image').attr('src', $newSelection.attr('href'));
}

function showCart() {
  var $overlay = $('<div>', { class: 'cart-overlay' });
  $overlay.load('/cart' + ' .cart-wrapper', function() {
    $('body').addClass('no-scroll');
    $('body > .content').before($overlay);
    $overlay.fadeIn();
  });
}

function updateCart() {
  var $overlay = $('.cart-overlay');
  $overlay.load('/cart' + ' .cart-wrapper');
}

function getRandomIndex(elements) {
  return Math.floor(Math.random() * elements.length);
}

$('.home-slideshow').flexslider({
  animation: "slide"
});
$('.flexslider').on('touchmove', function (e) { e.stopPropagation(); });
var width = $(window).width();

$(document).ready(function() {
  var $document = $(this);

  // Slide out sidebar
  $document.on('click', '.open-menu', function(e) {
    e.preventDefault();
    $('aside').toggleClass('expand');

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

    $(this).closest('.cart-overlay').fadeOut(function() {
      $(this).remove();
      $('body').removeClass('no-scroll');
    });

  // Swap out product images
  }).on('click', '.product-thumbs a', function(e) {
    e.preventDefault();

    changeImage($('.product-thumbs a').index($(this).closest('a')));

  // Switch to next/prev product image
  }).on('click', '.image-arrow', function(e) {
    e.preventDefault();

    var currentIndex = $('.product-thumbs a.selected').index();

    if ($(e.target).attr('id') == 'next') {
      currentIndex++;
    } else {
      currentIndex--;
    }

    changeImage(currentIndex);
  }).on('click', '.add-to-cart-button', function(e) {
    e.preventDefault();

    var $button = $(this)
      , $productInput = $('#option')
      , $quantityInput = $('#product-quantity');

    Cart.addItem($productInput.val(), $quantityInput.val(), function(cart) {
      $('.product-form .errors').remove();

      $('.header-cart a > span').html(Format.money(cart.total, true, true));

      $button.text('Added!');
      setTimeout(function() {
        $button.text('Add to cart');
      }, 1000);

      $('.header-cart').append($("<div class='light_cart'></div>").append($("<div class='green_cart'></div>")));
      $(window).trigger('resize');
      $('.green_cart').animate({ height: "60px" }, 'slow');

      setTimeout(function() {
        $('.green_cart').fadeOut('slow', function() {
          $(this).parent().remove();
        })
      }, 1500);
    });

  // Add full text back
  }).on('click', '.cart-wrapper .update-btn', function(e) {
    e.preventDefault();

    Cart.updateFromForm('cart_form', function(cart) {
      $('.header-cart a > span').html(Format.money(cart.total, true, true));

      updateCart();
    });
  })
});

$(document).ready(function() {
  $('.search-input').bind('blur', function(){ $('.header-search').removeClass('active'); });
  $('.search-input').bind('focus', function(){ $('.header-search').addClass('active'); });
});

var isGreaterThanZero = function(currentValue) {
  return currentValue > 0;
}

function arrayContainsArray(superset, subset) {
  if (0 === subset.length) {
    return false;
  }
  return subset.every(function (value) {
    return (superset.indexOf(value) >= 0);
  });
}

function unique(item, index, array) {
  return array.indexOf(item) == index;
}

function cartesianProduct(a) {
  var i, j, l, m, a1, o = [];
  if (!a || a.length == 0) return a;
  a1 = a.splice(0, 1)[0];
  a = cartesianProduct(a);
  for (i = 0, l = a1.length; i < l; i++) {
    if (a && a.length) for (j = 0, m = a.length; j < m; j++)
      o.push([a1[i]].concat(a[j]));
    else
      o.push([a1[i]]);
  }
  return o;
}

Array.prototype.equals = function (array) {
  if (!array)
    return false;
  if (this.length != array.length)
    return false;
  for (var i = 0, l=this.length; i < l; i++) {
    if (this[i] instanceof Array && array[i] instanceof Array) {
      if (!this[i].equals(array[i]))
        return false;
    }
    else if (this[i] != array[i]) {
      return false;
    }
  }
  return true;
}

// From https://github.com/kevlatus/polyfill-array-includes/blob/master/array-includes.js
if (!Array.prototype.includes) {
  Object.defineProperty(Array.prototype, 'includes', {
    value: function (searchElement, fromIndex) {
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }
      var o = Object(this);
      var len = o.length >>> 0;
      if (len === 0) {
        return false;
      }
      var n = fromIndex | 0;
      var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
      function sameValueZero(x, y) {
        return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
      }
      while (k < len) {
        if (sameValueZero(o[k], searchElement)) {
          return true;
        }
        k++;
      }
      return false;
    }
  });
}

Array.prototype.count = function(filterMethod) {
  return this.reduce((count, item) => filterMethod(item)? count + 1 : count, 0);
}

$('.product_option_select').on('change',function() {
  var option_price = $(this).find("option:selected").attr("data-price");
  enableAddButton(option_price);
});

function enableAddButton(updated_price) {
  var addButton = $('.add-to-cart-button');
  var addButtonTitle = addButton.attr('data-add-title');
  addButton.attr("disabled",false);
  if (updated_price) {
    priceTitle = ' - ' + Format.money(updated_price, true, true);
  }
  else {
    priceTitle = '';
  }
  addButton.html(addButtonTitle + priceTitle);
}

function disableAddButton(type) {
  var addButton = $('.add-to-cart-button');
  var addButtonTitle = addButton.attr('data-add-title');
  if (type == "sold-out") {
    var addButtonTitle = addButton.attr('data-sold-title');
  }
  if (!addButton.is(":disabled")) {
    addButton.attr("disabled","disabled");
  }
  addButton.html(addButtonTitle);
}

function enableSelectOption(select_option) {
  select_option.removeAttr("disabled");
  select_option.text(select_option.attr("data-name"));
  select_option.removeAttr("disabled-type");
  if ((select_option.parent().is('span'))) {
    select_option.unwrap();
  }
}
function disableSelectOption(select_option, type) {
  if (type === "sold-out") {
    disabled_text = select_option.parent().attr("data-sold-text");
    disabled_type = "sold-out";
    if (show_sold_out_product_options === 'false') {
      hide_option = true;
    }
    else {
      hide_option = false;
    }
  }
  if (type === "unavailable") {
    disabled_text = select_option.parent().attr("data-unavailable-text");
    disabled_type = "unavailable";
    hide_option = true;
  }
  if (select_option.val() > 0) {
    var name = select_option.attr("data-name");
    select_option.attr("disabled",true);
    select_option.text(name + ' ' + disabled_text);
    select_option.attr("disabled-type",disabled_type);
    if (hide_option === true) {
      if (!(select_option.parent().is('span'))) {
        select_option.wrap('<span>');
      }
    }
  }
}
if ($('.all-similar-products').length) {
  var num_products = $('.all-similar-products > a').length;
  var elements = $('.all-similar-products').children().toArray();
  var num_to_display = 4;
  for (var i=1; i<=num_to_display; i++) {
    var randomIndex = getRandomIndex(elements);
    $('.similar-product-list').append($('.all-similar-products').children().eq(randomIndex));
    elements.splice(randomIndex, 1);
    $('.similar-product-list .similar-product-list-image').each(function() {
      $(this).attr("src",$(this).data("src"));
    })
  }
  $('.all-similar-products').remove();
}


if ($('.next-button').length) {
  var $container = $('.products-page-list').infiniteScroll({
    path: '.next-button',
    append: '.product-list-item',
    status: '.page-load-status',
    hideNav: '.pagination',
    checkLastPage: true,
    history: false,
    prefill: false,
    debug: false,
    loadOnScroll: false
  });

  var $loadMoreButton = $('.view-more-button');
  $loadMoreButton.on( 'click', function() {
    $container.infiniteScroll('loadNextPage');
    $container.infiniteScroll( 'option', {
      loadOnScroll: true,
    });
    $loadMoreButton.hide();
  });
}