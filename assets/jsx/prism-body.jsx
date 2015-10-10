var PrismBody = React.createClass( {

	render: function() {

		return (

			<div id="prism-body">
				<PrismTrunk changeBranch={this.props.changeBranch} />
				<PrismBranch active={this.props.active} changeLeaf={this.props.changeLeaf} />
				<PrismLeaf active={this.props.active.leaf} />
			</div>

		);
	}

} );