var PrismBranch = React.createClass( {

	render: function() {
		return (
			<div id="prism-branch">
				<PrismBranchHeader />
				<PrismAddLeaf />
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

var PrismAddLeaf = React.createClass( {

	render: function() {
		return (
			<div id="prism-add-leaf" className="prism-leaf">
				<a></a>
			</div>
		);
	}

} );