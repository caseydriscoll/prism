var PrismLeafHeader = React.createClass( {

	render: function() {

		var auth = this.props.auth;
		var data = this.props.data;
		var func = this.props.func;

		return (
			<header id="prism-leaf-header">
				<PrismLeafTitle auth={auth} data={data.title.rendered} func={func} />
				<PrismLeafMetaIcon type='toggle' data={data} func={func} />
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
