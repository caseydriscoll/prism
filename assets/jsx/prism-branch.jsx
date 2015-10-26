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

		var activeLeafID = data.title + '/' + data.leaf;

		var activeLeaf = document.getElementById( activeLeafID );
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

			leaf.href = '/#/';

			if ( data.active.parent.branch != null ) {
				// TODO: Currently cycles through whole map, convert to 'some' or use for/break?
				PRISM.branches.map( function( b, i ) {
					if ( b.slug.plural == data.active.parent.branch ) parentBranch = b.slug.single;
				} );

				leaf.href += parentBranch + '/' + data.active.parent.leaf.slug + '/';
			}


			// TODO: Currently cycles through whole map, convert to 'some' or use for/break?
			PRISM.branches.map( function( b, i ) {
				if ( b.slug.plural == leaf.type ) branch = b.slug.single;
			} );

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

	render: function() {

		log( 11, 'beg PrismBranchHeader.render()' );

		var auth = this.props.auth;
		var data = this.props.data;
		var func = this.props.func;

		var grid = data.view == 'grid' ? ' fa-th active'       : ' fa-th';
		var half = data.view == 'half' ? ' fa-th-large active' : ' fa-th-large';
		var full = data.view == 'full' ? ' fa-square active'   : ' fa-square';
		var list = data.view == 'list' ? ' fa-list active'     : ' fa-list';

		var classes = 'fa fa-border fa-pull-right fa-2x';

		var renderAddLeaf = auth && data.active.branch !== 'search' ? <i id="prism-add-leaf" className={classes + ' fa-plus'} onClick={func.addLeaf}></i> : null;

		log( 12, 'end PrismBranchHeader.render()' );

		return (
			<header id="prism-branch-header">
				<h2>{data.active.branch}</h2>
				<div id="prism-branch-visual-controls">
					<i id="prism-branch-view-rows" data-view="list" className={classes + list} onClick={this.changeView}></i>
					<i id="prism-branch-view-full" data-view="full" className={classes + full} onClick={this.changeView}></i>
					<i id="prism-branch-view-half" data-view="half" className={classes + half} onClick={this.changeView}></i>
					<i id="prism-branch-view-grid" data-view="grid" className={classes + grid} onClick={this.changeView}></i>
					{renderAddLeaf}
				</div>
			</header>
		);
	}

} );


var PrismLeafNode = React.createClass( {

	id : function() {

		log( 1, 'beg PrismLeafNode.id()' );

		var id = this.props.data.type;

		if ( id.slice(-1) != 's' )
			id += 's';

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

		// TODO: Don't do this.
		// This is an UGLY stop gap to get around the post/posts problem
		// if ( type.slice(-1) != 's' )
		// 	type += 's';

		// if ( this.props.type == 'media' )
		// 	type = this.props.type;

		var id    = this.id();

		var styles  = {};
		var classes = 'prism-leaf ' + data.active;

		// if ( type == 'media' && data.media_type == 'image' ) {
		// 	var thumbnail  = data.media_details.sizes.thumbnail.source_url;

		// 	styles.backgroundImage = 'url(' + thumbnail + ')';

		// 	classes += ' ' + type;
		// }

		log( 2, 'end PrismLeafNode.render()' );

		return (
			<li id={id} className={classes} key={this.props.key} style={styles}>
				<a href={data.href}>{data.title.rendered}</a>
			</li>
		)
	}

} );