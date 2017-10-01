/**
 * Aims to unify the two payment implementations across the site ;\
 * @constructor
 */
var PaymentForm = function (options) {
    this.options = options || {};
};

(function ($) {
    /**
     * Initialise the form. It expects [data-payment-form] to exist.
     */
    PaymentForm.prototype.init = function () {
        var form = this;

        form.$form = $('[data-payment-form]');
        form.$trigger = form.$form.find('input[type="submit"]');
        form.clientToken = form.$form.data('payment-form');
        form.nonce = null;
        form.payment = null;
        form.checkout = null;

        if (!form.name) {
            var inputName = form.$form.find('input:first').attr('name');

            form.name = inputName.substr(0, inputName.indexOf('['));
        }

        form.validateAmountUrl = form.$form.data('payment-form-amount-url') || '/payment/processAmount';

        console.log('> Braintree: Loading..');

        $.getScript('https://js.braintreegateway.com/v2/braintree.js', function () {
            console.log('> Braintree: Loaded: ' + form.clientToken);

            form.client = new braintree.api.Client({
                clientToken: form.clientToken
            });

            form.setupBraintree();
        });
    };

    /**
     * Updates the dynamic page elements (form, trigger)
     */
    PaymentForm.prototype.update = function () {
        var form = this;

        form.$form = $('[data-payment-form]');
        form.$trigger = form.$form.find('input[type="submit"], .payment__section__upsell__submit');
    };

    /**
     * Returns the form action
     * @returns {string}
     */
    PaymentForm.prototype.getAction = function () {
        return this.$form.attr('action');
    };

    /**
     * Returns whether a payment's been stored
     * @returns {boolean}
     */
    PaymentForm.prototype.hasPayment = function () {
        return this.payment !== null;
    };

    /**
     * Sets the form field name (default: purchase)
     * @returns {boolean}
     */
    PaymentForm.prototype.setName = function (name) {
        this.name = name || this.name;
    };

    /**
     * Fetch the form's data, including the internally stored nonce.
     * @returns {{}}
     */
    PaymentForm.prototype.getData = function () {
        var form = this;

        var data = {};

        form.$form.find('input, select').each(function () {
            var $input = $(this);

            if ($input.attr('type') == 'checkbox' || $input.attr('type') == 'radio') {
                if ($input.is(':checked')) {
                    data[$input.attr('name')] = $input.val();
                } else if (!data[$input.attr('name')]) {
                    data[$input.attr('name')] = false;
                }
            } else {
                data[$input.attr('name')] = $input.val();
            }
        });

        if (!data[this.name + '[type_id]'] && window.GSEditor) {
            data[this.name + '[type_id]'] = window.GSEditor.currentLogoId || 0;
        }

        if (!data[this.name + '[price_id]']) {
            var $selected = $('.licence-button--selected');
            if ($selected.length > 0) {
                data[this.name + '[price_id]'] = $selected.data('license-id');
                data[this.name + '[amount]'] = $selected.data('license-value');
            }
        }

        data[this.name + '[nonce]'] = this.nonce;

        return data;
    };

    /**
     * Validates the amount (necessary for the verify3DS() call)
     * @returns {boolean}
     */
    PaymentForm.prototype.validateAmount = function () {
        var form = this;

        console.log('> Braintree: Validating Amount');

        var amount = false;

        $.ajax({
            async: false,
            type: 'POST',
            url: form.validateAmountUrl,
            data: form.getData(),
            dataType: 'json',
            success: function (response) {
                var success = response.success || false;
                var data = response.data || {};

                if (success && data.amount) {
                    amount = data.amount;
                }
            }
        });

        return amount;
    };

    /**
     * To be called when Braintree is ready
     * @param integration
     */
    PaymentForm.prototype.onBraintreeReady = function (integration) {
        console.log('> Braintree: Ready');

        var form = this;

        form.checkout = integration;
    };

    /**
     * To be called when the 3D Secure window is closed for any reason other than it completing.
     */
    PaymentForm.prototype.onBraintreeUserClose3DSecure = function () {
        var form = this;

        console.log('> Braintree::3DSecure closed, re-initialising', form.checkout);

        this.reset();

        form.setupBraintree();
    };

    /**
     * To be called when 3D Secure verification is done
     * @param error
     * @param response
     */
    PaymentForm.prototype.onBraintree3DSecureDone = function (error, response) {
        var form = this;

        if (!error) {
            console.log('> Braintree::3DSecure: ', response);

            form.nonce = response.nonce;

            if (form.options && $.isFunction(form.options.onComplete)) {
                form.options.onComplete();
            }

            return;
        }

        console.log('> Braintree::3DSecure failed: ' + error.message);

        form.handleError({error: error.message});
    };

    /**
     * To be called when Braintree is ready
     * @param payment
     */
    PaymentForm.prototype.onBraintreePaymentMethodReceived = function (payment) {
        console.log('> Braintree: Payment Method Received');

        var form = this;

        form.nonce = payment.nonce;
        form.payment = payment;

        if (payment.details.cardType === 'American Express') {
            form.handleError({
                error: 'Unfortunately we can\'t support American Express. Please try with another card or with PayPal.'
            });
            form.reset();

            return;
        }

        if (form.options && $.isFunction(form.options.onPaymentMethodReceived)) {
            form.options.onPaymentMethodReceived();
        }
    };

    /**
     * To be called when we're ready to finalise the payment.
     * This will invoke the 3D Secure verification if necessary.
     */
    PaymentForm.prototype.complete = function () {
        var form = this;

        if (form.payment === null) {
            form.reset();

            throw new Error('No payment');
        }

        if (form.payment.details.cardType === 'American Express') {
            form.handleError({
                error: 'Unfortunately we can\'t support American Express. Please try with another card or with PayPal.'
            });
            form.reset();

            return;
        }

        if (form.payment.type == 'CreditCard') {
            var amount = this.validateAmount();

            if (amount > 0) {
                console.log('> Braintree::verify3DS: ' + form.payment.nonce);
                form.client.verify3DS({
                    amount: amount,
                    creditCard: form.payment.nonce,
                    onUserClose: form.onBraintreeUserClose3DSecure.bind(form)
                }, form.onBraintree3DSecureDone.bind(form));
            } else if (amount == 0 && form.options && $.isFunction(form.options.onComplete)) {
                form.options.onComplete();
            }
        } else if (form.options && $.isFunction(form.options.onComplete)) {
            form.options.onComplete();
        }
    };

    PaymentForm.prototype.reset = function() {
        var form = this;

        form.checkout.teardown(function () {
            console.log('> Braintree Teardown');

            form.checkout = null;
            form.setupBraintree();
        });
    };

    /**
     * Configure Braintree and the various callbacks.
     */
    PaymentForm.prototype.setupBraintree = function () {
        var form = this;

        console.log('> Braintree: setup');

        form.nonce = null;
        form.payment = null;

        $('.payment__section__details__cards').removeClass('payment__section__details__cards--hidden');

        braintree.setup(form.clientToken, 'dropin', {
            container: 'braintree-container',
            onReady: form.onBraintreeReady.bind(form),
            onPaymentMethodReceived: form.onBraintreePaymentMethodReceived.bind(form)
        });
    };

    PaymentForm.prototype.setText = function ($element, text) {
        if ($element.is('input')) {
            $element.val(text);
        } else {
            $element.text(text);
        }
    };

    PaymentForm.prototype.setState = function (state) {
        var form = this;

        switch (state) {
            case 'validating':
                form.setText(form.$trigger, form.$trigger.data('text-validating'));
                break;

            case 'saving':
                form.setText(form.$trigger, form.$trigger.data('text-busy'));
                form.$trigger
                    .removeClass('form_error form_success')
                    .addClass('form_saving')
                ;
                break;

            case 'redirecting':
                form.setText(form.$trigger, form.$trigger.data('text-redirecting'));
                form.$trigger
                    .removeClass('form_error form_saving')
                    .addClass('form_success')
                ;
                break;

            case 'success':
                form.setText(form.$trigger, form.$trigger.data('text-success'));
                form.$trigger
                    .removeClass('form_saving')
                    .addClass('form_success')
                ;

                setTimeout(function () {
                    form.$trigger.removeClass('form_success');
                    form.setText(form.$trigger, form.$trigger.data('text-default'));
                }, 4000);
                break;

            case 'error':
                form.setText(form.$trigger, form.$trigger.data('text-error'));
                form.$trigger
                    .removeClass('form_saving')
                    .addClass('form_error')
                ;

                setTimeout(function () {
                    form.$trigger.removeClass('form_error');
                    form.setText(form.$trigger, form.$trigger.data('text-retry') || form.$trigger.data('text-default'));
                }, 4000);
                break;

            case 'disabled':
            case 'enabled':
                form.$trigger.prop('disabled', state === 'disabled');
                break;

            default:
                form.$trigger.removeClass('form_error form_saving form_success');
                form.setText(form.$trigger, form.$trigger.data('textDefault'));
                break;
        }
    };

    PaymentForm.prototype.handleError = function (data) {
        var global_errors = [];

        this.setState('error');

        if (data.error) {
            global_errors.push(data.error);
        }

        if (data.errors) {
            var form = this;

            $.each(data.errors, function (key, error) {
                if (typeof error === 'object') {
                    error = error.join('<br/>');
                }

                if (!isNaN(key)) {
                    global_errors.push(error);
                }

                var name_matches = [
                    '#' + key,
                    'input[name*="' + key + '"]',
                    'textarea[name*="' + key + '"]',
                    'select[name*="' + key + '"]'
                ];

                form.$form.find(name_matches.join(',')).each(function () {
                    var $el, $container, $message;

                    $el = $(this);
                    $container = $el.closest('.form-item');
                    $message = $container.find('.message');

                    if ($message.length == 0) {
                        global_errors.push(error);

                        return;
                    }

                    $el.removeAttr('valid')
                        .attr('invalid', true)
                        .trigger('invalid')
                        .addClass('validation-error');

                    $message.html(error).addClass('active form-item__message--active');
                });
            });
        }

        if (global_errors.length > 0) {
            $('[data-payment-global-error]')
                .html('<p>' + global_errors.join('</p><p>') + '</p>')
                .addClass('active form-item__message--active');
        }
    };
}(jQuery));
