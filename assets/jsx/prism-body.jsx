var PrismBody = React.createClass( {

	getInitialState: function() {
		return { leaves: [] };
	},

	addLeaf: function() {
		var state = this.state;

		state.leaves.unshift( { 'id' : state.leaves.length } );

		this.setState( state );
	},

	render: function() {

		return (

			<div id="prism-body">
				<PrismTrunk changeActiveBranch={this.props.changeActiveBranch} />
				<PrismBranch addLeaf={this.addLeaf} leaves={this.state.leaves} active={this.props.active} />
				<PrismLeaf />
			</div>

		);
	}

} );