var PrismBranch = React.createClass( {

	render: function() {

		var prismLeafNodes = Object.keys( this.props.leaves ).reverse().map( function( key ) {

			var leaf = this.props.leaves[key];

			return <PrismLeafNode data={leaf} key={key} onClick={this.props.changeLeaf} />

		}, this );

		return (
			<div id="prism-branch">
				<PrismBranchHeader title={this.props.data.title} />
				<ul id="prism-leaves">
					<PrismAddLeaf addLeaf={this.props.addLeaf} />
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

		var data = { 'id' : 'prism-add-leaf' };

		return <PrismLeafNode data={data} onClick={this.props.addLeaf} key={0} />;
	}

} );


var PrismLeafNode = React.createClass( {

	render: function() {

		var title = '';

		if ( this.props.data.id == 'prism-add-leaf' )
			title = '';
		else
			title = this.props.data.title.rendered;

		return (
			<li id={this.props.data.id} className="prism-leaf" key={this.props.key} onClick={this.props.onClick}>
				<span data-title={title} data-id={this.props.data.id}>{title}</span>
			</li>
		)
	}

} );