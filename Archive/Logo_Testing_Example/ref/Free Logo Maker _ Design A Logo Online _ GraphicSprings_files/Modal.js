function Modal(options) {
    var defaults = {
        modalSelector: '.modal',
        modalIdentifier: 'modal'
    };

    this.settings = $.extend({}, defaults, options);
    this.$modal = $(this.settings.modalSelector);
    this.$trigger = $('[data-reveal-id="' + this.settings.modalIdentifier + '"]');
    this.init();
}

Modal.prototype = function () {
    function init() {
        var self = this;

        self.$trigger.on('click', function () {
            $('body').addClass('active-modal');

            self.$modal.addClass('modal--active');

            setTimeout(function () {
                self.$modal.find('input').first().focus();
            }, 100);
        });

        self.$modal.on('click', function (e) {
            if ($(e.target).hasClass('modal__inner')) {
                $(this).removeClass('modal--active');
                $('body').removeClass('active-modal');
            }
        });

        $(document).keyup(function (e) {
            if (e.keyCode == 27) {
                $('body').removeClass('active-modal');
                $(self.$modal)
                    .removeClass('modal--active')
                    .removeAttr('style');
            }
        });
    }

    return {
        init: init
    }
}();

(function($) {
    'use strict';

    $(function() {
        $(document).on('click', 'a[data-modal-trigger]', function(ev) {
            ev.preventDefault();

            $.ajax({
                url: $(this).attr('href'),
                async: false,
                dataType: 'html',
                success: function (html) {
                    var $modal = $(html);

                    $modal.appendTo('body');

                    $modal.find('.modal__inner').on('click', function(ev) {
                        if ($(ev.target).is('.modal__inner')) {
                            $modal.remove();
                        }
                    });

                    $(document).one('keyup.modal', function(ev) {
                        if (ev.keyCode == 27) {
                            $modal.remove();
                        }
                    });
                }
            });

            return false;
        });

        $(document).on('click', '[data-modal-close]', function(ev) {
            ev.preventDefault();

            $(this).closest('.modal,.download-modal').remove();

            return false;
        });

        var $flashes = $('.modal.flash');
        if ($flashes.length > 0) {
            setTimeout(function(){
                $flashes.addClass('modal--active');
            }, 1000);
        }
    });
}(jQuery));
