$( document ).ready(function() {

  var $searchBar = $('.search_bar')
    , $searchButton = $searchBar.find('input[type="submit"]')
    , $searchField = $searchBar.find('input[type="search"]')
    , $searchImg = $searchBar.find('img');

    $searchButton.hide();
    $searchField.click(function() {
      $searchButton.show();
      $searchBar.addClass( 'search_bar_border' );
      $searchImg.addClass( 'imgAdd' );

    });

    $searchButton.click(function() {
       $searchButton.hide();
        $searchBar.removeClass( 'search_bar_border' );
        $searchImg.removeClass( 'imgAdd' );

    });

    $('sidebar > a').click(function() {
      $('sidebar').toggleClass('expand');

    });

    $searchField.focus(function() {
      if (this.value == 'Search Products...') {
      this.value = '';
      }
    });

    $('#more_button').click(function() {
      $('#description').toggleClass('more_deets');

    });

    function DropDown(el) {
    this.dd = el;
    this.initEvents();
  }
  DropDown.prototype = {
    initEvents : function() {
      var obj = this;

      obj.dd.on('click', function(event){
        $(this).toggleClass('active');
        event.stopPropagation();
      });
    }
  }

  $(function() {

    var dd = new DropDown( $('#dd') );

    $(document).click(function() {
      // all dropdowns
      $('.wrapper-dropdown').removeClass('active');
    });

  });


});
