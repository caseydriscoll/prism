var PrismBranch = React.createClass( {

	render: function() {

		var prismLeafNodes = Object.keys( this.props.data.leaves ).reverse().map( function( key ) {

			var leaf = this.props.data.leaves[key];

			if ( leaf.id == this.props.data.leaf )
				leaf.active = 'active';
			else
				leaf.active = '';

			return <PrismLeafNode data={leaf} key={key} onClick={this.props.functions.changeLeaf} />

		}, this );

		return (
			<div id="prism-branch" className={this.props.data.view}>
				<PrismBranchHeader auth={this.props.auth} data={this.props.data} changeView={this.props.functions.changeView} addLeaf={this.props.functions.addLeaf} />
				<ul id="prism-leaves">
					{prismLeafNodes}
				</ul>
			</div>
		);
	}

} );


var PrismBranchHeader = React.createClass( {

	render: function() {

		var classes = 'fa fa-border fa-pull-right fa-2x';

		var grid = this.props.data.view == 'grid' ? ' fa-th active'   : ' fa-th';
		var list = this.props.data.view == 'list' ? ' fa-list active' : ' fa-list';

		var renderAddLeaf = this.props.auth ? <i id="prism-add-leaf" className={classes + ' fa-plus'} onClick={this.props.addLeaf}></i> : null;

		return (
			<header id="prism-branch-header">
				<h2>{this.props.data.title}</h2>
				<div id="prism-branch-visual-controls">
					<i id="prism-branch-rows" data-view="list" className={classes + list} onClick={this.props.changeView}></i>
					<i id="prism-branch-grid" data-view="grid" className={classes + grid} onClick={this.props.changeView}></i>
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

	componentDidMount: function() {
		if ( PRISM.newleaf ) {
			PRISM.newleaf = false;

			jQuery( '#prism-leaf-header h2' ).click();
		}

	},

	render: function() {

		var id      = this.id();
		var title   = this.props.data.title.rendered;

		var classes = 'prism-leaf ' + this.props.data.active;

		return (
			<li id={id} className={classes} key={this.props.key} onClick={this.props.onClick}>
				<span data-title={title} data-id={this.props.data.id}>{title}</span>
			</li>
		)
	}

} );