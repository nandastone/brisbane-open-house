(function($) {
	$(document).ready(function() {
		var loginForm = $('#boh-login-form');
		var resetForm = $('#boh-reset-pass-form');

		// initial state.
		if ( ! $('p.som-password-sent-message.som-password-error-message').length ) {
			resetForm.hide();
		} else {
			loginForm.hide();
		}

		$('a#toggle-reset').click(function(e) {
			e.preventDefault();
			loginForm.hide();
			resetForm.show();
		});

		$('a#toggle-login').click(function(e) {
			e.preventDefault();
			resetForm.hide();
			loginForm.show();
		});

	});
})(window.jQuery);
