var PrismRainbowBar = React.createClass( {

	executeRainbow: function(e) {

		var key   = e.keyCode ? e.keyCode : e.which;
		var func  = this.props.func;
		var value = e.target.value;

		if ( key == 13 ) {
			func.executeRainbow( value );
			e.target.value = '';
		}

	},

	render: function() {

		var data = this.props.data;
		var func = this.props.func;

		return (
			<div id="prism-rainbow-bar">
			</div>
		);
	}

} ); 


var PrismRainbowButton = React.createClass( {

	render: function() {

		var data = this.props.data;
		var func = this.props.func;

		var classes = data.rainbow ? 'active' : null;

		return(
			<div id="prism-rainbow-button" className={classes} onClick={func.toggleRainbow}>
				<i className="fa fa-play"></i>
				<i className="fa fa-play"></i>
				<i className="fa fa-play"></i>
				<i className="fa fa-play"></i>
				<i className="fa fa-play"></i>
				<i className="fa fa-play"></i>
			</div>
		)
	}

} );