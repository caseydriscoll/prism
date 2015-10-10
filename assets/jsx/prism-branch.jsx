var PrismBranch = React.createClass( {

	render: function() {

		this.props.loadLeaves();

		var prismAddLeaf = this.props.active.branch != '' ? <PrismAddLeaf addLeaf={this.props.addLeaf} /> : '';

		var prismLeafNodes = this.props.branches[this.props.active.branch].leaves.map( function( leaf, i ) {
			return <PrismLeafNode data={leaf} key={i} onClick={this.props.changeLeaf} />;
		}, this );

		return (
			<div id="prism-branch">
				<PrismBranchHeader title={this.props.active.branch} />
				<ul id="prism-leaves">
					{prismAddLeaf}
					{prismLeafNodes}
				</ul>
			</div>
		);
	}

} );

var PrismBranchHeader = React.createClass( {

	render: function() {
		return (
			<header id="prism-branch-header">
				<h2>{this.props.title}</h2>
			</header>
		);
	}

} );


var PrismAddLeaf = React.createClass( {

	render: function() {

		var data = { 'id' : '' };

		return <PrismLeafNode data={data} id="prism-add-leaf" onClick={this.props.addLeaf} key={0} />;
	}

} );


var PrismLeafNode = React.createClass( {

	render: function() {

		var title = '';

		if ( this.props.data.id == 'new' )
			title = 'New';
		else if ( this.props.data.id == '' )
			title = '';
		else
			title = this.props.data.title.rendered;

		return (
			<li id={this.props.id} className="prism-leaf" key={this.props.key} onClick={this.props.onClick}>
				<span data-title={title}>{title}</span>
			</li>
		)
	}

} );