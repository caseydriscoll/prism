var PrismLeafMetaPanel = React.createClass( {

	render: function() {

		var metaInfoToDisplay = this.props.data.type in PRISM.meta ? this.props.data.type : 'default';

		var renderMetaPanel = PRISM.meta[metaInfoToDisplay].map( function( key, i ) {
			return (
				<PrismLeafMetaPanelPiece auth={this.props.auth} data={this.props.data[key]} key={i} label={key} />
			)
		}, this );

		return (
			<ul id="prism-leaf-meta-panel">
				{renderMetaPanel}
			</ul>
		)

	}

} );


var PrismLeafMetaPanelPiece = React.createClass( {

	getInitialState : function() {
		return { edit : false }
	},

	startEdit: function(e) {

		if ( ! this.props.auth ) return;

		var state = this.state;

		state.edit = true;

		this.setState( state );

	},

	stopEdit: function() {

		if ( ! this.props.auth ) return;

		var state = this.state;

		state.edit = false;

		this.setState( state );

	},

	autoSelect: function(e) {
		e.nativeEvent.target.select();
	},

	render: function() {

		var editData    = <input autoFocus readOnly type="text" value={this.props.data} onBlur={this.stopEdit} onFocus={this.autoSelect} />;
		var staticData  = <code>{this.props.data}</code>;

		var renderData  = this.state.edit == true ? editData : staticData;

		return (
			<li key={this.props.label}>
				<h4>{this.props.label + ':'}</h4>
				<span onClick={this.startEdit}>
					{renderData}
				</span>
			</li>
		)
	}

} );