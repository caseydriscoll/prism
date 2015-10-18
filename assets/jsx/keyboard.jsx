window.onkeyup = function(e) {

	var key = {
		code : e.keyCode ? e.keyCode : e.which,
		time : new Date()
	}

	var input = document.activeElement.tagName == 'INPUT';

	var doubleKeyTime = key.time - PRISM.lastKey.time < PRISM.doubleKey.time;
	var doubleKeyCode = key.code == PRISM.doubleKey.code && PRISM.lastKey.code == PRISM.doubleKey.code;

	if ( doubleKeyTime && doubleKeyCode ) 
		document.getElementById( 'prism-rainbow-bar' ).focus();

	// console.log( key.code );

	switch ( key.code ) {
		case 13: // Return
			if ( input ) {
				document.activeElement.blur();
			} else {
				jQuery( '#prism-add-leaf' ).click();
			}

			break;

		case 27: // Escape
			if ( document.activeElement.id == 'prism-rainbow-bar' )
				document.getElementById( 'prism-rainbow-bar' ).blur();
			break;

		case 32: // Spacebar
			break;

		case 76: // l - for lock
			if ( ! input ) jQuery( '.lock-meta' ).click();
				break;

		case 80: // p - for panel
			if ( ! input ) jQuery( '.toggle-meta' ).click();
				break;

		case 187: // =/+
			if ( ! input ) 
				if ( e.shiftKey ) jQuery( '#prism-add-leaf' ).click();

			break

		default:
			break;
	}

	PRISM.lastKey = key;

}

var RainbowBarHandler = {
	'add post' : function() { jQuery( '#posts' ).click(); jQuery( '#prism-add-leaf' ).click(); }
};