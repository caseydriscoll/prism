window.onkeyup = function(e) {

	var key = {
		code : e.keyCode ? e.keyCode : e.which,
		time : new Date()
	}

	var keyMode;

	var stateChange;

	if ( PRISM.keyMode == false ) {
		keyMode = false;
	} else {
		keyMode = PRISM.keyMode;
		PRISM.keyMode = false;
	}

	var input = document.activeElement.tagName == 'INPUT';

	var doubleKeyTime = key.time - PRISM.lastKey.time < PRISM.doubleKey.time;
	var doubleKeyCode = key.code == PRISM.doubleKey.code && PRISM.lastKey.code == PRISM.doubleKey.code;

	if ( doubleKeyTime && doubleKeyCode ) 
		document.getElementById( 'prism-rainbow-bar' ).focus();

	// console.log( key.code );

	switch ( key.code ) {
		case 13: // Return
			if ( input ) document.activeElement.blur();
			else         stateChange = { 'addLeaf' : true };
			
			break;

		case 27: // Escape
			if ( document.activeElement.id == 'prism-rainbow-bar' )
				document.getElementById( 'prism-rainbow-bar' ).blur();
			break;

		case 32: // Spacebar
			break;

		case 70: // f - for 'full' (with 'v' keyMode)
			if ( ! input && keyMode == 'v' )
				stateChange = { 'view' : 'full' };
			break;

		case 71: // g - for 'grid' (with 'v' keyMode)
			if ( ! input && keyMode == 'v' )
				stateChange = { 'view' : 'grid' };
			break;

		case 72: // h - for 'half' (with 'v' keyMode)
			if ( ! input && keyMode == 'v' )
				stateChange = { 'view' : 'half' };
			break;

		case 76: // l - for lock
			if ( ! input )
				stateChange = { 'lockMeta' : true };

			if ( ! input && keyMode == 'v' )
				stateChange = { 'view' : 'list' };
			break;

		case 80: // p - for panel
			if ( ! input ) 
				stateChange = { 'changeMeta' : true };
			break;

		case 86: // v - for view
			if ( ! input && keyMode == false )
				PRISM.keyMode = 'v';
			break;

		case 187: // =/+
			if ( ! input && e.shiftKey )
				stateChange = { 'addLeaf' : true };
			break;

		default:
			break;
	}

	PRISM.lastKey = key;

	if ( stateChange != null ) PrismKeyHandler( stateChange );

}

var PrismKeyHandler = function(data) { }

var RainbowBarHandler = {
	'add post' : function() { jQuery( '#posts' ).click(); jQuery( '#prism-add-leaf' ).click(); }
};