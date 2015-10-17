var PrismTrunk = React.createClass( {

	render: function() {

		var data = this.props.data;
		var func = this.props.func;

		var style = { 'width' : data.width + '%' };

		return (
			<div id="prism-trunk" style={style} data-section='trunk'>
				<PrismSearch />
				<PrismMenu      data={data} />
				<PrismResizeBar data={data} func={func} />
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

			var classes = branch.slug == this.props.data.branch ? 'active' : '';

			return (
				<li key={i}>
					<a href={'/#/' + branch.slug} id={branch.slug} className={classes} data-slug={branch.slug}>{branch.title}</a>
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