var PrismLeaf = React.createClass( {

	getInitialState : function() {
		return { edit : false }
	},

	toggleEdit: function(e) {

		if ( this.props.auth ) {

			if ( this.state.edit ) this.prepLeaf(e);

			this.setState( { edit : this.state.edit ? false : true } );

		}

	},

	prepLeaf: function(e) {

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

	renderContentPanel: function() {

		var auth = this.props.auth;
		var data = this.props.data;
		var func = this.props.func;

		var content;

		if ( data.type == 'attachment' ) 
			content = <img src={data.source_url} />;
		else
			content = data.content.rendered;

		var editContent    = <textarea autoFocus id="prism-leaf-content" data-key="content" value={content} onBlur={this.toggleEdit} onFocus={this.autoSelect} onChange={func.changeValue} />;
		var staticContent  = <pre id="prism-leaf-content" onDoubleClick={this.toggleEdit}>{content}</pre>;

		var renderContent  = this.state.edit == true ? editContent : staticContent;

		return renderContent;

	},


	render: function() {

		var auth = this.props.auth;
		var data = this.props.data;
		var func = this.props.func;

		func.prepLeaf = this.prepLeaf;
		func.autoSelect = this.autoSelect;

		var style = {};

		if ( data.metaActive )
			style.width = data.width.leaf + '%';
		else
			style.width = 100 - ( data.width.trunk + data.width.branch ) + '%';

		var resizeBar = data.metaActive ? <PrismResizeBar data={data} func={func} /> : null;

		return (
			<div id="prism-leaf" data-section='leaf' style={style}>
				<PrismLeafHeader auth={auth} data={data} func={func} />
				{this.renderContentPanel()}
				{resizeBar}
			</div>
		);
	}

} );


var PrismLeafHeader = React.createClass( {

	render: function() {

		var auth = this.props.auth;
		var data = this.props.data;
		var func = this.props.func;

		return (
			<header id="prism-leaf-header">
				<PrismLeafTitle auth={auth} data={data.title.rendered} func={func} />
				<PrismIcon type='toggle' data={data} func={func} />
			</header>
		)

	}
} );


var PrismLeafTitle = React.createClass( {

	getInitialState : function() {
		return { edit : false };
	},

	toggleEdit: function(e) {

		if ( this.props.auth ) {

			if ( this.state.edit ) this.props.func.prepLeaf(e);

			this.setState( { edit : this.state.edit ? false : true } );

		}

	},

	renderTitle: function() {

		var auth = this.props.auth;
		var data = this.props.data;
		var func = this.props.func;

		var editTitle   = <input autoFocus data-key='title' type="text" value={data} onBlur={this.toggleEdit} onFocus={func.autoSelect} onChange={func.changeValue} />;
		var staticTitle = <div onClick={this.toggleEdit}>{data}</div>;

		var renderTitle = this.state.edit ? editTitle : staticTitle;

		return renderTitle;

	},

	clickTitle: function() {
		if ( PRISM.newleaf ) {
			PRISM.newleaf = false;

			jQuery( '#prism-leaf-header h2 div' ).click();
		}
	},

	componentDidMount  : function() { this.clickTitle() },

	componentDidUpdate : function() { this.clickTitle() },

	render: function() {

		return (
			<h2>{this.renderTitle()}</h2>
		)

	}

} );
