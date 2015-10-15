window.onkeyup = function(e) {

	var key = {
		code : e.keyCode ? e.keyCode : e.which,
		time : new Date()
	}

	var doubleKeyTime = key.time - PRISM.lastKey.time < PRISM.doubleKey.time;
	var doubleKeyCode = key.code == PRISM.doubleKey.code;

	if ( doubleKeyTime && doubleKeyCode ) document.getElementById( 'prism-bar' ).focus();


	switch ( key.code ) {

		case 32: // Spacebar
			break;

		default:
			break;
	}

	PRISM.lastKey = key;

}