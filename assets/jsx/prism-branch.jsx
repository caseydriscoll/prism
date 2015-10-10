var PrismBranch = React.createClass( {

	getInitialState: function() {
		return { branches: { '': { leaves: [] } } };
	},

	addLeaf: function() {

		var state = this.state;

		state.branches[this.props.active].leaves.unshift( { 'id' : 'new' } );

		this.setState( state );
	},

	loadLeaves: function() {
		if ( this.props.active == '' ) return;

		if ( this.props.active in this.state.branches ) return;

		jQuery.ajax( {
			method  : 'GET',
			url     : PRISM.url + this.props.active,
			success : function( response ) {

				var state = this.state;

				state.branches[this.props.active] = { leaves: response };

				this.setState( state );

			}.bind( this )
		} );

	},

	render: function() {

		this.loadLeaves();

		var prismAddLeaf = this.props.active != '' ? <PrismAddLeaf addLeaf={this.addLeaf} /> : '';

		var prismLeafNodes = this.state.branches[this.props.active].leaves.map( function( leaf, i ) {
			return <PrismLeafNode data={leaf} key={i} />;
		} );

		return (
			<div id="prism-branch">
				<PrismBranchHeader active={this.props.active} />
				<ul id="prism-leaves">
					{prismAddLeaf}
					{prismLeafNodes}
				</ul>
			</div>
		);
	}

} );

var PrismBranchHeader = React.createClass( {

	render: function() {
		return (
			<header id="prism-branch-header">
				<h2>{this.props.active}</h2>
			</header>
		);
	}

} );


var PrismAddLeaf = React.createClass( {

	render: function() {

		var data = { 'id' : '' };

		return <PrismLeafNode data={data} id="prism-add-leaf" onClick={this.props.addLeaf} key={0} />;
	}

} );


var PrismLeafNode = React.createClass( {

	render: function() {
		return (
			<li id={this.props.id} className="prism-leaf" key={this.props.key} onClick={this.props.onClick}>
				<span>{this.props.data.id}</span>
			</li>
		)
	}

} );