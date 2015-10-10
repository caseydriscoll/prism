var PrismTrunk = React.createClass( {

	render: function() {
		return (
			<div id="prism-trunk">
				<PrismSearch />
				<PrismMenu onClick={this.props.changeActiveBranch} />
			</div>
		);
	}

} );


var PrismSearch = React.createClass( {

	render: function() {

		return (
			<div id="prism-search">
				<input type="text" placeholder="Search" />
			</div>
		);

	}

} );


var PrismMenu = React.createClass( {

	render: function() {

		var menuItems = PRISM.branches.map( function( branch, i ) {
			return (
				<li key={i}>
					<a href={'#' + branch.slug} data-slug={branch.slug} onClick={this.props.onClick}>{branch.title}</a>
				</li>
			);
		}, this );

		return (
			<menu id="prism-menu">
				<ul>
					{menuItems}
				</ul>
			</menu>
		);
	}

} );