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

			return <PrismLeafNode data={leaf} key={key} func={func} />

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

		var id    = this.id();
		var title = data.title.rendered;

		var classes = 'prism-leaf ' + data.active;

		return (
			<li id={id} className={classes} key={this.props.key} onClick={func.changeLeaf}>
				<span data-title={title} data-id={data.id}>{title}</span>
			</li>
		)
	}

} );