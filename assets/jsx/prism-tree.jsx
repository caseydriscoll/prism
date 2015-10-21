var PrismTree = React.createClass( {

	getInitialState: function() {

		log( 11, 'beg PrismTree.getInitialState()' );

		var state = { 
			branches         : {},
			active           : { 
				branch  : null,
				leaf    : null,
				meta    : false
			},
			search           : {
				last    : '',
				query   : ''
			},
			lockMeta         : PRISM.lockMeta,
			currentlyChanged : false,
			width            : PRISM.width
		};

		log( 12, 'end PrismTree.getInitialState()' );

		return state;
	},

	componentWillMount: function() {

		log( 11, 'beg PrismTree.componentWillMount()' );

		var func = this.props.func;

		PrismKeyHandler = ( changeState ) => {

			if ( 'view'       in changeState )
				this.changeView( changeState.view );

			if ( 'move'       in changeState )
				this.move( changeState.move );

			if ( 'lockMeta'   in changeState )
				this.lockMeta();

			if ( 'changeMeta' in changeState )
				this.changeMeta();

			if ( 'addLeaf'    in changeState )
				this.addLeaf();

			if ( 'rainbow'    in changeState )
				func.toggleRainbow();

		};

		this.initRouter();

		log( 12, 'end PrismTree.componentWillMount()' );

	},

	move: function( direction ) {

		log( 11, 'beg PrismTree.move()' );

		if ( this.hasActiveLeaf() ) {
			var leaf   = this.state.active.leaf;
			var branch = this.state.active.branch;

			var view   = this.state.branches[branch].view;

			var id     = branch + '/' + leaf;

			var next;

			var k = 0;
			var e = document.getElementById( id );
			while (e = e.previousSibling) { ++k;}

			if ( view == 'grid' ) {

				if ( direction == 'left' && k % 4 != 0 ) 
					next = document.getElementById( id ).previousSibling;
				else if ( direction == 'down' ) {
					next = document.getElementById( id ).nextSibling;
					if ( next != null ) next = next.nextSibling;
					if ( next != null ) next = next.nextSibling;
					if ( next != null ) next = next.nextSibling; 
				} else if ( direction == 'up' ) {
					next = document.getElementById( id ).previousSibling;
					if ( next != null ) next = next.previousSibling;
					if ( next != null ) next = next.previousSibling;
					if ( next != null ) next = next.previousSibling;
				} else if ( direction == 'right' && k % 4 != 3 )
					next = document.getElementById( id ).nextSibling;

			} else if ( view == 'half' ) {

				if ( direction == 'left' && k % 2 != 0 ) 
					next = document.getElementById( id ).previousSibling;
				else if ( direction == 'down' ) {
					next = document.getElementById( id ).nextSibling;
					if ( next != null ) next = next.nextSibling;
				} else if ( direction == 'up' ) {
					next = document.getElementById( id ).previousSibling;
					if ( next != null ) next = next.previousSibling;
				} else if ( direction == 'right' && k % 2 != 1 )
					next = document.getElementById( id ).nextSibling;

			} else {

				if ( direction == 'up' ) 
					next = document.getElementById( id ).previousSibling;
				else if ( direction == 'down' )
					next = document.getElementById( id ).nextSibling;

			}


			if ( next != null ) window.location = '/#/' + next.id;

		}

		log( 12, 'end PrismTree.move()' );
	},

	initRouter: function() {

		log( 11, 'beg PrismTree.initRouter()' );

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
		routerConfig.search = function() { this.changeSearch() }.bind( this );

		routerConfig.routes = routes;

		var Router = Backbone.Router.extend( routerConfig );

		new Router();
		Backbone.history.start();

		log( 12, 'end PrismTree.initRouter()' );
	},

	/**
	 * Returns true if the value of this.state.active.branch is not null
	 *    and if that value is a key in this.state.branches
	 * 
	 * @return {Boolean} The status of the active branch
	 */
	hasActiveBranch: function() {

		log( 1, '------beg PrismTree.hasActiveBranch()' );

		var hasActiveBranch = false;

		if ( this.state.active.branch !== null && this.state.active.branch in this.state.branches )
			hasActiveBranch = true;

		log( 2, '------end PrismTree.hasActiveBranch()' );

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

		log( 1, '------beg PrismTree.hasActiveLeaf()' );

		var hasActiveLeaf = false;

		if ( this.hasActiveBranch() ) {

			var activeBranch = this.state.branches[this.state.active.branch];

			if ( this.state.active.leaf !== null && this.state.active.leaf in activeBranch.leaves )
				hasActiveLeaf = true;

		}

		log( 2, '------end PrismTree.hasActiveLeaf()' );

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

		log( 1, '------beg PrismTree.hasActiveMeta()' );

		var state  = this.state;

		var branch = state.active.branch;
		var leaf   = state.active.leaf;

		var meta   = false;

		if ( this.hasActiveLeaf() ) {
			if ( state.lockMeta == 'lock' || state.branches[branch].leaves[leaf].metapanel == 'open' )
				meta = true;
		}

		log( 2, '------end PrismTree.hasActiveMeta()' );

		return meta;
	},

	changeStatus: function( type, message ) {

		log( 11, 'beg PrismTree.changeStatus()' );

		this.props.func.changeStatus( { type, message } );

		log( 12, 'end PrismTree.changeStatus()' );

	},

	/**
	 * Previously, changeBranch was manually called from the PrismTrunk branch links.
	 *
	 * Now, with Backbone.js routing, changeBranch is only called from the route controller.
	 * 
	 * @param  {[type]} branch [description]
	 * @return {[type]}        [description]
	 */
	changeBranch: function( branch ) {

		log( 11, 'beg PrismTree.changeBranch()' );

		var state = this.state;

		state.active.branch = branch;

		if ( ! ( branch in state.branches ) ) state.branches[branch] = { leaves : {} };

		this.setState( state );

		log( 12, 'end PrismTree.changeBranch()' );

	},

	changeLeaf: function( branch, leaf ) {

		log( 11, 'beg PrismTree.changeLeaf()' );

		var state = this.state;

		state.active.branch = branch;
		state.active.leaf   = leaf;
		state.active.meta   = this.hasActiveMeta();

		this.setState( state );

		log( 12, 'end PrismTree.changeLeaf()' );

	},

	/**
	 * A special case for dealing with search
	 * @param  {[type]} branch [description]
	 * @param  {[type]} leaf   [description]
	 * @return {[type]}        [description]
	 */
	changeSearch: function() {

		log( 11, 'beg PrismTree.changeSearch()' );

		var state  = this.state;
		var branch = 'search';

		state.active.branch = branch;
		state.search.last   = state.search.query;
		state.search.query  = window.location.hash.slice( '#/search?query'.length + 1 );

		if ( ! ( branch in state.branches ) ) state.branches[branch] = { leaves : {} };

		this.setState( state );

		log( 12, 'end PrismTree.changeSearch()' );

	},

	changeMeta : function() {

		log( 11, 'beg PrismTree.changeMeta()' );

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

		log( 12, 'end PrismTree.changeMeta()' );
	},

	lockMeta : function() {

		log( 11, 'beg PrismTree.lockMeta()' );

		var state  = this.state;

		if ( state.lockMeta == 'unlock' )
			state.lockMeta = 'lock';
		else
			state.lockMeta = 'unlock';

		state.active.meta = this.hasActiveMeta();

		this.setState( state );

		log( 12, 'end PrismTree.lockMeta()' );

	},

	changeValue : function(e) {

		log( 11, 'beg PrismTree.changeValue()' );

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

		log( 12, 'end PrismTree.changeValue()' );

	},

	changeWidth : function(e) {

		log( 11, 'beg PrismTree.changeWidth()' );

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

		log( 12, 'end PrismTree.changeWidth()' );

	},

	changeView : function( view ) {

		log( 11, 'beg PrismTree.changeView()' );

		var state = this.state;

		if ( view == state.branches[state.active.branch].view ) return;

		state.branches[state.active.branch].view = view;

		this.setState( state );

		log( 12, 'end PrismTree.changeView()' );

	},

	resetWidth : function(e) {

		log( 11, 'beg PrismTree.resetWidth()' );

		var state      = this.state;

		state.width.current.trunk  = state.width.default.trunk;
		state.width.current.branch = state.width.default.branch;
		state.width.current.leaf   = state.width.default.leaf;

		this.setState( state );

		log( 12, 'end PrismTree.changeView()' );

	},

	addLeaf: function() {

		log( 11, 'beg PrismTree.addLeaf()' );

		var data = { 
			title   : '',
			content : ' ',
			date    : new Date().toISOString().slice(0, 19)
		};

		this.saveLeaf( 'create', data );

		log( 12, 'end PrismTree.addLeaf()' );

	},

	/**
	 * This function creates a new leaf through this.addLeaf     (create type)
	 *   or updates and existing leaf through PrismLeaf.prepLeaf (update type)
	 *
	 * TODO: The url should not rely on this.state.active.branch,
	 *   cause maybe the user can switch it real fast
	 */
	saveLeaf : function( type, data ) {

		log( 11, 'beg PrismTree.saveLeaf()' );

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

		log( 12, 'end PrismTree.saveLeaf()' );

	},

	/**
	 * There is a difference between loading the branch with local data a doing an ajax run.
	 *
	 * This function should only be called from the PrismBranch itself after mounting/updating.
	 */
	loadBranch: function( branch, params ) {

		log( 11, 'beg PrismTree.loadBranch()' );

		this.changeStatus( 'loading', 'Loading ' + branch + ' data.' );

		var url = PRISM.url.rest + branch + params;

		jQuery.ajax( {
			method  : 'GET',
			url     : url,
			success : function( response ) {

				log( 10, 'success PrismTree.loadBranch()' );

				var state  = this.state;
				var branch = this.state.active.branch

				var leaves = {};

				for ( var i = 0; i < response.length; i++ ) {
					var leaf = response[i];

					leaf.metapanel = this.state.active.meta ? 'open' : 'closed';

					leaves[leaf.id] = leaf;
				}

				state.branches[branch] = { leaves: leaves };

				// TODO: Temp stop gap to prevent constant updating loop in PrismBranch.componentWillUpdate/loadBranch
				if ( branch == 'search' )
					state.search.last = state.search.query;

				if ( branch in PRISM.view )
					state.branches[branch].view = PRISM.view[branch];
				else
					state.branches[branch].view = PRISM.view.default;

				this.changeStatus( 'success', 'Successfully loaded ' + branch + ' data.' );
				this.changeStatus( 'normal', null );

				this.setState( state );

			}.bind( this )
		} );

		log( 12, 'end PrismTree.loadBranch()' );

	},

	trunkData: function() {

		log( 1, '---beg PrismTree.trunkData()' );

		var state = this.state;

		var trunkData = { 
			branch  : '',
			width   : state.width.current.trunk,
			search  : state.search,
			status  : this.props.data.status.current,
			rainbow : this.props.data.rainbowBar
		};

		if ( this.hasActiveBranch() )
			trunkData.branch = this.state.active.branch;

		log( 2, '---end PrismTree.trunkData()' );

		return trunkData;

	},

	branchData: function() {

		log( 1, '---beg PrismTree.branchData()' );

		var branchData = { 
			leaves : [], 
			width  : this.state.width.current.branch,
			search : this.state.search,
			status : this.props.data.status
		};

		if ( this.hasActiveBranch() ) {

			var branch = this.state.active.branch;

			branchData.title  = branch;
			branchData.leaf   = this.state.active.leaf;
			branchData.view   = this.state.branches[branch].view;
			branchData.leaves = this.state.branches[branch].leaves;

		}

		log( 2, '---end PrismTree.branchData()' );

		return branchData;
	},

	leafData: function() {

		log( 1, '---beg PrismTree.leafData()' );

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

		log( 2, '---end PrismTree.leafData()' );

		return leafData;
	},

	metaData: function() {

		log( 1, '---beg PrismTree.metaData()' );

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

		log( 2, '---end PrismTree.metaData()' );

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

		log( 11, 'beg PrismTree.render()' );

		var auth = this.props.auth;
		var func = this.props.func;

		var trunkFunctions  = {
			changeWidth   : this.changeWidth,
			resetWidth    : this.resetWidth,
			toggleRainbow : func.toggleRainbow,
			search        : this.search
		};

		var branchFunctions = {
			loadBranch  : this.loadBranch,
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

		log( 12, 'end PrismTree.render()' );
		log( 12, '----------------------' );

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