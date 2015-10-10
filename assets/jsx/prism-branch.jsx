var PrismBranch = React.createClass( {

	render: function() {

		var prismAddLeaf = this.props.active != '' ? <PrismAddLeaf addLeaf={this.props.addLeaf} /> : '';

		var prismLeafNodes = this.props.leaves.map( function( leaf, i ) {
			return <PrismLeafNode data={leaf} key={i} />;
		} );

		return (
			<div id="prism-branch">
				<PrismBranchHeader active={this.props.active} />
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
				<h2>{this.props.active}</h2>
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
		return (
			<li id={this.props.id} className="prism-leaf" key={this.props.key} onClick={this.props.onClick}>
				<span>{this.props.data.id}</span>
			</li>
		)
	}

} );