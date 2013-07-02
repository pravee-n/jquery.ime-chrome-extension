$( document ).ready( function () {
	// Extend the ime preference system
	$.extend( $.ime.preferences, {

		save: function ( ) {
			localStorage.setItem("imepreferences", JSON.stringify(this.registry) );
		},

		load: function () {
			this.registry = JSON.parse( localStorage.getItem( 'imepreferences' ) ) || this.registry;
		}

	} );

	
	function quickList() {
		var unique = [ $( 'html' ).attr( 'lang' ) || 'en' ],
			previousIMELanguages;

		previousIMELanguages =  $.ime.preferences.getPreviousLanguages() || [];
		$.each( previousIMELanguages, function ( i, v ) {
			if ( $.inArray( v, unique ) === -1 ) {
				unique.push( v );
			}
		} );

		return unique.slice( 0, 6 );
	}
	
	function availableLanguages() {
		var language,
			availableLanguages = {};

		for ( language in $.ime.languages ) {
			availableLanguages[language] = $.ime.languages[language].autonym;
		}
		return availableLanguages;
	};
	
	// Load the ime preferences
	$.ime.preferences.load();
	
	$( 'body' ).on( 'focus.ime', 'input:not([type]), input[type=text], input[type=search], textarea', function () {
		var $input = $( this );
		$input.ime( {
			languages: quickList(),
			languageSelector: function () {
				var $ulsTrigger;
	
				$ulsTrigger = $( '<a>' ).text( '...' )
					.addClass( 'ime-selector-more-languages' );
	
				$ulsTrigger.uls( {
					onSelect: function ( language ) {
						$input.data( 'imeselector' ).selectLanguage( language );
						$input.focus();
					},
					lazyload: false,
					languages: availableLanguages()
					// top: $( window ).height()/2 - 214,
					// left: $( window ).width()/2 - 358
				} );
	
				return $ulsTrigger;
			}
		} );
	} );
} );