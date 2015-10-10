var PrismBody = React.createClass( {

	getInitialState: function() {

		var posts = Array(0);

		for ( var i = 15; i >= 0; i-- )
			posts.push( { 'id' : i } );

		var state = {
			'posts' : posts
		};

		return state;
	},

	addLeaf: function() {
		var state = this.state;

		state.posts.unshift( { 'id' : state.posts.length } );

		this.setState( state );
	},

	render: function() {

		var prismBranches = PRISM.branches.map( function( branch, i ) {
			return <PrismBranch addLeaf={this.addLeaf} leaves={this.state.posts} key={i} />;
		}, this );

		return (

			<div id="prism-body">
				<PrismTrunk />
				{prismBranches}
				<PrismLeaf />
			</div>

		);
	}

} );