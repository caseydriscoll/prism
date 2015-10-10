var PrismTree = React.createClass( {

	getInitialState: function() {

		var state = { 
			branches: {},
			active : { branch : null, leaf : null }
		};

		return state;
	},

	changeLeaf: function(e) {
		e.preventDefault();

		jQuery( '.prism-leaf span' ).removeClass( 'active' );

		e.nativeEvent.target.classList.toggle( 'active' );

		var state = this.state;

		state.active.leaf = jQuery( e.nativeEvent.target ).data( 'title' );

		this.setState( state );
	},

	changeBranch: function(e) {
		e.preventDefault();

		jQuery( '#prism-menu a' ).removeClass( 'active' );

		e.nativeEvent.target.classList.toggle( 'active' );

		var state = this.state;

		state.active.branch = jQuery( e.nativeEvent.target ).data( 'slug' );

		this.setState( state );

		this.loadLeaves();
	},

	addLeaf: function() {
		var state = this.state;
		var active = this.state.active;

		state.branches[active.branch].leaves.unshift( { 'id' : 'new' } );

		this.setState( state );
	},

	loadLeaves: function() {

		if ( this.state.active.branch in this.state.branches ) return;

		jQuery.ajax( {
			method  : 'GET',
			url     : PRISM.url + this.state.active.branch + '?filter[posts_per_page]=-1',
			success : function( response ) {

				var state = this.state;

				state.branches[this.state.active.branch] = { leaves: response };

				this.setState( state );

			}.bind( this )
		} );

	},

	branchData: function() {

		var branchData = {
			title: this.state.active.branch
		}

		return branchData;
	},

	leafData: function() {

		var leafData = {
			title   : this.state.active.leaf
		}

		if ( this.state.branches[this.state.active.branch] != undefined ) {
			leafData.content = this.state.branches[this.state.active.branch].leaves[0].content.rendered;
		}

		return leafData;
	},

	render: function() {

		var active = this.state.active;

		var leaves = this.state.branches[active.branch] == undefined ? [] : this.state.branches[active.branch].leaves;

		var prismBranch = <PrismBranch data={this.branchData()} leaves={leaves} changeLeaf={this.changeLeaf} addLeaf={this.addLeaf} />;
		var prismLeaf   = <PrismLeaf   data={this.leafData()} />;

		var renderBranch = active.branch == null ? null : prismBranch;
		var renderLeaf   = active.leaf   == null ? null : prismLeaf;

		return (

			<div id="prism-tree">
				<PrismTrunk changeBranch={this.changeBranch} />
				{renderBranch}
				{renderLeaf}
			</div>

		);
	}

} );