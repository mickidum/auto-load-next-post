/* global alnp_settings_params */
( function( $, params ) {
	var changed       = false,
		need_help     = $('.need-help').data('tab'),
		help_tabs     = $('.contextual-help-tabs'),
		help_contents = $('.contextual-help-tabs-wrap'),
		panel         = $('#' + $('#screen-meta-links').find('.show-settings').attr('aria-controls') ),
		rtl           = params.is_rtl;

	if ( rtl == 'rtl' ) {
		rtl = true;
	} else {
		rtl = false;
	}

	$('input, number, email, textarea, select, checkbox, radio').change( function() {
		changed = true;
	});

	// Navigation tab - If clicked and any input had changed then warn the user they will lose those changes if they continue.
	$('.nav-tab-wrapper a').click( function(e) {
		var clicked_url = $(this).attr('href');

		if ( changed && clicked_url !== '#' ) {
			e.preventDefault();

			$.confirm({
				icon: 'dashicons dashicons-warning',
				title: params.i18n_warning,
				content: params.i18n_nav_warning,
				rtl: rtl,
				type: 'red',
				buttons: {
					warning: {
						text: params.i18n_continue,
						keys: ['y', 'enter'],
						btnClass: 'btn-red',
						action: function(){
							location.href = clicked_url;
						}
					},
					close: {
						keys: ['n', 'esc'],
						action: function () {
							$.dialog({
								title: params.i18n_save,
								content: params.i18n_save_recommendation,
								type: 'blue',
								draggable: false,
								boxWidth: '500px',
								useBootstrap: false,
							});
						}
					},
				},
				draggable: false,
				boxWidth: '500px',
				useBootstrap: false,
			});
		}
	});

	// Clears any warnings previously set
	$('.submit :input').click( function() {
		changed = false;
	});

	// Reset button - If pressed will warn the user that all settings will be reset if they continue.
	$('a.reset-settings').click( function(e) {
		var clicked_url = $(this).attr('href');

		e.preventDefault();

		$.confirm({
			icon: 'dashicons dashicons-warning',
			title: params.i18n_warning,
			content: params.i18n_reset_warning,
			rtl: rtl,
			type: 'red',
			buttons: {
				warning: {
					text: params.i18n_continue,
					keys: ['y', 'enter'],
					btnClass: 'btn-red',
					action: function(){
						location.href = clicked_url;
					}
				},
				close: {
					keys: ['n', 'esc'],
					action: function () {
						// Do nothing!
					}
				},
			},
			draggable: false,
			boxWidth: '500px',
			useBootstrap: false,
		});
	});

	// Setup Wizard button - If pressed will warn the user that the wizard will override settings if they continue.
	$('#tab-panel-auto_load_next_post_wizard_tab a.button').click( function(e) {
		var clicked_url = $(this).attr('href');

		e.preventDefault();

		$.confirm({
			icon: 'dashicons dashicons-warning',
			title: params.i18n_warning,
			content: params.i18n_setup_wizard_warning,
			rtl: rtl,
			type: 'red',
			buttons: {
				warning: {
					text: params.i18n_continue,
					keys: ['y', 'enter'],
					btnClass: 'btn-red',
					action: function(){
						location.href = clicked_url;
					}
				},
				close: {
					keys: ['n', 'esc'],
					action: function () {
						// Do nothing!
					}
				},
			},
			draggable: false,
			boxWidth: '500px',
			useBootstrap: false,
		});
	});

	// Select all button
	$('.auto-load-next-post').on('click', '.select_all', function() {
		$(this).closest('td').find('select option').attr('selected', 'selected');
		$(this).closest('td').find('select').trigger('change');
		return false;
	});

	// Select none button
	$('.auto-load-next-post').on('click', '.select_none', function() {
		$(this).closest('td').find('select option').removeAttr('selected');
		$(this).closest('td').find('select').trigger('change');
		return false;
	});

	// Select2 enhanced select fields
	$('.alnp-enhanced-select').select2({
		dir: params.is_rtl,
		minimumResultsForSearch: Infinity,
		placeholder: function() {
			$(this).data('placeholder');
		}
	});

	$('.alnp-enhanced-multiselect').select2({
		dir: params.is_rtl,
		multiple: true,
		placeholder: function() {
			$(this).data('placeholder');
		}
	});

	// Triggers the WordPress help screen to open.
	$('.trigger-help').click( function(e) {
		e.preventDefault();

		if ( !panel.length )
			return;

		if ( panel.is(':visible') ) {
			panel.slideUp('fast', function() {
				panel.parent().next().find('button').removeClass('screen-meta-active').attr('aria-expanded', false);
				panel.parent().hide();
			});

			$(document).trigger('screen:options:close');

			$('.need-help').removeClass('hide');
		}
		else {
			panel.parent().show();

			need_help = need_help.replace('-', '_');

			// If a help tab for the settings in view exists display content.
			if ( help_tabs.find('#tab-link-auto_load_next_post_' + need_help + '_tab').length > 0 ) {
				help_tabs.find('li').removeClass('active');
				help_contents.find('div').removeClass('active');

				help_tabs.find('#tab-link-auto_load_next_post_' + need_help + '_tab').addClass('active').show();
				help_contents.find('#tab-panel-auto_load_next_post_' + need_help + '_tab').addClass('active').show();
			}

			panel.slideDown('fast', function() {
				panel.focus();
				panel.parent().next().find('button').addClass('screen-meta-active').attr('aria-expanded', true);
			});

			$(document).trigger('screen:options:open');

			$('.need-help').addClass('hide');
		}
	});

	// Hides the help button if the screen panel was opened normally.
	$(document).on('screen:options:open', function() {
		$('.need-help').addClass('hide');
	});

	// Un-hide the help button if the screen panel was closed normally.
	$(document).on('screen:options:close', function() {
		$('.need-help').removeClass('hide');
	});
})( jQuery, alnp_settings_params );
