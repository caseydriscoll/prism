var PrismTrunk = React.createClass( {

	render: function() {

		var auth = this.props.auth;
		var func = this.props.func;

		return (
			<div id="prism-trunk">
				<PrismSearch />
				<PrismMenu func={func} />
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

		var func = this.props.func;

		var menuItems = PRISM.branches.map( function( branch, i ) {
			return (
				<li key={i}>
					<a href={'#' + branch.slug} data-slug={branch.slug} onClick={func.changeBranch}>{branch.title}</a>
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