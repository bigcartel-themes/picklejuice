if (themeOptions.productImageZoom === true) {
  let carouselImages = document.querySelector('.splide__list');
  let galleryElement = '.product-images';
  let galleryChildren = '.gallery-link';
  if (carouselImages) {
    galleryElement = '.splide__list';
    galleryChildren = '.splide__slide:not(.splide__slide--clone) a'
  }
  var lightbox = new PhotoSwipeLightbox({
    gallery: galleryElement,
    children: galleryChildren,
    loop: true,
    showHideAnimationType: 'fade',
    paddingFn: (viewportSize) => {
      let paddingVal = 100;
      if (viewportSize.x < 768) {
        paddingVal = 16;
      }
      return {
        top: paddingVal,
        bottom: paddingVal,
        left: paddingVal,
        right: paddingVal
      };
    },
    bgOpacity: 1,
    pswpModule: PhotoSwipe
  });
  lightbox.init();
}
$('.product-option-select').on('change',function() {
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
  addButton.attr('aria-label',addButton.text());
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
  addButton.attr('aria-label','');
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
    if (themeOptions.showSoldOutOptions === false) {
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
$(document).ready(function() {
  if ($('.all-related-products').length) {
    var elements = $('.all-related-products').children().toArray();
    var num_to_display = $('.related-products-container').data('num-products');
    for (var i=1; i<=num_to_display; i++) {
      var randomIndex = getRandomIndex(elements);
      $('.related-product-list').append($('.all-related-products').children().eq(randomIndex));
      elements.splice(randomIndex, 1);
    }
    let total_inserted = $('.related-product-list').children().length;
    if (total_inserted < num_to_display) {
      $('.related-product-list').addClass('product-list--center');
    }
    $('.all-related-products').remove();
  }
});
function getRandomIndex(elements) {
  return Math.floor(Math.random() * elements.length);
}

const shareButton = document.querySelector(".product-share-launch");
const handleWebShare = () => {
  const title = document.title;
  const url = window.location.href;
  navigator
    .share({ title, url })
    .catch((error) => console.error("Sharing failed:", error));
}

const toggleShareLinks = () => {
  const shareLinks = document.querySelector(".product-share-buttons");

  if (shareLinks) {
    const isHidden = shareLinks.getAttribute("aria-hidden") === "true";
    shareLinks.setAttribute("aria-hidden", isHidden ? "false" : "true");
    shareButton.setAttribute("aria-expanded", isHidden ? "true" : "false");
  }
}

if (shareButton) {
  shareButton.addEventListener("click", () => {
    if (navigator.share) {
      handleWebShare();
    } else {
      toggleShareLinks();
    }
  });
}