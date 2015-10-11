var PrismHeader = React.createClass( {

	render: function() {
		return (
			<header id="prism-header">
				<h1 className="title">{PRISM.title}</h1>
				<span className="description">{PRISM.description}</span>
			</header>
		);
	}

} );