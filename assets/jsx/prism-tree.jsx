var PrismTree = React.createClass( {

	getInitialState: function() {

		var state = { 
			branches: {},
			active : { branch : null }
		};

		return state;
	},

	changeLeaf: function(e) {
		e.preventDefault();

		jQuery( '.prism-leaf span' ).removeClass( 'active' );

		e.nativeEvent.target.classList.toggle( 'active' );

		var state = this.state;

		state.branches[state.active.branch].leaf = jQuery( e.nativeEvent.target ).data( 'id' );

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

	changeGrid : function(e) {
		e.preventDefault();

		jQuery( '#prism-branch-visual-controls i' ).removeClass( 'active' );

		var state = this.state;

		state.branches[state.active.branch].view = jQuery( e.nativeEvent.target ).data( 'view' );

		this.setState( state );
	},

	addLeaf: function() {
		var state = this.state;
		var active = this.state.active;

		state.branches[active.branch].leaves['new'] = { 
			id : 'new',
			date : new Date().toISOString().slice(0, 19),
			content : {
				rendered : '',
			},
			title : {
				rendered : 'new'
			}
		};

		this.setState( state );
	},

	loadLeaves: function() {

		if ( this.state.active.branch in this.state.branches ) return;

		jQuery.ajax( {
			method  : 'GET',
			url     : PRISM.url + this.state.active.branch + '?filter[posts_per_page]=-1',
			success : function( response ) {

				var state = this.state;

				var leaves = {};

				for ( var i = 0; i < response.length; i++ ) {
					var leaf = response[i];

					leaves[leaf.id] = leaf;
				}

				state.branches[this.state.active.branch] = { leaves: leaves, view: 'grid' };

				this.setState( state );

			}.bind( this )
		} );

	},

	branchData: function() {

		var branchData = {};

		var branch = this.state.active.branch;

		if ( this.state.branches[branch] !== undefined ) {
			branchData = {
				title : branch,
				view  : this.state.branches[branch].view
			}
		}

		return branchData;
	},

	leafData: function() {

		var leafData = {};

		var branch = this.state.active.branch;

		if ( this.state.branches[branch] !== undefined  )
			leafData = this.state.branches[branch].leaves[this.state.branches[branch].leaf];

		return leafData;
	},

	render: function() {

		var active = this.state.active;

		var leaves = this.state.branches[active.branch] == undefined ? [] : this.state.branches[active.branch].leaves;

		var prismBranch = <PrismBranch data={this.branchData()} leaves={leaves} changeLeaf={this.changeLeaf} changeGrid={this.changeGrid} addLeaf={this.addLeaf} />;
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