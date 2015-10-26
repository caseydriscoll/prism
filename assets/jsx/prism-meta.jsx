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

		log( 11, 'beg PrismMeta.render()' );

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

		var renderConnections = data.connections.map( function( key, i ) {
				return (
					<PrismMetaConnection auth={auth} data={data} func={func} key={i} label={key} />
				)
		}, this );

		var style = { 'width' : data.width + '%' };

		log( 12, 'end PrismMeta.render()' );

		return (
			<div id="prism-meta" style={style}>
				<header id="prism-meta-header">
					<h3>Post Meta</h3>
					<PrismIcon type='lock' data={data} func={func} />
				</header>
				<ul id="prism-meta-info">
					{renderMetaInfo}
					{renderConnections}
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

var PrismMetaConnection = React.createClass( {

	render: function() {

		log( 11, 'beg PrismMetaConnection.render()' );

		var data = this.props.data;
		var func = this.props.func;

		var label = this.props.label;


		var nameSingle = data.branch.slug.single;
		var nestedSingle;

		// TODO: Currently cycles through whole map, convert to 'some' or use for/break?
		PRISM.branches.map( function( branch, i ) {
			if ( branch.slug.plural == label ) nestedSingle = branch.slug.single;
		} );


		var renderData = Object.keys( data[label] ).map( function( key, i ) {
			var href = "/#/" + nameSingle + "/" + data.slug + "/" + nestedSingle + "/" + data[label][key].slug;

			return ( <a key={i} href={href}>{data[label][key].name}</a> );
		} )

		var href = "/#/" + nameSingle + "/" + data.slug + "/" + label;

		log( 12, 'end PrismMetaConnection.render()' );

		return (
			<li key={label} className='connections'>
				<h4><a href={href}>{'Connected ' + label + ':'}</a></h4>
				<span>
					{renderData}
				</span>
			</li>
		)
	}

} );