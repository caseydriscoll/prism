var PrismTrunk = React.createClass( {

	render: function() {

		var data = this.props.data;
		var func = this.props.func;

		var style = { 'width' : data.width + '%' };

		return (
			<div id="prism-trunk" style={style} data-section='trunk'>
				<PrismSearch    data={data} func={func} />
				<PrismMenu      data={data} />
				<PrismResizeBar data={data} func={func} />
			</div>
		);
	}

} );


var PrismSearch = React.createClass( {

	changeBranch: function() {

		var search = this.props.data.search;

		if ( search.query == '' || search.last == search.query )
			window.location = '/#/search';
	},

	search: function(e) {

		log( 1, 'beg PrismSearch.search()' );

		var search = this.props.data.search;

		if ( search.query == '' || search.last == search.query )
			window.location = '/#/search?query=' + e.target.value;

		log( 2, 'end PrismSearch.search()' );

	},

	autoSelect: function(e) {
		e.nativeEvent.target.select();
	},

	render: function() {

		var data = this.props.data;
		var func = this.props.func;

		var value    = data.search.query;
		var focus    = data.branch == 'search' ? true : false;
		var classes  = data.branch == 'search' ? 'active' : '';

		return (
			<div id="prism-search" className={classes}>
				<input type="text" placeholder="Search" defaultValue={value} onClick={this.changeBranch} onBlur={this.search} onFocus={this.autoSelect} autoFocus={focus} />
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