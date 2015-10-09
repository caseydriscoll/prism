var PrismBody = React.createClass( {

	render: function() {

		return (

			<div id="prism-body">
				<PrismTrunk />
				<PrismBranch />
				<PrismLeaf />
			</div>

		);
	}

} );