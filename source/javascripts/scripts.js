$('body').append($('<div>', { id: 'loading' }));

function changeImage(index) {
  var $allThumbs = $('#thumbs ul li')
    , $newSelection = $allThumbs.eq(index % $allThumbs.length);

  $allThumbs.removeClass('selected');
  $newSelection.addClass('selected');

  $('.primary_image').attr('src', $newSelection.find('a').attr('href'));
}

function closeDropdowns() {
  $('.wrapper-dropdown').removeClass('active').find('dropdown').removeAttr('style');
}

$(window).load(function() {
  $('#loading').fadeOut(1500, function() {
    $(this).remove();
  });
});

$(document).ready(function() {
  var $document = $(this);

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

  // Show more product info
  }).on('click', '#more_button', function(e) {
    e.preventDefault();

    $('#description').toggleClass('more_deets');

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

    var $button = $(this);

    $button.closest('li').find('.quantity input').val(0);
    $button.closest('form').submit();

  // Open custom select box
  }).on('click', '.wrapper-dropdown', function(e) {
    e.stopPropagation();

    var $dropdown = $(this);

    $dropdown.addClass('active');
    $dropdown.find('.dropdown').css({ maxHeight: 210 });

  // Make a selection in custom select box
  }).on('click', '.dropdown li', function(e) {
    e.stopPropagation();

    var $selection = $(this)
      , $dropdown = $selection.closest('wrapper-dropdown')
      , $selectBox = $dropdown.next('select')
      , $selectedOption = $selectBox.children().eq($selection.index());

    $dropdown.find('div').text($selectedOption.text());
    $selectBox.val($selectedOption.attr('value'));

    closeDropdowns();

  // Over link in overlay
  }).on('click', '[data-overlay]', function(e) {
    e.preventDefault();

    var $overlay = $('<div>', { class: 'overlay' });

    $overlay.load($(this).attr('href') + ' .wrapper').fadeIn();
    $('body > footer').before($overlay);

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
    , $searchImg = $searchBar.find('img')
    , $selectBoxes = $('select');

  $searchButton.hide();

  $searchField.on('click', function() {
    $searchButton.show();
    $searchBar.addClass('search_bar_border');
    $searchImg.addClass('imgAdd');
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

});
