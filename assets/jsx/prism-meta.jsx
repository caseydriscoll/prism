var PrismMeta = React.createClass( {

	prepMeta: function(e) {

		var data = this.props.data;
		var func = this.props.func;

		if ( ! data.currentlyChanged ) return;

		data = {
			'id'     : data.id,
			'status' : 'publish'
		};

		data[e.target.dataset.key] = e.target.value;

		func.saveLeaf( 'update', data );

	},

	autoSelect: function(e) {
		e.nativeEvent.target.select();
	},

	render: function() {

		var auth = this.props.auth;
		var data = this.props.data;
		var func = this.props.func;

		func.prepMeta   = this.prepMeta;
		func.autoSelect = this.autoSelect;

		var metaInfoToDisplay = data.type in PRISM.meta ? data.type : 'default';

		var renderMetaInfo = PRISM.meta[metaInfoToDisplay].map( function( key, i ) {

			return (
				<PrismMetaInfo auth={auth} data={data[key]} func={func} key={i} label={key} />
			)

		}, this );

		var style = { 'width' : data.width + '%' };

		return (
			<div id="prism-meta" style={style}>
				<header id="prism-meta-header">
					<h3>Post Meta</h3>
					<PrismLeafMetaIcon type='lock' data={data} func={func} />
				</header>
				<ul id="prism-meta-info">
					{renderMetaInfo}
				</ul>
			</div>
		)

	}

} );


var PrismMetaInfo = React.createClass( {

	getInitialState : function() {
		return { edit : false }
	},

	toggleEdit: function(e) {

		var key   = e.target.dataset.key;
		var auth  = this.props.auth;
		var data  = this.props.data;
		var func  = this.props.func;
		var value = e.target.value;

		// If not authenticated, don't all to edit
		if ( ! auth ) return;

		// Don't allow editing of the primary ID
		if ( key == 'id' ) return;

		this.setState( { edit : this.state.edit ? false : true } );

		// It is toggling from static to edit
		if ( value == undefined ) return;

		func.prepMeta(e);

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