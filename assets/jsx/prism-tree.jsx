var PrismTree = React.createClass( {

	getInitialState: function() {

		var state = { 
			branches         : {},
			active           : { branch : null },
			lockMetaPanel    : PRISM.lockMetaPanel,
			isMetaPanelOpen  : false,
			currentlyChanged : false
		};

		return state;
	},

	componentDidMount: function() {

		var routes = {};
		var routerConfig = {};

		PRISM.branches.map( function( branch, i ) {

			var method = "get_" + branch.slug + "_by_id";

			routes[branch.slug]          = branch.slug;
			routes[branch.slug + "/:id"] = method;

			routerConfig[branch.slug]    = function() { this.changeBranch(branch.slug) }.bind( this );
			routerConfig[method]         = function(id) { this.changeLeaf(branch.slug, id) }.bind( this );

		}, this );

		routerConfig.routes = routes;

		var Router = Backbone.Router.extend( routerConfig );

		new Router();
		Backbone.history.start();

	},

	componentDidUpdate: function() {
		if ( this.state.active.branch == null ) return;

		this.loadLeaves();
	},

	/**
	 * Returns true if the value of this.state.active.branch is not null
	 *    and if that value is a key in this.state.branches
	 * 
	 * @return {Boolean} The status of the active branch
	 */
	hasActiveBranch: function() {

		var hasActiveBranch = false;

		if ( this.state.active.branch !== null && this.state.active.branch in this.state.branches )
			hasActiveBranch = true;

		return hasActiveBranch;

	},

	/**
	 * Returns true if there is an active branch in state,
	 *    there is an active leaf in that branch
	 *    and pertinent active leaf data in state
	 *    
	 * @return {Boolean} The status of the active leaf
	 */
	hasActiveLeaf: function() {

		var hasActiveLeaf = false;

		if ( this.hasActiveBranch() ) {

			var activeBranch = this.state.branches[this.state.active.branch];

			if ( this.state.active.leaf !== null && this.state.active.leaf in activeBranch.leaves )
				hasActiveLeaf = true;

		}

		return hasActiveLeaf;

	},

	/**
	 * The PrismLeafMetaPanel in PrismLeaf is open on two conditions:
	 *     The global state is 'locked' open for all leaves
	 *     The local state is 'open' for that particular leaf
	 *
	 * This condition is checked on toggleMetaPanel and lockMetaPanel
	 *
	 * This needed to be attached to state because it wasn't updating otherwise.
	 * 
	 * @return {Boolean} [description]
	 */
	isMetaPanelOpen: function() {

		var state     = this.state;

		var isMetaPanelOpen = false;

		var branch    = state.active.branch;
		var leaf      = state.active.leaf;

		if ( state.lockMetaPanel == 'lock' || state.branches[branch].leaves[leaf].metapanel == 'open' )
			isMetaPanelOpen = true;

		return isMetaPanelOpen;
	},

	changeLeaf: function( branch, leaf ) {

		var state = this.state;

		state.active.branch = branch;
		state.active.leaf   = leaf;

		state.isMetaPanelOpen = this.isMetaPanelOpen();

		this.setState( state );
	},

	changeBranch: function( branch ) {
		var state = this.state;

		state.active.branch = branch;

		this.setState( state );
	},

	changeValue : function(e) {

		var state  = this.state;

		var branch = state.branches[state.active.branch];
		var leaf   = state.active.leaf;
		var key    = e.target.dataset.key;

		if ( key == 'title' || key == 'content' )
			branch.leaves[leaf][key].rendered = e.target.value;
		else
			branch.leaves[leaf][key] = e.target.value;

		state.currentlyChanged = true;

		this.setState( state );
	},

	changeBranchView : function(e) {
		e.preventDefault();

		var view = jQuery( e.nativeEvent.target ).data( 'view' );

		var state = this.state;

		if ( view == state.branches[state.active.branch].view ) return;

		jQuery( '#prism-branch-visual-controls i' ).removeClass( 'active' );

		state.branches[state.active.branch].view = view;

		this.setState( state );
	},

	toggleMetaPanel : function(e) {
		e.preventDefault();

		var state     = this.state;

		var branch    = state.active.branch;
		var leaf      = state.active.leaf;

		if ( state.branches[branch].leaves[leaf].metapanel == 'open' )
			state.branches[branch].leaves[leaf].metapanel = 'closed';
		else
			state.branches[branch].leaves[leaf].metapanel = 'open';

		state.isMetaPanelOpen = this.isMetaPanelOpen();

		this.setState( state );
	},

	lockMetaPanel : function(e) {
		e.preventDefault();

		var state     = this.state;

		var branch    = state.active.branch;
		var leaf      = state.active.leaf;

		if ( state.lockMetaPanel == 'unlock' )
			state.lockMetaPanel = 'lock';
		else
			state.lockMetaPanel = 'unlock';

		this.setState( state );
	},

	addLeaf: function() {

		var data = { 
			title   : '',
			content : ' ',
			date    : new Date().toISOString().slice(0, 19)
		};

		this.saveLeaf( 'create', data );

	},

	/**
	 * This function creates a new leaf through this.addLeaf     (create type)
	 *   or updates and existing leaf through PrismLeaf.prepLeaf (update type)
	 *
	 * TODO: The url should not rely on this.state.active.branch,
	 *   cause maybe the user can switch it real fast
	 */
	saveLeaf : function( type, data ) {

		var url = PRISM.url.rest + this.state.active.branch;

		if ( type == 'create' ) PRISM.newleaf = true;

		if ( type == 'update' ) url += '/' + data.id;

		jQuery.ajax( {
			method  : 'POST',
			url     : url,
			data    : data,
			beforeSend: function ( xhr ) {
				xhr.setRequestHeader( 'X-WP-Nonce', PRISM.nonce );
			},
			success : function( response ) {

				var state  = this.state;

				var leaf   = response;
				var branch = state.branches[state.active.branch];

				leaf.metapanel = 'closed';

				state.active.leaf = leaf.id;
				branch.leaves[leaf.id] = leaf;

				state.currentlyChanged = false;
				state.isMetaPanelOpen  = this.isMetaPanelOpen();

				if ( PRISM.newleaf )
					location.hash = "/" + this.state.active.branch + "/" + leaf.id;

				this.setState( state );

			}.bind( this ),
			error : function( response ) {
				console.log( 'error: ', response );
			}.bind( this )
		} );

	},

	loadLeaves: function() {

		// TODO: This is a temporary stop gap. Don't fetch the query if we already have them.
		// Ultimately, we'll have to check for changes and all that.
		if ( this.state.active.branch in this.state.branches ) return;

		jQuery.ajax( {
			method  : 'GET',
			url     : PRISM.url.rest + this.state.active.branch + '?filter[posts_per_page]=-1',
			success : function( response ) {

				var state = this.state;

				var leaves = {};

				for ( var i = 0; i < response.length; i++ ) {
					var leaf = response[i];

					leaf.metapanel = 'closed';

					leaves[leaf.id] = leaf;
				}

				state.branches[this.state.active.branch] = { leaves: leaves, view: PRISM.view };

				this.setState( state );

			}.bind( this )
		} );

	},

	trunkData: function() {

		var trunkData = { branch : '' };

		if ( this.hasActiveBranch() )
			trunkData.branch = this.state.active.branch;

		return trunkData;

	},

	branchData: function() {

		var branchData = { leaves : [] };

		if ( this.hasActiveBranch() ) {

			var branch = this.state.active.branch;

			branchData = {
				title : branch,
				leaf  : this.state.active.leaf,
				view  : this.state.branches[branch].view,
				leaves: this.state.branches[branch].leaves
			}

		}

		return branchData;
	},

	leafData: function() {

		var leafData = {};

		var branch = this.state.active.branch;
		var leaf   = this.state.active.leaf;

		if ( this.hasActiveBranch() ) {

			branch = this.state.branches[branch];

			if ( this.hasActiveLeaf() )
				leafData = branch.leaves[leaf];

		}

		leafData.lockMetaPanel    = this.state.lockMetaPanel;
		leafData.isMetaPanelOpen  = this.state.isMetaPanelOpen;
		leafData.currentlyChanged = this.state.currentlyChanged;

		return leafData;
	},

	/**
	 * Render the entire PrismTree, which includes the PrismTrunk, PrismBranch and PrismLeaf columns.
	 *
	 * There should be minimal logic in this function. Most conditionals should be in Object functions
	 *
	 * It will ways render the PrismTrunk.
	 *
	 * It will render the PrismBranch on condition that there is an active branch 
	 *    and that the given branch data exists in state (hasActiveBranch)
	 *
	 * It will render the PrismLeaf on condition that there is an active leaf for the given branch
	 *    and that the given leaf data exists in state (hasActiveLeaf)
	 * 
	 */
	render: function() {

		var auth = this.props.auth;

		var trunkFunctions  = {
			changeBranch : this.changeBranch
		};

		var branchFunctions = {
			changeLeaf : this.changeLeaf,
			changeView : this.changeBranchView,
			addLeaf    : this.addLeaf
		};

		var leafFunctions   = {
			lockMetaPanel   : this.lockMetaPanel,
			toggleMetaPanel : this.toggleMetaPanel,
			changeValue     : this.changeValue,
			saveLeaf        : this.saveLeaf
		}

		var prismTrunk   = <PrismTrunk  func={trunkFunctions}  auth={auth} data={this.trunkData()}  />
		var prismBranch  = <PrismBranch func={branchFunctions} auth={auth} data={this.branchData()} />;
		var prismLeaf    = <PrismLeaf   func={leafFunctions}   auth={auth} data={this.leafData()}   />;

		var renderTrunk  = prismTrunk; // For code consistency
		var renderBranch = this.hasActiveBranch() ? prismBranch : null;
		var renderLeaf   = this.hasActiveLeaf()   ? prismLeaf   : null;

		return (

			<div id="prism-tree">
				{renderTrunk}
				{renderBranch}
				{renderLeaf}
			</div>

		);
	}

} );