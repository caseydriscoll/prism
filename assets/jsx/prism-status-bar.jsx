var PrismStatusBar = React.createClass( {

	render: function() {

		var data = this.props.data;
		var func = this.props.func;

		var statusLog = _.clone( data.status.log ).reverse().map( function( entry, i ) {
			return ( <li className={entry.type} key={i}><i className="fa fa-li fa-chevron-right"></i>{entry.message}</li> );
		}, this );

		return (
			<div id="prism-status-bar">
				<h3>Status Log</h3>
				<ul id="prism-status-log" className="fa-ul">
					{statusLog}
				</ul>
			</div>
		);
	}

} );


var PrismStatus = React.createClass( {

	timeout: null,

	getInitialState : function() {
		var state = { 
			showStatus   : false, 
			status : { 
				type    : null, 
				message : null, 
				time    : null 
			}
		};

		return state;
	},

	componentWillReceiveProps : function() {

		log( 11, 'beg PrismStatus.componentWillReceiveProps()' );

		var data  = this.props.data;
		var state = this.state;

		var logs  = data.status.log.length;

		if ( logs == 0 ) {
			state.showStatus = false;
			state.status = { type: null, message : null, time : null };
		} else {
			if ( data.status.log[logs - 1].time == state.status.time ) return;
			state.showStatus = true;
			state.status = data.status.log[logs - 1];
		}

		if ( this.timeout != null )
			clearTimeout( this.timeout );

		this.timeout = setTimeout( this.hide, PRISM.status.timeout );

		this.setState( state );

		log( 12, 'end PrismStatus.componentWillReceiveProps()' );

	},

	hide: function() {
		var state = this.state;

		state.showStatus = false;

		this.setState( state );
	},

	render: function() {
		log( 11, 'beg PrismStatus.render()' );

		var state = this.state;

		var data  = this.props.data;
		var func  = this.props.func;

		var statusClasses = state.showStatus ? 'show-status' : 'hide-status';

		var buttonClasses  = state.showStatus ? state.status.type : '';
		    buttonClasses += data.statusBar   ? ' active' : '';

		var status  = state.status;

		log( 12, 'end PrismStatus.render()' );

		return(
			<div id="prism-status" className={statusClasses}>
				<div id="prism-status-button" className={buttonClasses} onClick={func.toggleStatusBar}>
					<i className="fa fa-play"></i><i className="fa fa-play"></i><i className="fa fa-play"></i>
					<i className="fa fa-play"></i><i className="fa fa-play"></i><i className="fa fa-play"></i>
				</div>
				<div id="prism-status-message">{status.message}</div>
			</div>
		)
	}

} );