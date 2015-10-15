var PrismLeaf = React.createClass( {

	getInitialState : function() {
		return { edit : false }
	},

	toggleEdit: function() {

		if ( this.props.auth )
			this.setState( { edit : this.state.edit ? false : true } );

	},

	prepLeaf: function(e) {

		var data = this.props.data;
		var func = this.props.func;

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

		var content = data.content.rendered;

		var editContent    = <textarea autoFocus readOnly id="prism-leaf-content" value={content} onBlur={this.toggleEdit} onFocus={this.autoSelect} />;
		var staticContent  = <div id="prism-leaf-content" onDoubleClick={this.toggleEdit}>{content}</div>;

		var renderContent  = this.state.edit == true ? editContent : staticContent;

		return renderContent;

	},

	renderMetaPanel: function() {

		var auth = this.props.auth;
		var data = this.props.data;
		var func = this.props.func;

		if ( data.isMetaPanelOpen )
			return <PrismLeafMetaPanel auth={auth} data={data} />;
		else
			return null;

	},

	render: function() {

		var auth = this.props.auth;
		var data = this.props.data;
		var func = this.props.func;

		func.prepLeaf = this.prepLeaf;
		func.autoSelect = this.autoSelect;

		var leafClasses = data.isMetaPanelOpen ? 'metapanel-open' : 'metapanel-closed';

		return (
			<div id="prism-leaf" className={leafClasses}>
				<PrismLeafHeader auth={auth} data={data} func={func} />
				{this.renderContentPanel()}
				{this.renderMetaPanel()}
			</div>
		);
	}

} );