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

		var statusLog = _.clone( data.status.log ).reverse().map( function( entry, i ) {
			return ( <li className={entry.type}><i className="fa fa-li fa-chevron-right"></i>{entry.message}</li> );
		}, this );

		return (
			<div id="prism-rainbow-bar">
				<h3>Status Log</h3>
				<ul id="prism-status-log" className="fa-ul">
					{statusLog}
				</ul>
			</div>
		);
	}

} ); 


var PrismRainbowButton = React.createClass( {

	render: function() {

		var data = this.props.data;
		var func = this.props.func;

		var classes = data.status.type;

		classes += data.rainbow ? ' active' : '';

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