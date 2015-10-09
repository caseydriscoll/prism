var PrismLeaf = React.createClass( {

	render: function() {
		return (
			<div id="prism-leaf">
				<PrismLeafHeader />
			</div>
		);
	}

} );

var PrismLeafHeader = React.createClass( {

	render: function() {
		return (
			<header id="prism-leaf-header">
				<h2>Leaf Name</h2>
			</header>
		);
	}

} );