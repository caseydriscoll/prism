window.onkeyup = function(e) {

	var key = {
		code : e.keyCode ? e.keyCode : e.which,
		time : new Date()
	}

	var doubleKeyTime = key.time - PRISM.lastKey.time < PRISM.doubleKey.time;
	var doubleKeyCode = key.code == PRISM.doubleKey.code && PRISM.lastKey.code == PRISM.doubleKey.code;

	if ( doubleKeyTime && doubleKeyCode ) 
		document.getElementById( 'prism-rainbow-bar' ).focus();

	console.log( key.code );

	switch ( key.code ) {
		case 13: // Return
			if ( document.activeElement.tagName == 'INPUT' ) {
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

		case 187: // =/+
			if ( document.activeElement.tagName == 'INPUT' )
				break;

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