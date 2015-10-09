var PrismBranch = React.createClass( {

	render: function() {
		return (
			<div id="prism-branch">
				<PrismBranchHeader />
			</div>
		);
	}

} );

var PrismBranchHeader = React.createClass( {

	render: function() {
		return (
			<header id="prism-branch-header">
				<h2>Branch Type</h2>
			</header>
		);
	}

} );