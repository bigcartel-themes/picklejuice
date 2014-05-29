$('body').append($('<div>', { id: 'loading' }));

function changeImage(index) {
  var $allThumbs = $('#thumbs ul li')
    , $newSelection = $allThumbs.eq(index % $allThumbs.length);

  $allThumbs.removeClass('selected');
  $newSelection.addClass('selected');

  $('.primary_image').attr('src', $newSelection.find('a').attr('href'));
}

function closeDropdowns() {
  $dropdownWrapper = $('.wrapper-dropdown.active');

  $dropdownWrapper.removeClass('active');
  $dropdownWrapper.find('.dropdown').removeAttr('style');
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

  // Create custom select boxes
  $selectBoxes.each(function(index, el) {
    var $select = $(el)
      , $newSelect = $('<div>', { id: 'dd', class: 'wrapper-dropdown' }).append(
        $('<div>').text('Choose an option'),
        $('<ul>', { class: 'dropdown' })
      );

    $select.find('option').each(function(index, el) {
      $newSelect.find('ul').append(
        $('<li>').text($(el).text())
      );
    });

    $(el).hide().before($newSelect);
  });

  // Click outside select box to close it
  $(document).on('click', function(e) {
    if ($('.wrapper-dropdown.active').length > 0) {
      e.stopPropagation()

      if ($(this).closest('.wrapper-dropdown.active').length == 0) {
        closeDropdowns();
      }
    }
  });

  // Open select box
  $(document).on('click', '.wrapper-dropdown', function(e) {
    e.stopPropagation();

    $this = $(this);

    $this.addClass('active');
    $this.find('.dropdown').css({ maxHeight: 'none' });
  });

  $(document).on('click', '.dropdown li', function(e) {
    e.stopPropagation();

    $this = $(this);
    $dropdownWrapper = $this.closest('.wrapper-dropdown');
    $selectBox = $dropdownWrapper.next('select');
    $selectedOption = $selectBox.children().eq($this.index())

    $dropdownWrapper.find('div').text($selectedOption.text())
    $selectBox.val($selectedOption.attr('value'));

    closeDropdowns();
  });




  $(document).on('click', '[data-overlay]', function(e) {
    e.preventDefault();
    $overlay = $('<div>', { class: 'overlay' });
    $overlay.load($(this).attr('href') + ' .wrapper').fadeIn();
    $('body > footer').before($overlay);
    
  
  });

  $(document).on('click', '.close_overlay', function(e) {
    e.preventDefault();
    $(this).closest('.overlay').fadeOut();
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
