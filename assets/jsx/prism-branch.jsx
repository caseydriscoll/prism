var PrismBranch = React.createClass( {

	render: function() {

		var prismLeafNodes = Object.keys( this.props.leaves ).reverse().map( function( key ) {

			var leaf = this.props.leaves[key];

			if ( leaf.id == this.props.data.leaf )
				leaf.active = 'active';
			else
				leaf.active = '';

			return <PrismLeafNode data={leaf} key={key} onClick={this.props.changeLeaf} />

		}, this );

		return (
			<div id="prism-branch" className={this.props.data.view}>
				<PrismBranchHeader data={this.props.data} changeGrid={this.props.changeGrid} addLeaf={this.props.addLeaf} />
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

		return (
			<header id="prism-branch-header">
				<h2>{this.props.data.title}</h2>
				<div id="prism-branch-visual-controls">
					<i id="prism-branch-rows" data-view="list" className={classes + list} onClick={this.props.changeGrid}></i>
					<i id="prism-branch-grid" data-view="grid" className={classes + grid} onClick={this.props.changeGrid}></i>
					<i id="prism-add-leaf" className={classes + ' fa-plus'} onClick={this.props.addLeaf}></i>
				</div>
			</header>
		);
	}

} );


var PrismLeafNode = React.createClass( {

	render: function() {

		var title   = this.props.data.title.rendered;

		var classes = 'prism-leaf ' + this.props.data.active;

		return (
			<li id={this.props.data.id} className={classes} key={this.props.key} onClick={this.props.onClick}>
				<span data-title={title} data-id={this.props.data.id}>{title}</span>
			</li>
		)
	}

} );