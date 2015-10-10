var PrismTree = React.createClass( {

	getInitialState: function() {
		return { branches: { '': { leaves: [] } } };
	},

	addLeaf: function() {
		var state = this.state;
		var active = this.props.active.branch;

		state.branches[active].leaves.unshift( { 'id' : 'new' } );

		this.setState( state );
	},

	loadLeaves: function() {
		if ( this.props.active.branch == '' ) return;

		if ( this.props.active.branch in this.state.branches ) return;

		jQuery.ajax( {
			method  : 'GET',
			url     : PRISM.url + this.props.active.branch + '?filter[posts_per_page]=-1',
			success : function( response ) {

				var state = this.state;

				state.branches[this.props.active.branch] = { leaves: response };

				this.setState( state );

			}.bind( this )
		} );

	},

	render: function() {

		return (

			<div id="prism-tree">
				<PrismTrunk changeBranch={this.props.changeBranch} />
				<PrismBranch 
					active={this.props.active}
					branches={this.state.branches}
					changeLeaf={this.props.changeLeaf} 
					addLeaf={this.addLeaf} 
					loadLeaves={this.loadLeaves} />
				<PrismLeaf active={this.props.active.leaf} />
			</div>

		);
	}

} );