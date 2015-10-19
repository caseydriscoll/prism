var PrismBranch = React.createClass( {

	/**
	 * Handles initial case, when a full url mounts the branch
	 */
	componentDidMount: function() {

		log( 1, 'beg PrismBranch.componentWillMount()' );

		this.loadBranch();

		log( 2, 'end PrismBranch.componentWillMount()' );

	},

	/**
	 * Handles every later case, when user updates the branch
	 */
	componentDidUpdate: function() {

		log( 1, 'beg PrismBranch.componentWillUpdate()' );

		this.loadBranch();

		log( 2, 'end PrismBranch.componentWillUpdate()' );

	},

	loadBranch: function() {

		var data   = this.props.data;
		var func   = this.props.func;

		var branch = data.title;
		var params = '?filter[posts_per_page]=-1';

		var isNormal = branch != 'search';
		var isSearch = branch == 'search' && data.search.query != '' && data.search.query != data.search.last;

		var isEmpty  = _.isEmpty( data.leaves );

		if ( branch == 'search' ) {
			branch   = 'posts';
			params  += '&filter[s]=' + data.search.query;
		}

		if ( isSearch || ( isNormal && isEmpty ) )
			func.loadBranch( branch, params );
	},

	render: function() {

		log( 1, 'beg PrismBranch.render()' );

		var auth = this.props.auth;
		var data = this.props.data;
		var func = this.props.func;

		var style = { 'width' : data.width + '%' };

		var prismLeafNodes = Object.keys( data.leaves ).reverse().map( function( key ) {

			var leaf = data.leaves[key];

			if ( leaf.id == data.leaf )
				leaf.active = 'active';
			else
				leaf.active = '';

			return <PrismLeafNode data={leaf} key={key} func={func} type={data.title} />

		}, this );

		log( 2, 'end PrismBranch.render()' );

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

		log( 1, 'beg PrismBranchHeader.changeView()' );

		e.preventDefault();

		var view = e.target.dataset.view;

		this.props.func.changeView( view );

		log( 2, 'end PrismBranchHeader.changeView()' );

	},

	render: function() {

		log( 1, 'beg PrismBranchHeader.render()' );

		var auth = this.props.auth;
		var data = this.props.data;
		var func = this.props.func;

		var grid = data.view == 'grid' ? ' fa-th active'       : ' fa-th';
		var half = data.view == 'half' ? ' fa-th-large active' : ' fa-th-large';
		var full = data.view == 'full' ? ' fa-square active'   : ' fa-square';
		var list = data.view == 'list' ? ' fa-list active'     : ' fa-list';

		var classes = 'fa fa-border fa-pull-right fa-2x';

		var renderAddLeaf = auth && data.title !== 'search' ? <i id="prism-add-leaf" className={classes + ' fa-plus'} onClick={func.addLeaf}></i> : null;

		log( 2, 'end PrismBranchHeader.render()' );

		return (
			<header id="prism-branch-header">
				<h2>{data.title}</h2>
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

		id += "/" + this.props.data.id;

		log( 2, 'end PrismLeafNode.id()' );

		return id;
	},

	render: function() {

		log( 1, 'beg PrismLeafNode.render()' );

		var auth = this.props.auth;
		var data = this.props.data;
		var func = this.props.func;
		var type = this.props.data.type;

		// TODO: Don't do this.
		// This is an UGLY stop gap to get around the post/posts problem
		if ( type.slice(-1) != 's' )
			type += 's';

		if ( this.props.type == 'media' )
			type = this.props.type;

		var id    = this.id();
		var href  = '/#/' + type + '/' + data.id;
		var title = data.title.rendered;

		var styles  = {};
		var classes = 'prism-leaf ' + data.active;

		if ( type == 'media' && data.media_type == 'image' ) {
			var thumbnail  = data.media_details.sizes.thumbnail.source_url;

			styles.backgroundImage = 'url(' + thumbnail + ')';

			classes += ' ' + type;
		}

		log( 2, 'end PrismLeafNode.render()' );

		return (
			<li id={id} className={classes} key={this.props.key} style={styles}>
				<a href={href} data-title={title} data-id={data.id}>{title}</a>
			</li>
		)
	}

} );