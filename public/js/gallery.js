$(window).load(function () {
    /* ================ VERFIFY IF USER IS ON TOUCH DEVICE ================ */

    if (is_touch_device()) {
        $(".gallery-item-container").on('click', function (e) {
            $(this).find('.mask').show();
        });
    }

    // function to check is user is on touch device
    function is_touch_device() {
        return 'ontouchstart' in window // works on most browsers 
                || 'onmsgesturechange' in window; // works on ie10
    }

    /* ================ GALLERY ISOTOPE FILTER ================ */

    (function () {
        //ISOTOPE
        // cache container
        var $galleryitems = $('#galleryitems');
        // initialize isotope
        $galleryitems.isotope({
            filter: '*',
            masonry: {
                columnWidth: 1,
                isResizable: true
            }
        });

        // filter items when filter link is clicked
        $('#filters a').click(function () {
            $('#filters li').removeClass('active');
            var selector = $(this).closest('li').addClass('active').end().attr('data-filter');
            $galleryitems.isotope({
                filter: selector
            });
            return false;
        });
    })();

});
jQuery(document).ready(function ($) {
    'use strict';
    //GALLERY IMAGE LIGHTBOX
    $('.triggerZoom').magnificPopup({
        type: 'image',
        gallery: {
            enabled: true
        }
    });

    //galleryAnimation();
});

