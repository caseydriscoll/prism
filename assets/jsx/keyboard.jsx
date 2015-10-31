window.onkeyup = function(e) {

	var key = {
		code : e.keyCode ? e.keyCode : e.which,
		time : new Date(),
		mode : ''
	}

	var stateChange;

	if ( PRISM.key.mode == false ) {
		key.mode = false;
	} else {
		key.mode = PRISM.key.mode;
		PRISM.key.mode = false;
	}

	var input = document.activeElement.tagName == 'INPUT';

	// TODO: The 'RainbowBar' idea is deprecated for the time being 2015-10-27 15:58:07
	// var doubleKeyTime = key.time - PRISM.key.last.time < PRISM.key.double.time;
	// var doubleKeyCode = key.code == PRISM.key.double.code && PRISM.key.last.code == PRISM.key.double.code;

	// if ( doubleKeyTime && doubleKeyCode ) 
	// 	document.getElementById( 'prism-rainbow-bar' ).focus();

	// console.log( key.code );

	switch ( key.code ) {
		case 13: // Return
			if ( input ) document.activeElement.blur();
			else         stateChange = { 'newLeaf' : true };
			
			break;

		// case 27: // Escape
		// 	if ( document.activeElement.id == 'prism-status-bar' )
		// 		document.getElementById( 'prism-status-bar' ).blur();
		// 	break;

		case 32: // Spacebar
			break;

		case 37: // 'left'
			if ( ! input )
				stateChange = { 'move' : 'left' };
			break;

		case 38: // 'up'
			if ( ! input )
				stateChange = { 'move' : 'up' };
			break;

		case 39: // 'right'
			if ( ! input )
				stateChange = { 'move' : 'right' };
			break;

		case 40: // 'down'
			if ( ! input )
				stateChange = { 'move' : 'down' };
			break;

		case 70: // f - for 'full' (with 'v' keyMode)
			if ( ! input && key.mode == 'v' )
				stateChange = { 'view' : 'full' };
			break;

		case 71: // g - for 'grid' (with 'v' keyMode)
			if ( ! input && key.mode == 'v' )
				stateChange = { 'view' : 'grid' };
			break;

		case 72: // h - for 'half' (with 'v' keyMode)
			if ( ! input && key.mode == 'v' )
				stateChange = { 'view' : 'half' };
			else if ( ! input )
				stateChange = { 'move' : 'left' };

			break;

		case 73: // i
			break;

		case 74: // j - for 'down' (vim style)
			if ( ! input )
				stateChange = { 'move' : 'down' };
			break;

		case 75: // k - for 'up' (vim style)
			if ( ! input )
				stateChange = { 'move' : 'up' };
			break;

		case 76: // l - for 'right' (vim style)

			if ( ! input && e.shiftKey )
				stateChange = { 'lockMeta' : true };
			else if( ! input && key.mode == 'v' )
				stateChange = { 'view' : 'list' };
			else if ( ! input )
				stateChange = { 'move' : 'right' };

			break;

		case 78: // n - for newLeaf
			if ( ! input ) 
				stateChange = { 'newLeaf' : true };
			break;

		case 80: // p - for panel
			if ( ! input ) 
				stateChange = { 'changeMeta' : true };
			break;

		case 83: // s - for status and search
			if ( ! input && e.shiftKey ) 
				stateChange = { 'statusBar' : true };
			else if ( ! input ) 
				stateChange = { 'search' : true };

			break;

		case 85: // u - for user bar
			if ( ! input ) 
				stateChange = { 'userBar' : true };
			break;

		case 86: // v - for view
			if ( ! input && key.mode == false )
				PRISM.key.mode = 'v';
			break;

		case 187: // =/+
			if ( ! input && e.shiftKey )
				stateChange = { 'addLeaf' : true };
			break;

		default:
			break;
	}

	PRISM.key.last.code = key.code;
	PRISM.key.last.time = key.time;

	if ( stateChange != null ) PrismKeyHandler( stateChange );

}

var PrismKeyHandler = function(data) { }

var RainbowBarHandler = {
	'add post' : function() { jQuery( '#posts' ).click(); jQuery( '#prism-add-leaf' ).click(); }
};