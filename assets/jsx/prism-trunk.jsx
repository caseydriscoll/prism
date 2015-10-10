var PrismTrunk = React.createClass( {

	render: function() {
		return (
			<div id="prism-trunk">
				<PrismSearch />
				<PrismMenu />
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

		var menuItems = PRISM.branches.map( function( menuItem, i ) {
			return (
				<li key={i}>
					<a href={menuItem.url}>{menuItem.title}</a>
				</li>
			);
		} );

		return (
			<menu id="prism-menu">
				<ul>
					{menuItems}
				</ul>
			</menu>
		);
	}

} );