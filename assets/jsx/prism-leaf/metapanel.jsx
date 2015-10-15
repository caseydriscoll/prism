var PrismLeafMetaPanel = React.createClass( {

	render: function() {

		var auth = this.props.auth;
		var data = this.props.data;
		var func = this.props.func;

		var metaInfoToDisplay = data.type in PRISM.meta ? data.type : 'default';

		var renderMetaPanel = PRISM.meta[metaInfoToDisplay].map( function( key, i ) {

			return (
				<PrismLeafMetaPanelPiece auth={auth} data={data[key]} func={func} key={i} label={key} />
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

	toggleEdit: function(e) {

		var key   = e.target.dataset.key;
		var auth  = this.props.auth;
		var data  = this.props.data;
		var value = e.target.value;

		// If not authenticated, don't all to edit
		if ( ! auth ) return;

		// Don't allow editing of the primary ID
		if ( key == 'id' ) return;

		this.setState( { edit : this.state.edit ? false : true } );

		// It is toggling from static to edit
		if ( value == undefined ) return;

		this.props.func.prepLeaf(e);

	},

	render: function() {

		var data = this.props.data;
		var func = this.props.func;

		var label = this.props.label;

		var editData    = <input autoFocus type="text" data-key={label} value={data} onBlur={this.toggleEdit} onFocus={func.autoSelect} onChange={func.changeValue} />;
		var staticData  = <code data-key={label}>{data}</code>;

		var renderData  = this.state.edit == true ? editData : staticData;

		return (
			<li key={label}>
				<h4>{label + ':'}</h4>
				<span onClick={this.toggleEdit}>
					{renderData}
				</span>
			</li>
		)
	}

} );