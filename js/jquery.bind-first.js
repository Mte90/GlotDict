/*
 * jQuery.bind-first library v0.2.3 patched by Mte90
 * Copyright (c) 2013 Vladimir Zhuravlev
 *
 * Released under MIT License
 * @license
 **/

( function ( $ ) {
	function eventsData( $el ) {
		return $._data( $( $el ).get( 0 ), 'events' );
	}

	function moveHandlerToTop( $el, eventName, isDelegated ) {
		const data = eventsData( $el );
		const events = data[eventName];

		const handler = isDelegated ? events.splice( events.delegateCount - 1, 1 )[0] : events.pop();
		events.splice( isDelegated ? 0 : ( events.delegateCount || 0 ), 0, handler );
	}

	function moveEventHandlers( $elems, eventsString, isDelegate ) {
		const events = eventsString.split( /\s+/ );
		$elems.each( function () {
			for ( let i = 0; i < events.length; ++i ) {
				const pureEventName = $.trim( events[i] ).match( /[^\.]+/i )[0];
				moveHandlerToTop( $( this ), pureEventName, isDelegate );
			}
		} );
	}

	function makeMethod( methodName ) {
		$.fn[`${methodName}First`] = function () {
			const args = $.makeArray( arguments );
			const eventsString = args.shift();

			if ( eventsString ) {
				$.fn[methodName].apply( this, arguments );
				moveEventHandlers( this, eventsString );
			}

			return this;
		};
	}

	makeMethod( 'bind' );
	makeMethod( 'one' );

	$.fn.onFirst = function ( types, selector ) {
		const $el = $( this );
		const isDelegated = 'string' === typeof selector;

		$.fn.on.apply( $el, arguments );

		// events map
		if ( 'object' === typeof types ) {
			for ( const type in types ) {
				if ( types.hasOwnProperty( type ) ) {
					moveEventHandlers( $el, type, isDelegated );
				}
			}
		} else if ( 'string' === typeof types ) {
			moveEventHandlers( $el, types, isDelegated );
		}

		return $el;
	};
} )( jQuery );
