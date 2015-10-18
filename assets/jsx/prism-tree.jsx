var PrismTree = React.createClass( {

	getInitialState: function() {

		var state = { 
			branches         : {},
			active           : { 
				branch  : null,
				leaf    : null,
				meta    : false
			},
			search           : {
				query   : ''
			},
			lockMeta         : PRISM.lockMeta,
			currentlyChanged : false,
			width            : {
				default : { 'trunk' : 17, 'branch' : 33, 'leaf' : 35, 'meta' :  15 },
				current : { 'trunk' : 17, 'branch' : 33, 'leaf' : 35, 'meta' :  15 },
				minimum : { 'trunk' : 10, 'branch' : 25, 'leaf' : 30, 'meta' :  10 },
				maximum : { 'trunk' : 30, 'branch' : 40, 'leaf' : 65, 'meta' :  30 }
			}
		};

		return state;
	},

	componentDidMount: function() {

		PrismKeyHandler = ( changeState ) => {

			if ( 'view' in changeState )
				this.changeView( changeState.view );

			if ( 'lockMeta' in changeState )
				this.lockMeta();

		};

		this.initRouter();

	},

	initRouter: function() {
		var routes = {};
		var routerConfig = {};

		PRISM.branches.map( function( branch, i ) {

			var method = "get_" + branch.slug + "_by_id";

			routes[branch.slug]          = branch.slug;
			routes[branch.slug + "/:id"] = method;

			routerConfig[branch.slug]    = function()   { this.changeBranch(branch.slug)   }.bind( this );
			routerConfig[method]         = function(id) { this.changeLeaf(branch.slug, id) }.bind( this );

		}, this );

		routes.search       = 'search';
		routerConfig.search = function() { this.changeBranch( 'search' ) }.bind( this );

		routerConfig.routes = routes;

		var Router = Backbone.Router.extend( routerConfig );

		new Router();
		Backbone.history.start();
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
	 * The PrismLeafMeta is open on two conditions:
	 *     The global state is 'locked' open for all leaves
	 *     The local state is 'open' for that particular leaf
	 *
	 * This condition is checked on toggleMeta and lockMeta
	 *
	 * This needed to be attached to state because it wasn't updating otherwise.
	 * 
	 * @return {Boolean} [description]
	 */
	hasActiveMeta: function() {

		var state  = this.state;

		var branch = state.active.branch;
		var leaf   = state.active.leaf;

		var meta   = false;

		if ( this.hasActiveLeaf() ) {
			if ( state.lockMeta == 'lock' || state.branches[branch].leaves[leaf].metapanel == 'open' )
				meta = true;
		}

		return meta;
	},

	changeBranch: function( branch ) {
		var state = this.state;

		state.active.branch = branch;

		this.setState( state );

		if ( branch != 'search' )
			this.loadLeaves();
	},

	changeLeaf: function( branch, leaf ) {

		var state = this.state;

		state.active.branch = branch;
		state.active.leaf   = leaf;
		state.active.meta   = this.hasActiveMeta();

		this.setState( state );

		this.changeBranch( branch );
	},

	changeMeta : function(e) {
		e.preventDefault();

		var state     = this.state;

		if ( state.lockMeta == 'lock' ) return;

		var branch    = state.active.branch;
		var leaf      = state.active.leaf;

		if ( state.branches[branch].leaves[leaf].metapanel == 'open' )
			state.branches[branch].leaves[leaf].metapanel = 'closed';
		else
			state.branches[branch].leaves[leaf].metapanel = 'open';

		state.active.meta = this.hasActiveMeta();

		this.setState( state );
	},

	lockMeta : function() {

		var state  = this.state;

		if ( state.lockMeta == 'unlock' )
			state.lockMeta = 'lock';
		else
			state.lockMeta = 'unlock';

		state.active.meta = this.hasActiveMeta();

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

	changeWidth : function(e) {

		if ( e.clientX == 0 ) return;

		var state      = this.state;

		var section    = {
			name : e.target.parentElement.dataset.section,
			left : e.target.parentElement.offsetLeft
		};

		var position   = e.clientX - section.left;

		// This could be more granular (currently at full percents), 
		// but there is a rendering jump at smaller decimals
		section.width  = parseInt( position / window.innerWidth * 100 );

		// The sibling to the parent
		var partner    = {};

		if ( section.name == 'trunk'  ) partner.name = 'branch';
		if ( section.name == 'branch' ) partner.name = 'leaf';
		if ( section.name == 'leaf'   ) partner.name = 'meta';

		var totalWidth = state.width.current[section.name] + state.width.current[partner.name];

		partner.width  = totalWidth - section.width;

		if ( section.width == state.width.current[section.name] ) return;

		if ( section.width < state.width.minimum[section.name] || section.width > state.width.maximum[section.name] ) return;
		if ( partner.width < state.width.minimum[partner.name] || partner.width > state.width.maximum[partner.name] ) return;

		state.width.current[section.name] = section.width;
		state.width.current[partner.name] = partner.width;

		this.setState( state );
	},

	changeView : function( view ) {

		var state = this.state;

		if ( view == state.branches[state.active.branch].view ) return;

		state.branches[state.active.branch].view = view;

		this.setState( state );
	},

	resetWidth : function(e) {

		var state      = this.state;

		state.width.current.trunk  = state.width.default.trunk;
		state.width.current.branch = state.width.default.branch;
		state.width.current.leaf   = state.width.default.leaf;

		this.setState( state );

	},

	search: function(e) {

		var state = this.state;

		state.search.query  = e.target.value;

		if ( state.search.query == '' ) return;

		this.setState( state );

		window.location = '/#/search?query=' + state.search.query;

		this.loadLeaves();

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

				if ( PRISM.newleaf )
					location.hash = "/" + this.state.active.branch + "/" + leaf.id;

				this.setState( state );

			}.bind( this ),
			error : function( response ) {
				console.log( 'error: ', response );
			}.bind( this )
		} );

	},

	/**
	 * loadLeaves is only called from changeBranch
	 * 
	 * 
	 */
	loadLeaves: function() {

		var branch = this.state.active.branch;

		// TODO: This is a temporary stop gap. Don't fetch the query if we already have them.
		// Ultimately, we'll have to check for changes and all that.
		if ( this.hasActiveBranch() && branch != 'search' && ! _.isEmpty( this.state.branches[branch].leaves ) ) return;

		var params = '?filter[posts_per_page]=-1';

		var url    = PRISM.url.rest;

		if ( branch == 'search' )
			url += 'posts' + params + '&filter[post_type]=any&filter[s]=' + this.state.search.query;
		else
			url += branch + params;

		jQuery.ajax( {
			method  : 'GET',
			url     : url,
			success : function( response ) {

				var state  = this.state;
				var branch = this.state.active.branch

				var leaves = {};

				for ( var i = 0; i < response.length; i++ ) {
					var leaf = response[i];

					leaf.metapanel = this.state.active.meta ? 'open' : 'closed';

					leaves[leaf.id] = leaf;
				}

				state.branches[branch] = { leaves: leaves };

				if ( branch in PRISM.view )
					state.branches[branch].view = PRISM.view[branch];
				else
					state.branches[branch].view = PRISM.view.default;

				this.setState( state );

			}.bind( this )
		} );

	},

	trunkData: function() {

		var state = this.state;

		var trunkData = { 
			branch : '',
			width  : state.width.current.trunk,
			search : state.search
		};

		if ( this.hasActiveBranch() )
			trunkData.branch = this.state.active.branch;

		return trunkData;

	},

	branchData: function() {

		var branchData = { 
			leaves : [], 
			width : this.state.width.current.branch
		};

		if ( this.hasActiveBranch() ) {

			var branch = this.state.active.branch;

			branchData.title  = branch;
			branchData.leaf   = this.state.active.leaf;
			branchData.view   = this.state.branches[branch].view;
			branchData.leaves = this.state.branches[branch].leaves;

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

		leafData.width            = this.state.width.current;
		leafData.metaActive       = this.state.active.meta;
		leafData.currentlyChanged = this.state.currentlyChanged;

		return leafData;
	},

	metaData: function() {

		var metaData = {};

		var branch = this.state.active.branch;
		var leaf   = this.state.active.leaf;

		if ( this.hasActiveBranch() ) {

			branch = this.state.branches[branch];

			if ( this.hasActiveLeaf() ) {

				PRISM.meta.default.map( function( key, i ) {
					metaData[key] = branch.leaves[leaf][key];
				}, this );

			}

		}

		metaData.width            = this.state.width.current.meta;
		metaData.metaActive       = this.state.active.meta;
		metaData.lockMeta         = this.state.lockMeta;
		metaData.currentlyChanged = this.state.currentlyChanged;

		return metaData;
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
			changeBranch : this.changeBranch,
			changeWidth  : this.changeWidth,
			resetWidth   : this.resetWidth,
			search       : this.search
		};

		var branchFunctions = {
			changeLeaf  : this.changeLeaf,
			changeView  : this.changeView,
			changeWidth : this.changeWidth,
			resetWidth  : this.resetWidth,
			addLeaf     : this.addLeaf
		};

		var leafFunctions   = {
			changeMeta  : this.changeMeta,
			changeValue : this.changeValue,
			changeWidth : this.changeWidth,
			resetWidth  : this.resetWidth,
			saveLeaf    : this.saveLeaf
		}

		var metaFunctions   = {
			changeValue : this.changeValue,
			lockMeta    : this.lockMeta,
			saveLeaf    : this.saveLeaf
		};

		var prismTrunk   = <PrismTrunk  func={trunkFunctions}  auth={auth} data={this.trunkData()}  />;
		var prismBranch  = <PrismBranch func={branchFunctions} auth={auth} data={this.branchData()} />;
		var prismLeaf    = <PrismLeaf   func={leafFunctions}   auth={auth} data={this.leafData()}   />;
		var prismMeta    = <PrismMeta   func={metaFunctions}   auth={auth} data={this.metaData()}   />;

		var renderTrunk  = prismTrunk; // For code consistency
		var renderBranch = this.hasActiveBranch() ? prismBranch : null;
		var renderLeaf   = this.hasActiveLeaf()   ? prismLeaf   : null;
		var renderMeta   = this.hasActiveMeta()   ? prismMeta   : null;

		return (

			<div id="prism-tree">
				{renderTrunk}
				{renderBranch}
				{renderLeaf}
				{renderMeta}
			</div>

		);
	}

} );