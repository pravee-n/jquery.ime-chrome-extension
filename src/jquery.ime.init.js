$( document ).ready( function () {
	// Extend the ime preference system
	$.extend( $.ime.preferences, {

		save: function () {
			chrome.storage.local.set( { 'imepreferences': JSON.stringify( this.registry ) } );
		},

		load: function () {
			var imePreferences = this;
			chrome.storage.local.get( ['imepreferences'], function ( result ) {
				if ( result.imepreferences !== undefined ) {
					imePreferences.registry = JSON.parse( result.imepreferences ) || imePreferences.registry;
				}
				initializeIME();
			} );
		}

	} );

	function quickList() {
		var unique = [ $( 'html' ).attr( 'lang' ) || 'en' ],
			previousIMELanguages;

		previousIMELanguages = $.ime.preferences.getPreviousLanguages() || [];
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

	function initializeIME() {
		// initialize rangy incase document.ready has already been fired
		rangy.init();
		$( 'body' ).on( 'focus.ime', 'input:not([type]), input[type=text], input[type=search], textarea, [contenteditable]', function () {
			var $input = $( this );
			$input.ime( {
				languages: quickList(),
				languageSelector: function () {
					var $ulsTrigger;

					$ulsTrigger = $( '<a>' ).text( '...' )
						.addClass( 'ime-selector-more-languages selectable-row selectable-row-item' );

					$ulsTrigger.uls( {
						onSelect: function ( language ) {
							$input.data( 'imeselector' ).selectLanguage( language );
							$input.focus();
						},
						lazyload: false,
						//languages: availableLanguages(),
						// top: $input.offset().top,
						top: $( window ).height()/2 - 150,
						left: $( window ).width()/2 - 358
					} );

					return $ulsTrigger;
				},
				helpHandler: function ( ime ) {
					return $( '<a>' )
						.attr( {
							href: 'https://www.mediawiki.org/wiki/Special:MyLanguage/Help:Extension:UniversalLanguageSelector/Input_methods/$1'.replace( '$1', ime ),
							target: '_blank',
							title: 'How to use'
						} )
						.addClass( 'ime-perime-help' )
						.click( function ( event ) {
							event.stopPropagation();
						} );
				}
			} );

			$input.data( 'ime' ).constructor.prototype.load = function ( inputmethodId ) {
				var ime = this,
					deferred = $.Deferred(),
					dependency,
					runtimeOrExtension;

				if ( $.ime.inputmethods[inputmethodId] ) {
					return deferred.resolve();
				}

				dependency = $.ime.sources[inputmethodId].depends;
				if ( dependency ) {
					return $.when( this.load( dependency ), this.load( inputmethodId ) );
				}

				// Determining which method the Google chrome is using.
				// Until chrome version 25 message passing between content scripts and
				// extension scripts was implemented using chrome.extension.sendmessage.
				// From version 26 onwards it is implemented using chrome.runtime.sendmessage.
				runtimeOrExtension = chrome.runtime && chrome.runtime.sendMessage ? 'runtime' : 'extension';

				chrome[runtimeOrExtension].sendMessage( { fileToInject: $.ime.sources[inputmethodId].source }, function ( response ) {
					if ( response.injected ) {
						console.log( inputmethodId + ' loaded.' );
						deferred.resolve();
					}
					else {
						console.log( 'Error in loading inputmethod ' + name + ' Error: ' + response.errorMessage );
					}
				} );

				return deferred.promise();
			}
		} );
	}
} );