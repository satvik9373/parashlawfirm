'use strict';

var bt_initTheme;

function bt_refresh_cart() {
    jQuery('.btCartWidgetIcon').off('click').on('click', function(e) {
        jQuery(this).parent().parent().toggleClass('on');
        jQuery('body').toggleClass('btCartDropdownOn');
    });
    jQuery('.verticalMenuCartToggler').off('click').on('click', function() {
        jQuery(this).closest('.widget_shopping_cart_content').removeClass('on');
        jQuery('body').removeClass('.btCartDropdownOn');
    });
}

(function($) {

    function initFancySelect() {
        if (typeof $.fn.fancySelect === 'function') {
            $('.no-touch .btSidebar select:not(.dropdown_product_cat), .no-touch #btSettingsPanelContent select, .no-touch .wpcf7-form select:not([multiple]):not(.skipFancy)').fancySelect();
        }
    }

    function initDateInputCheck() {
        $('.wpcf7-form .wpcf7-date').on('change', function(i, obj) {
            if ($(this).val() != '') {
                $(this).addClass('bt-date-input-has-value');
            } else {
                $(this).removeClass('bt-date-input-has-value');
            }
        });
    }

    function loadInitActions() {
        // remove preloader
        if (!$('body').hasClass('btRemovePreloader')) {
            $('body').addClass('btRemovePreloader');
            if (typeof bt_bb_animate_elements === 'function') {
                bt_bb_animate_elements();
            }
        }

        // trigger custom load event
        setTimeout(function() {
            $(window).trigger('btload');
            window.boldthemes_loaded = true;
        }, 500);

        // gmaps with img overlay, iframes
        $(window).trigger('resize');
    }

    function initFooter() {
        $('#boldSiteFooterWidgetsRow').attr('data-width', $('#boldSiteFooterWidgetsRow').children().length).children().addClass('bt_bb_column');
    }

    function initModernizrAndDetectBrowser() {

        // Browser detect

        var doc = document.documentElement;
        doc.setAttribute('data-useragent', navigator.userAgent);

        // IE startsWith/endsWith compatibility 

        if (!String.prototype.startsWith) {
            String.prototype.startsWith = function(searchString, position) {
                position = position || 0;
                return this.lastIndexOf(searchString, position) === position;
            };
        }

        if (!String.prototype.endsWith) {
            String.prototype.endsWith = function(searchString, position) {
                var subjectString = this.toString();
                if (position === undefined || position > subjectString.length) {
                    position = subjectString.length;
                }
                position -= searchString.length;
                var lastIndex = subjectString.indexOf(searchString, position);
                return lastIndex !== -1 && lastIndex === position;
            };
        }
    }

    function initPreloader() {
        // delay click to allow on page leave screen
        $('body.bodyPreloader .mainHeader .menu').off('click').on('click', 'a', function() {
            var href = $(this).attr('href');
            if (
                href !== undefined &&
                !href.startsWith('#') &&
                !href.startsWith('mailto') &&
                !href.startsWith('callto') &&
                !$(this).hasClass('lightbox') &&
                !$(this).hasClass('add_to_cart_button') &&
                $(this).attr('target') != '_blank'
            ) {
                $('body').removeClass('btRemovePreloader');
                setTimeout(function() {
                    window.location = href
                }, 750);
                return false;
            }
        });
    }

    function initRefreshCart() {
        $('.cart-contents').each(function() {
            bt_refresh_cart();
        });
        var cart_node = jQuery('.widget_shopping_cart')[0];
        if (cart_node !== undefined) {
            var config = {
                attributes: true,
                childList: true,
                subtree: true
            };
            var callback = function(mutationsList, observer) {
                // for ( var mutation of mutationsList ) {
                for (var index = 0; index < mutationsList.length; index) {
                    var mutation = mutationsList[index];
                    if (mutation.type == 'childList') {
                        jQuery('.btCartWidgetIcon').off('click').on('click', function(e) {
                            jQuery(this).parent().parent().toggleClass('on');
                            jQuery('body').toggleClass('btCartDropdownOn');
                        });
                        jQuery('.verticalMenuCartToggler').off('click').on('click', function(e) {
                            jQuery(this).closest('.widget_shopping_cart_content').removeClass('on');
                            jQuery('body').removeClass('.btCartDropdownOn');
                        });
                    }
                    index++;
                }
            };
            var observer = new MutationObserver(callback);
            observer.observe(cart_node, config);
        }
    }

    function shopEqualHeights() {
        $('.btContent ul.products').each(function() {
            if ($(this).find('li.product .btWooShopLoopItemInner').length > 1) {
                var maxHeight = Math.max.apply(null, $(this).find('li.product .btWooShopLoopItemInner').map(function() {
                    return $(this).outerHeight();
                }).get());
                $(this).find('li.product .btWooShopLoopItemInner').css('min-height', maxHeight + 'px');
            }
        });

    }

    function initTheme() {
        initFancySelect();
        initDateInput();
        initFooter();
        initModernizrAndDetectBrowser();
        initPreloader();
        initRefreshCart();
        loadInitActions();
    }

    // LOAD
    $(window).on('load', function() {
        loadInitActions();
    });

    // READY

    $(document).ready(function() {
        initRefreshCart();
    });

    // RESIZE

    $(window).on('resize', function() {
        if ($('ul.products li.product .btWooShopLoopItemInner').length > 1) {
            $("ul.products li.product .btWooShopLoopItemInner").css('min-height', 'auto');
            shopEqualHeights();
        }
    });

    // CATEEGORIES DROPDOWN 

    function boldthemes_onCatChange() {
        if (boldthemes_dropdown.options[boldthemes_dropdown.selectedIndex].value > 0) {
            var home_url = document.querySelector(".logo a").href;
            if (boldthemes_dropdown !== null) location.href = home_url + '?cat=' + boldthemes_dropdown.options[boldthemes_dropdown.selectedIndex].value;
        }
    }

    var boldthemes_dropdown = document.querySelector(".widget_categories #cat");

    if (boldthemes_dropdown !== null) {
        boldthemes_dropdown.onchange = boldthemes_onCatChange;
    }

    initFancySelect();
    initDateInputCheck();
    initFooter();
    initModernizrAndDetectBrowser();
    initPreloader();
    shopEqualHeights();

    bt_initTheme = initTheme;

})(jQuery);