var PrismBranch = React.createClass( {

	render: function() {

		var auth = this.props.auth;
		var data = this.props.data;
		var func = this.props.func;

		var prismLeafNodes = Object.keys( data.leaves ).reverse().map( function( key ) {

			var leaf = data.leaves[key];

			if ( leaf.id == data.leaf )
				leaf.active = 'active';
			else
				leaf.active = '';

			return <PrismLeafNode data={leaf} key={key} func={func} type={data.title} />

		}, this );

		return (
			<div id="prism-branch" className={data.view}>
				<PrismBranchHeader auth={auth} data={data} func={func} />
				<ul id="prism-leaves">
					{prismLeafNodes}
				</ul>
			</div>
		);
	}

} );


var PrismBranchHeader = React.createClass( {

	render: function() {

		var auth = this.props.auth;
		var data = this.props.data;
		var func = this.props.func;

		var grid = data.view == 'grid' ? ' fa-th active'   : ' fa-th';
		var list = data.view == 'list' ? ' fa-list active' : ' fa-list';

		var classes = 'fa fa-border fa-pull-right fa-2x';

		var renderAddLeaf = auth ? <i id="prism-add-leaf" className={classes + ' fa-plus'} onClick={func.addLeaf}></i> : null;

		return (
			<header id="prism-branch-header">
				<h2>{data.title}</h2>
				<div id="prism-branch-visual-controls">
					<i id="prism-branch-rows" data-view="list" className={classes + list} onClick={func.changeView}></i>
					<i id="prism-branch-grid" data-view="grid" className={classes + grid} onClick={func.changeView}></i>
					{renderAddLeaf}
				</div>
			</header>
		);
	}

} );


var PrismLeafNode = React.createClass( {

	id : function() {
		return this.props.data.type + "-" + this.props.data.id;
	},

	render: function() {

		var auth = this.props.auth;
		var data = this.props.data;
		var func = this.props.func;
		var type = this.props.type;

		var id    = this.id();
		var href  = '/#/' + type + '/' + data.id;
		var title = data.title.rendered;

		var styles  = {};
		var classes = 'prism-leaf ' + data.active;

		if ( type == 'media' && data.media_type == 'image' ) {
			var thumbnail  = data.media_details.sizes.thumbnail.source_url;

			styles.color           = 'white';
			styles.backgroundImage = 'url(' + thumbnail + ')';
			styles.backgroundSize  = 'cover';

			classes += ' ' + type;
		}

		return (
			<li id={id} className={classes} key={this.props.key} style={styles}>
				<a href={href} data-title={title} data-id={data.id}>{title}</a>
			</li>
		)
	}

} );