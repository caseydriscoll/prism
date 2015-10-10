var PrismLeaf = React.createClass( {

	render: function() {
		return (
			<div id="prism-leaf">
				<PrismLeafHeader title={this.props.title} />
			</div>
		);
	}

} );

var PrismLeafHeader = React.createClass( {

	render: function() {
		return (
			<header id="prism-leaf-header">
				<h2>{this.props.title}</h2>
			</header>
		);
	}

} );