var PrismLeaf = React.createClass( {

	render: function() {
		return (
			<div id="prism-leaf">
				<header id="prism-leaf-header">
					<h2>
						{this.props.data.title.rendered}
						<date>{this.props.data.date.replace( 'T', ' ' )}</date>
					</h2>
				</header>
				<div id="prism-leaf-content">
					{this.props.data.content.rendered}
				</div>
			</div>
		);
	}

} );
