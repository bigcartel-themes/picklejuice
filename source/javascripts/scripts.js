$('body').append($('<div>', { id: 'loading' }));

function changeImage(index) {
  var $allThumbs = $('#thumbs ul li')
    , $newSelection = $allThumbs.eq(index % $allThumbs.length);

  $allThumbs.removeClass('selected');
  $newSelection.addClass('selected');

  $('.primary_image').attr('src', $newSelection.find('a').attr('href'));
}

function DropDown(el) {
  this.dd = el;
  this.initEvents();
}

DropDown.prototype = {
  initEvents: function() {
    var obj = this;

    obj.dd.on('click', function(e){
      $(this).toggleClass('active');
      e.stopPropagation();
    });
  }
}

$(window).load(function() {
  $('#loading').fadeOut(1500, function() {
    $(this).remove();
  });
});

$(document).ready(function() {
  var $searchBar = $('.search_bar')
    , $searchButton = $searchBar.find('input[type="submit"]')
    , $searchField = $searchBar.find('input[type="search"]')
    , $searchImg = $searchBar.find('img')
    , dd = new DropDown($('#dd'));

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

  $('sidebar > a').on('click', function(e) {
  	e.preventDefault();
    $('sidebar').toggleClass('expand');
  });

  $searchField.on('focus', function() {
    if (this.value == 'Search Products...') {
      this.value = '';
    }
  });

  $('#more_button').on('click', function(e) {
    e.preventDefault();
    $('#description').toggleClass('more_deets');
  });

  $(document).on('click', '[data-overlay]', function(e) {
    e.preventDefault();

    $overlay = $('<div>', { class: 'overlay' });
    $overlay.load($(this).attr('href') + ' .wrapper');
    $('body > footer').before($overlay);
  });

  $(document).on('click', '.close', function(e) {
    e.preventDefault();
    $(this).closest('.overlay').remove();
  });

  $(document).on('click', function() {
    // all dropdowns
    $('.wrapper-dropdown').removeClass('active');
  });

  // Swap out main product image.
  $(document).on('click', '#thumbs a', function(e) {
    e.preventDefault();

    changeImage($('#thumbs ul li').index($(this).closest('li')));
  });

  $(document).on('click', '#prev, #next', function(e) {
    e.preventDefault();

    var currentIndex = $('#thumbs ul li.selected').index();

    if ($(e.target).attr('id') == 'next') {
      currentIndex++;
    } else if ($(e.target).attr('id') == 'prev') {
      currentIndex--;
    }

    changeImage(currentIndex);
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
