var PrismLeaf = React.createClass( {

	render: function() {
		return (
			<div id="prism-leaf">
				<header id="prism-leaf-header">
					<h2>{this.props.data.title}</h2>
				</header>
				<div id="prism-leaf-content">
					{this.props.data.content}
				</div>
			</div>
		);
	}

} );
