var PrismBranch = React.createClass( {

	/**
	 * Handles every later case, when user updates the branch
	 */
	componentDidUpdate: function() {

		log( 11, 'beg PrismBranch.componentDidUpdate()' );

		this.scrollLeaf();

		log( 12, 'end PrismBranch.componentDidUpdate()' );

	},

	scrollLeaf: function() {
		var data = this.props.data;

		var activeLeafID = window.location.hash.substring( 2 );

		var activeLeaf = document.getElementById( activeLeafID );
		var container  = document.getElementById( 'prism-branch' );
		var offset     = document.getElementById( 'prism-branch-header' );

		if ( offset == null || activeLeaf == null ) return;

		offset = offset.offsetHeight + 10;

		document.getElementById( 'prism-leaves' ).scrollTop = activeLeaf.offsetTop - offset;
	},

	render: function() {

		log( 11, 'beg PrismBranch.render()' );

		var auth = this.props.auth;
		var data = this.props.data;
		var func = this.props.func;

		var style = { 'width' : data.width + '%' };

		var prismLeafNodes = Object.keys( data.leaves ).reverse().map( function( key ) {

			var leaf = data.leaves[key];

			if ( leaf.id == data.active.leaf.id )
				leaf.active = 'active';
			else
				leaf.active = '';

			var branch;
			var parentBranch;

			leaf.href = '';

			if ( data.active.parent.branch != null ) {
				parentBranch = getSingular( data.active.parent.branch );

				leaf.href += parentBranch + '/' + data.active.parent.leaf.slug + '/';
			}

			branch = getSingular( leaf.type );

			if ( leaf.type == 'post' )       branch = 'post';
			if ( leaf.type == 'attachment' ) branch = 'media';

			leaf.href += branch + '/' + leaf.slug;

			return <PrismLeafNode data={leaf} key={key} func={func} />

		}, this );

		log( 12, 'end PrismBranch.render()' );

		return (
			<div id="prism-branch" className={data.view} style={style} data-section="branch">
				<PrismBranchHeader auth={auth} data={data} func={func} />
				<ul id="prism-leaves">
					{prismLeafNodes}
				</ul>
				<PrismResizeBar data={data} func={func} />
			</div>
		);
	}

} );


var PrismBranchHeader = React.createClass( {

	changeView: function(e) {

		log( 11, 'beg PrismBranchHeader.changeView()' );

		e.preventDefault();

		var view = e.target.dataset.view;

		this.props.func.changeView( view );

		log( 12, 'end PrismBranchHeader.changeView()' );

	},

	newLeaf : function() {
		var branch = getSingular( this.props.data.active.branch );

		window.location.hash = '/' + branch + '/new';
	},

	render: function() {

		log( 11, 'beg PrismBranchHeader.render()' );

		var auth = this.props.auth;
		var data = this.props.data;
		var func = this.props.func;

		var grid = data.view == 'grid' ? ' fa-th active'       : ' fa-th';
		var half = data.view == 'half' ? ' fa-th-large active' : ' fa-th-large';
		var full = data.view == 'full' ? ' fa-square active'   : ' fa-square';
		var list = data.view == 'list' ? ' fa-list active'     : ' fa-list';

		var classes = 'fa fa-pull-right fa-2x';

		var newLeafButton = <i id="prism-add-leaf" className={classes + ' fa-plus'} onClick={this.newLeaf}></i>;

		var renderNewLeaf = auth && data.active.branch !== 'search' ? newLeafButton : null;

		log( 12, 'end PrismBranchHeader.render()' );

		return (
			<header id="prism-branch-header" className="prism-tree-header">
				<h2>{data.active.branch}</h2>
				<div id="prism-branch-visual-controls">
					<i id="prism-branch-view-rows" data-view="list" className={classes + list} onClick={this.changeView}></i>
					<i id="prism-branch-view-full" data-view="full" className={classes + full} onClick={this.changeView}></i>
					<i id="prism-branch-view-half" data-view="half" className={classes + half} onClick={this.changeView}></i>
					<i id="prism-branch-view-grid" data-view="grid" className={classes + grid} onClick={this.changeView}></i>
					{renderNewLeaf}
				</div>
			</header>
		);
	}

} );


var PrismLeafNode = React.createClass( {

	id : function() {

		log( 1, 'beg PrismLeafNode.id()' );

		var id = this.props.data.type;

		if ( id == null ) return 'no-search-results';

		if ( this.props.data.type == 'attachment' )
			id = 'media';

		id += "/" + this.props.data.slug;

		log( 2, 'end PrismLeafNode.id()' );

		return id;
	},

	render: function() {

		log( 1, 'beg PrismLeafNode.render()' );

		var auth = this.props.auth;
		var data = this.props.data;
		var func = this.props.func;

		var id    = this.id();

		if ( id == 'no-search-results' ) data.href = 'search';

		var classes  = 'prism-leaf ' + data.active;
		    classes += data.new != undefined ? ' new' : '';

		var thumbnail = { 
			url     : null, 
			styles  : {},
			classes : 'media'
		};

		if ( data.type == 'attachment' && data.media_type == 'image' )
			thumbnail.url = data.media_details.sizes.thumbnail.source_url;

		if ( 'featured_image_thumbnail_url' in data )
			thumbnail.url = data.featured_image_thumbnail_url;

		if ( thumbnail.url != null ) {
			thumbnail.styles.backgroundImage = 'url(' + thumbnail.url + ')';
			classes += ' media';
		}

		var contentType, content = null;

		if ( data.content != null ) {
			contentType = data.content.raw == null ? 'rendered' : 'raw';
			content = data.content[contentType].length > 0 ? data.content[contentType].substring( 0, 75 ) + '...' : '';
		}

		log( 2, 'end PrismLeafNode.render()' );

		return (
			<li id={data.href} className={classes} key={this.props.key}>
				<a href={ '#/' + data.href}>
					<h4>{data.title[contentType]}</h4>
					<p>{content}</p>
				</a>
				<b className={thumbnail.classes} style={thumbnail.styles}></b>
			</li>
		)
	}

} );