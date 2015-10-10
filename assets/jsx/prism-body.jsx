var PrismBody = React.createClass( {

	render: function() {

		return (

			<div id="prism-body">
				<PrismTrunk changeActiveBranch={this.props.changeActiveBranch} />
				<PrismBranch active={this.props.active} />
				<PrismLeaf />
			</div>

		);
	}

} );