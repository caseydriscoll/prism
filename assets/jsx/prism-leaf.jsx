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

		var leaf = {
			id     : data.id,
			status : 'publish',
			branch : data.type,
			url    : PRISM.url.rest + data.type + '/' + data.id
		};

		if ( data.parent.branch != null )
			leaf.parent_branch = data.parent.branch;

		leaf[e.target.dataset.key] = e.target.value;

		func.saveLeaf( 'update', leaf );

	},

	autoSelect: function(e) {
		e.nativeEvent.target.select();
	},

	renderContentPanel: function() {

		var auth = this.props.auth;
		var data = this.props.data;
		var func = this.props.func;

		var contentType, content = null;

		if ( data.content != null ) {
			contentType = data.content.raw == null ? 'rendered' : 'raw';
			content = data.content[contentType].length > 0 ? data.content[contentType].substring( 0, 75 ) + '...' : '';
		}


		if ( data.type == 'attachment' ) 
			content = <img src={data.source_url} />;
		else
			content = data.content[contentType];

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
			<header id="prism-leaf-header" className="prism-tree-header">
				<PrismLeafTitle auth={auth} data={data} func={func} />
				<PrismIcon type='toggle' data={data} func={func} />
			</header>
		)

	}
} );


var PrismLeafTitle = React.createClass( {

	getInitialState : function() {

		var isNew = this.props.data.new == 'new';

		return { edit : isNew };
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

		var contentType = data.title.raw == null ? 'rendered' : 'raw';

		var editTitle   = <input autoFocus data-key='title' type="text" value={data.title[contentType]} onBlur={this.toggleEdit} onFocus={func.autoSelect} onChange={func.changeValue} />;
		var staticTitle = <div onClick={this.toggleEdit}>{data.title[contentType]}</div>;

		var renderTitle = this.state.edit ? editTitle : staticTitle;

		return renderTitle;

	},

	render: function() {

		return (
			<h2>{this.renderTitle()}</h2>
		)

	}

} );
