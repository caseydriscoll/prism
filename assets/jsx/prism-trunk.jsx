var PrismTrunk = React.createClass( {

	render: function() {

		log( 11, 'beg PrismTrunk.render()' );

		var data = this.props.data;
		var func = this.props.func;

		var style = { 'width' : data.width + '%' };

		log( 11, 'end PrismTrunk.render()' );

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

		log( 11, 'beg PrismSearchStatus.search()' );

		var search = this.props.data.search;
		var value  = e.target.value;

		if ( value == '' ) {
			window.location = '/#/';
			return;
		}

		window.location = '/#/search?query=' + value;

		log( 12, 'end PrismSearchStatus.search()' );

	},

	autoSelect: function(e) {
		e.nativeEvent.target.select();
	},

	render: function() {

		log( 11, 'beg PrismSearch.render()' );

		var data = this.props.data;
		var func = this.props.func;

		var value   = data.search.query;
		var focus   = data.active.branch == 'search' ? true : false;

		var classes  = 'prism-tree-header';
		    classes += data.active.branch == 'search' ? ' active' : '';

		log( 12, 'end PrismSearch.render()' );

		return (
			<div id="prism-search" className={classes}>
				<input type="text" placeholder="Search" id='prism-search-bar' defaultValue={value} onClick={this.changeBranch} onBlur={this.search} onFocus={this.autoSelect} autoFocus={focus} />
			</div>
		);

	}

} );


var PrismMenu = React.createClass( {

	render: function() {

		var data = this.props.data;

		var menuItems = PRISM.branches.map( function( branch, i ) {

			var branchPlural = branch.slug.plural;
			var href         = '';

			if ( 'route' in branch ) {
				href = branch.route;
			} else {
				href = '/#/' + branchPlural;
			}

			var active  = branchPlural == data.active.branch || ( branchPlural == 'home' && data.active.branch == null );
			var parent  = data.active.parent;

			var classes = active ? 'active'  : '';
			classes    += active && parent.branch != null ? ' parent' : '';

			var title   = branch.title;

			var parentLink = function() {

				if ( active && parent.branch != null ) {

					var leaf = data.active.parent.leaf;
					var parentSingle;

					PRISM.branches.map( function( b, i ) {
						if ( b.slug.plural == parent.branch ) parentSingle = b.slug.single;
					} );

					var href = '/#/' + parentSingle + '/' + leaf.slug;

					var link = <a href={href} className='active parent'>in {parent.leaf.slug}</a>
				}

				return link;

			}.bind( this );

			var iconClasses = branch.icon == null ? "fa fa-fw fa-thumb-tack" : "fa fa-fw " + branch.icon;

			return (
				<li key={i}>
					<a href={href} id={branchPlural} className={classes}>
						<i className={iconClasses}></i>{title}
					</a>
					{parentLink()}
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