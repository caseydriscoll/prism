var PrismTree = React.createClass( {

	getInitialState: function() {

		log( 11, 'beg PrismTree.getInitialState()' );

		var state = { 
			branches         : {},
			active           : { 
				branch  : null,
				leaf    : null,
				parent  : { branch: null, leaf: { id: null, slug: null } }
			},
			search           : {
				last    : null,
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

			if ( 'statusBar'  in changeState )
				func.toggleStatusBar();

			if ( 'search'     in changeState ) {
				window.location = '/#/search';
				document.getElementById( 'prism-search-bar' ).focus();
			}

			if ( 'userBar'    in changeState )
				func.toggleUserBar();

		};

		this.initRouter();

		log( 12, 'end PrismTree.componentWillMount()' );

	},

	componentDidMount: function() {
		this.props.func.checkQueue();
	},

	componentDidUpdate: function() {
		this.props.func.checkQueue();
	},

	move: function( direction ) {

		log( 11, 'beg PrismTree.move()' );

		if ( this.hasActiveLeaf() ) {

			var id     = window.location.hash.substring( 2 );
			var view   = this.state.branches[this.state.active.branch].view;

			var next;

			var k = 0;
			var e = document.getElementById( id );
			while (e = e.previousSibling) { ++k;}

			if ( view == 'grid' ) {

				if ( direction == 'left' && k % 3 != 0 ) 
					next = document.getElementById( id ).previousSibling;
				else if ( direction == 'down' ) {
					next = document.getElementById( id ).nextSibling;
					if ( next != null ) next = next.nextSibling;
					if ( next != null ) next = next.nextSibling;
				} else if ( direction == 'up' ) {
					next = document.getElementById( id ).previousSibling;
					if ( next != null ) next = next.previousSibling;
					if ( next != null ) next = next.previousSibling;
				} else if ( direction == 'right' && k % 3 != 2 )
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


			if ( next != null ) window.location = '#/' + next.id;

		}

		log( 12, 'end PrismTree.move()' );
	},

	/**
	 * Build all url routes with the following pattern:
	 *
	 * 1. https://url.com/#/activeBranchPlural
	 * 2. https://url.com/#/activeBranchSingle/new
	 * 3. https://url.com/#/activeBranchSingle/:activeLeaf
	 * 4. https://url.com/#/parentBranchSingle/:parentLeaf/activeBranchPlural
	 * 5. https://url.com/#/parentBranchSingle/:parentLeaf/activeBranchPlural/new
	 * 6. https://url.com/#/parentBranchSingle/:parentLeaf/activeBranchPlural/:activeLeaf
	 * 
	 */
	initRouter: function() {

		log( 11, 'beg PrismTree.initRouter()' );

		var routes = {};
		var routerConfig = {};


		PRISM.branches.map( function( branch, i ) {

			var activeBranchSingle = branch.slug.single;
			var activeBranchPlural = branch.slug.plural;


			// Route Pattern 1.
			// https://url.com/#/activeBranchPlural
			// https://patch.works/#/movies
			var activeBranchMethod = "get_" + activeBranchPlural;
			routes[activeBranchPlural] = activeBranchMethod;

			routerConfig[activeBranchMethod] = function() { 
			                                     this.changeBranch( activeBranchPlural );
			                                   }.bind( this );

			// Route Pattern 2.
			// https://url.com/#/activeBranchSingle/new
			// https://patch.works/#/movie/new
			var newLeafMethod = "new_" + activeBranchSingle;
			routes[activeBranchSingle + "/new"] = newLeafMethod;

			routerConfig[newLeafMethod]      = function()  { 
			                                     this.newLeaf( activeBranchPlural ) 
			                                   }.bind( this );


			// Route Pattern 3.
			// https://url.com/#/activeBranchSingle/:activeleaf
			// https://patch.works/#/movie/soylent-green
			var activeLeafMethod = "get_active_" + activeBranchSingle;
			routes[activeBranchSingle + "/:activeLeaf"] = activeLeafMethod;

			routerConfig[activeLeafMethod]   = function( activeLeaf )  { 
			                                     this.changeLeaf( activeBranchPlural, activeLeaf ) 
			                                   }.bind( this );


			// Create all dynamic Route Patterns 4, 5 and 6 for every connection
			// (if connections exist in the first place)
			if ( ! ( 'connections' in branch ) ) return;

			branch.connections.map( function( activeBranch, i ) {

				var parentBranchSingle = activeBranchSingle;
				var parentBranchPlural = activeBranchPlural;

				var childBranchSingle;
				var childBranchPlural;

				// TODO: Currently cycles through whole map, convert to 'some' or use for/break?
				//       
				//       Made a getSingular() function, not sure what to do about needed plural
				//       Could be different than the activeBranch name? 2015-10-30 21:17:16
				PRISM.branches.map( function( branch, i ) {
					if ( branch.slug.plural == activeBranch ) {
						childBranchSingle = branch.slug.single;
						childBranchPlural = branch.slug.plural;
					}
				}, this );


				// Route Pattern 4.
				// https://url.com/#/parentBranchSingle/:parentLeaf/childBranchPlural
				// https://patch.works/#/movie/soylent-green/actors
				var nestedBranchMethod = "get_" + childBranchPlural + "_of_" + parentBranchSingle;

				routes[parentBranchSingle + "/:parentLeaf/" + childBranchPlural] = nestedBranchMethod;
				routerConfig[nestedBranchMethod] = function( parentLeaf ) { 
				                                     this.changeNestedBranch( parentBranchPlural, parentLeaf, childBranchPlural );
				                                   }.bind( this );


				// Route Pattern 5.
				// https://url.com/#/parentBranchSingle/:parentLeaf/childBranchPlural/new
				// https://patch.works/#/movie/soylent-green/actor/new
				var newNestedLeafMethod = "new_" + childBranchSingle + "_of_" + parentBranchSingle;

				routes[parentBranchSingle + "/:parentLeaf/" + childBranchSingle + '/new'] = newNestedLeafMethod;
				routerConfig[newNestedLeafMethod] = function( parentBranchPlural, parentLeaf, childBranchPlural ) { 
				                                     this.newNestedLeaf( parentBranchPlural, parentLeaf, childBranchPlural );
				                                   }.bind( this );


				// Route Pattern 6.
				// https://url.com/#/parentBranchSingle/:parentLeaf/childBranchSingle/:activeLeaf
				// https://patch.works/#/movie/soylent-green/actor/charlton-heston
				var nestedLeafMethod = "get_active_" + childBranchSingle + "_of_" + parentBranchSingle;

				routes[parentBranchSingle + "/:parentLeaf/" + childBranchSingle + "/:activeLeaf"] = nestedLeafMethod;
				routerConfig[nestedLeafMethod]   = function( parentLeaf, activeLeaf ) { 
				                                     this.changeNestedLeaf( parentBranchPlural, parentLeaf, childBranchPlural, activeLeaf );
				                                   }.bind( this );

			}, this );

		}, this );


		routes['']          = 'root';
		routerConfig.root   = function() { this.changeBranch( '/' ) }.bind( this );

		routes.search       = 'search';
		routerConfig.search = function() { this.changeSearch() }.bind( this );

		routerConfig.routes = routes;

		console.log( 'Routes: ', routes );

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

		log( 2, '------end PrismTree.hasActiveBranch() ' + hasActiveBranch );

		return hasActiveBranch;

	},

	hasParentBranch: function() {

		log( 1, '------beg PrismTree.hasParentBranch()' );

		var hasParentBranch = false;

		if ( this.state.active.parent.branch !== null && this.state.active.parent.route in this.state.branches )
			hasParentBranch = true;

		log( 2, '------end PrismTree.hasParentBranch() ' + hasParentBranch );

		return hasParentBranch;

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

			if ( this.state.active.leaf !== null && this.state.active.leaf.id != null && this.state.active.leaf.id in activeBranch.leaves )
				hasActiveLeaf = true;

		}

		log( 2, '------end PrismTree.hasActiveLeaf() ' + hasActiveLeaf );

		return hasActiveLeaf;

	},

	hasParentLeaf: function() {

		log( 1, '------beg PrismTree.hasParentLeaf()' );

		var hasParentLeaf = false;

		if ( this.hasParentBranch() ) {

			var parent = this.state.active.parent;

			if ( parent.branch != null && this.state.active.leaf.id in this.state.branches[parent.route].leaves )
				hasParentLeaf = true;

		}

		log( 2, '------end PrismTree.hasParentLeaf(): ' + hasParentLeaf );

		return hasParentLeaf;

	},

	/**
	 * The PrismLeafMeta is open on two conditions:
	 *     The global state is 'locked' open for all leaves
	 *     The local state is 'open' for that particular leaf
	 *
	 * Therefor the application does not have a saved meta 'state' 
	 *     as it depends on these two state conditions
	 * 
	 * @return {Boolean} The state of the metapanel. True for open, False for closed
	 */
	hasActiveMeta: function() {

		log( 1, '------beg PrismTree.hasActiveMeta()' );

		var state  = this.state;

		var branch = state.active.branch;
		var leaf   = state.active.leaf;

		var hasActiveMeta = false;

		if ( this.hasActiveLeaf() ) {
			if ( state.lockMeta == 'lock' || state.branches[branch].leaves[leaf.id].metapanel == 'open' )
				hasActiveMeta = true;
		}

		log( 2, '------end PrismTree.hasActiveMeta() ' + hasActiveMeta );

		return hasActiveMeta;
	},

	changeStatus: function( status ) {

		log( 11, 'beg PrismTree.changeStatus()' );

		this.props.func.changeStatus( status );

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
	changeBranch: function( activeBranch ) {

		log( 11, 'beg PrismTree.changeBranch() ' + activeBranch );

		var state = this.state;

		state.active.branch = activeBranch != '/' ? activeBranch : null;
		state.active.leaf   = { id: null, slug: null };
		state.active.parent = { branch: null, leaf: { id: null, slug: null } };

		if ( activeBranch != '/' && ! ( activeBranch in state.branches ) ) {
			state.branches[activeBranch] = { leaves : {}, slugs : {} };
			this.loadBranch( activeBranch );
		}

		this.setState( state );

		log( 12, 'end PrismTree.changeBranch() ' + activeBranch );

	},

	changeLeaf: function( activeBranch, activeLeaf ) {

		log( 11, 'beg PrismTree.changeLeaf()' );

		var state = this.state;

		state.active.branch = activeBranch;
		state.active.leaf   = { id: null, slug: null };
		state.active.parent = { branch: null, leaf: { id: null, slug: null } };

		if ( _.isNumber( activeLeaf ) )
			state.active.leaf.id   = activeLeaf;
		else
			state.active.leaf.slug = activeLeaf;

		if ( ! ( activeBranch in state.branches ) ) {
			state.branches[activeBranch] = { leaves : {}, slugs : {} };
			this.loadBranch( activeBranch );
		} else {
			if ( state.active.leaf.id == null )
				state.active.leaf.id = state.branches[activeBranch].slugs[activeLeaf];
		}

		this.setState( state );

		log( 12, 'end PrismTree.changeLeaf()' );

	},

	/**
	 * A nested resource will have its own specialized branch.
	 *
	 * Previously, I was relying on general branches, and trying to retrieve a subset of those.
	 *
	 * For example, if I wanted the 'actors' in 'movie 4', 
	 *   I would look in branch 'movies' leaf '4',
	 *   but that would need to assume that the 'movies' branch is there.
	 *
	 * The branch should be simple and just reflect the state of that current data.
	 *
	 * If I want the actors of the movie, I should have a special branch stored in state.
	 *
	 * Thus, the url 'movies/4/actors' will have a special branch stored in state called movies_4_actors
	 *
	 * this.loadBranch should then be able to do a API call and get that branch's specific data.
	 *
	 * However, the GUI will reflect this in reverse as "Actors in Movies 4",
	 *   with the main 'Actors' menu link activated (with a UI change to add 'in movies 4' )
	 *
	 * But that rendering should be handled with the 'active.nested' conditional.
	 */
	changeNestedBranch: function( parentBranch, parentLeaf, activeBranch ) {
		log( 11, 'beg PrismTree.changeNestedBranch()' );

		var state = this.state;

		var route = parentBranch + '/' + parentLeaf + '/' + activeBranch;

		state.active.branch = activeBranch;
		state.active.leaf   = { id: null, slug: null };
		state.active.parent = { branch : parentBranch, leaf : { id: null, slug: null }, route : route };

		if ( _.isNumber( parentLeaf ) )
			state.active.parent.leaf.id   = parentLeaf;
		else
			state.active.parent.leaf.slug = parentLeaf;

		if ( ! ( route in state.branches ) ) {
			state.branches[route] = { leaves : {}, slugs: {} };
			this.loadNestedBranch( parentBranch, parentLeaf, activeBranch, route );
		} else {
			if ( state.active.parent.leaf.id == null )
				state.active.parent.leaf.id = state.branches[route].slugs[parentLeaf];
		}

		this.setState( state );

		log( 12, 'end PrismTree.changeNestedBranch()' );
	},

	changeNestedLeaf: function( parentBranch, parentLeaf, activeBranch, activeLeaf ) {
		log( 11, 'beg PrismTree.changeNestedLeaf()' );

		var state = this.state;

		var route = parentBranch + '/' + parentLeaf + '/' + activeBranch;

		state.active.branch = activeBranch;
		state.active.leaf   = { id: null, slug: null };
		state.active.parent = { branch : parentBranch, leaf : { id: null, slug: null }, route : route };

		if ( _.isNumber( parentLeaf ) )
			state.active.parent.leaf.id   = parentLeaf;
		else
			state.active.parent.leaf.slug = parentLeaf;

		if ( _.isNumber( activeLeaf ) )
			state.active.leaf.id   = activeLeaf;
		else
			state.active.leaf.slug = activeLeaf;

		if ( ! ( route in state.branches ) ) {
			state.branches[route] = { leaves : {}, slugs : {} };
			this.loadNestedBranch( parentBranch, parentLeaf, activeBranch, route );
		} else {
			if ( state.active.leaf.id == null )
				state.active.leaf.id = state.branches[route].slugs[activeLeaf];
		}

		this.setState( state );

		log( 12, 'end PrismTree.changeNestedLeaf()' );
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
		state.active.leaf   = { id: null, slug: null };
		state.search.last   = state.search.query;
		state.search.query  = window.location.hash.slice( '#/search?query'.length + 1 );

		if ( ! ( branch in state.branches ) )
			state.branches[branch] = { leaves : {}, slugs : {} };

		if ( state.search.query != '' )
			this.loadSearch( state.search.query );

		this.setState( state );

		log( 12, 'end PrismTree.changeSearch()' );

	},

	changeMeta : function() {

		log( 11, 'beg PrismTree.changeMeta()' );

		var state     = this.state;

		if ( state.lockMeta == 'lock' ) return;

		var branch    = state.active.branch;
		var leaf      = state.active.leaf;

		if ( state.branches[branch].leaves[leaf.id].metapanel == 'open' )
			state.branches[branch].leaves[leaf.id].metapanel = 'closed';
		else
			state.branches[branch].leaves[leaf.id].metapanel = 'open';

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

		this.setState( state );

		log( 12, 'end PrismTree.lockMeta()' );

	},

	changeValue : function(e) {

		log( 11, 'beg PrismTree.changeValue()' );

		var state  = this.state;

		var branch = state.branches[state.active.branch];
		var leaf   = state.active.leaf.id;
		var key    = e.target.dataset.key;

		if ( key == 'title' || key == 'content' )
			branch.leaves[leaf][key].raw = e.target.value;
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

	newLeaf: function( branch ) {

		log( 11, 'beg PrismTree.newLeaf() ' + branch );

		this.changeBranch( branch );

		var data = { 
			title       : 'New',
			content_raw : '',
			branch      : branch,
			url         : PRISM.url.rest + branch,
			date        : new Date().toISOString().slice(0, 19)
		};

		this.saveLeaf( 'create', data );

		log( 12, 'end PrismTree.newLeaf()' );

	},

	newNestedLeaf: function() {

		log( 11, 'beg PrismTree.newNestedLeaf()' );

		var data = { 
			title   : '',
			content : ' ',
			date    : new Date().toISOString().slice(0, 19)
		};

		// this.saveLeaf( 'create', data );

		log( 12, 'end PrismTree.newNestedLeaf()' );

	},

	/**
	 * This function creates a new leaf through this.newLeaf     (create type)
	 *   or updates and existing leaf through PrismLeaf.prepLeaf (update type)
	 */
	saveLeaf : function( type, data ) {

		log( 11, 'beg PrismTree.saveLeaf()' );

		var request = {
			url      : data.url,
			method   : 'POST',
			data     : data,
			type     : type,
			url      : data.url,
			callback : this.unloadLeaf
		}

		if ( type == 'create' )
			request.status = { type : 'saving', message : 'Creating new leaf in ' + data.branch + '...' };
		else
			request.status = { type : 'saving', message : 'Updating leaf ' + data.id + '...' };

		this.props.func.queueAJAX( request );

		this.props.func.checkQueue();

		log( 12, 'end PrismTree.saveLeaf()' );

	},

	unloadLeaf : function( request, response ) {
		log( request );
		log( response );

		if ( response.status == 400 || response.status == 403 ) {

			this.changeStatus( { type: 'error', message: response.statusText + ': ' + response.responseJSON[0].message } );
			this.changeStatus( { type: 'normal',  message: null } );

		} else {

			var state  = this.state;

			var leaf   = response;
			var branch = state.branches[state.active.branch];

			leaf.metapanel = 'closed';

			state.active.leaf.id   = leaf.id;
			branch.leaves[leaf.id] = leaf;

			state.currentlyChanged = false;

			this.setState( state );

			if ( request.type == 'create' )
				this.changeStatus( { type: 'success', message: 'Created leaf!' } );

			if ( request.type == 'update' )
				this.changeStatus( { type: 'success', message: 'Updated leaf ' + leaf.id + '!' } );

			this.changeStatus( { type: 'normal',  message: null } );

		}
	},

	loadBranch: function( branch ) {

		log( 11, 'beg PrismTree.loadBranch() ' + branch );

		var context = this.props.auth ? 'edit' : 'view';

		var params  = '?filter[posts_per_page]=-1';
		    params += '&context=' + context;

		var request = {
			url      : PRISM.url.rest + branch + params,
			method   : 'GET',
			callback : this.unloadBranch,
			branch   : branch,
			status   : { type : 'loading', message : 'Loading ' + branch + ' data...' }
		}

		this.props.func.queueAJAX( request );

		log( 12, 'end PrismTree.loadBranch()' );

	},

	loadSearch: function( query ) {

		log( 11, 'beg PrismTree.loadSearch()' );

		var params  = '?filter[posts_per_page]=-1';
		    params += '&filter[s]=' + query;

		var request = {
			url      : PRISM.url.rest + 'posts' + params,
			method   : 'GET',
			callback : this.unloadBranch,
			branch   : 'search',
			status   : { type : 'loading', message : 'Searching for "' + query + '" data!' }
		}

		this.props.func.queueAJAX( request );

		log( 12, 'end PrismTree.loadBranch()' );

	},

	loadNestedBranch: function( parentBranch, parentLeaf, activeBranch, route ) {

		log( 11, 'beg PrismTree.loadNestedBranch()' );

		var state = this.state;

		var params  = '?filter[posts_per_page]=-1';
		    params += '&filter[connected_type]=' + parentBranch + '_to_' + activeBranch;
		    params += '&filter[connected_id]='   + parentLeaf;

		var request = {
			url      : PRISM.url.rest + parentBranch + params,
			method   : 'GET',
			callback : this.unloadBranch,
			branch   : route,
			status   : { type : 'loading', message : 'Loading ' + activeBranch + ' data...' }
		}

		this.props.func.queueAJAX( request );

		log( 12, 'end PrismTree.loadNestedBranch()' );

	},

	unloadBranch: function( request, response ) {

		log( 11, 'beg PrismTree.unloadBranch()' );

		var state  = this.state;

		var slugs  = {};
		var leaves = {};

		for ( var i = 0; i < response.length; i++ ) {
			var leaf = response[i];
			var slug = leaf.slug;

			leaf.metapanel = 'closed';

			leaves[leaf.id] = leaf;

			// Create slug alias of id
			slugs[slug] = leaf.id;

			if ( state.active.leaf.id == null && state.active.leaf.slug == slug)
				state.active.leaf.id = leaf.id;
		}

		state.branches[request.branch] = { leaves: leaves, slugs: slugs };

		if ( request.branch in PRISM.view )
			state.branches[request.branch].view = PRISM.view[request.branch];
		else
			state.branches[request.branch].view = PRISM.view.default;

		this.changeStatus( { type: 'success', message: 'Successfully loaded ' + request.branch + ' data!' } );
		this.changeStatus( { type: 'normal',  message: null } );

		this.setState( state );

		log( 12, 'end PrismTree.unloadBranch()' );
	},

	needsData: function( branch ) {
		log( 11, 'beg PrismTree.needsData() ' + branch );

		var needsData = false;

		var connectionBranch = this.state.branches[branch];

		var inQueue = false;

		PRISM.ajax.queue.map( function( request, i ) {
			if ( branch == request.branch )
				inQueue = true;
		}, this );

		this.props.data.ajax.queue.map( function( request, i ) {
			if ( branch == request.branch )
				inQueue = true;
		}, this );

		if ( connectionBranch == undefined && ! inQueue )
			needsData = true;

		log( 12, 'end PrismTree.needsData() ' + needsData );
		return needsData;

	},

	hasData: function( branch ) {
		log( 11, 'beg PrismTree.hasData() ' + branch );

		var hasData = false;

		var branchData = this.state.branches[branch];

		if ( branchData != undefined )
			hasData = true;

		log( 12, 'end PrismTree.hasData() ' + hasData );
		return hasData;
	},

	trunkData: function() {

		log( 1, '---beg PrismTree.trunkData()' );

		var state = this.state;

		var trunkData = { 
			active  : state.active,
			width   : state.width.current.trunk,
			search  : state.search,
			status  : this.props.data.status
		};

		log( 2, '---end PrismTree.trunkData()' );

		return trunkData;

	},

	branchData: function() {

		log( 1, '---beg PrismTree.branchData()' );

		var branch = null;
		var branchData = null;

		if ( this.hasActiveBranch() ) branch = this.state.active.branch;
		if ( this.hasParentBranch() ) branch = this.state.active.parent.route;

		if ( branch == null ) {
			branchData = { 
				leaves : {},
				slugs  : {},
				view   : PRISM.view.default
			};
		} else {
			branchData = this.state.branches[branch];
		}

		var query = this.state.search.query;

		if ( branch == 'search' && _.isEmpty( branchData.leaves ) && query != '' )
			branchData.leaves[0] = { 
				id: 0, 
				type: null, 
				content: { raw: '' },
				title: { raw: 'No search results for "' + query + '"' } 
			};

		branchData.active = this.state.active;
		branchData.search = this.state.search;
		branchData.width  = this.state.width.current.branch;

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
				leafData = branch.leaves[leaf.id];

		}

		if ( this.hasParentBranch() ) {

			branch = this.state.active.parent.route;

			branch = this.state.branches[branch];

			if ( this.hasParentLeaf() )
				leafData = branch.leaves[leaf.id];

		}

		leafData.width            = this.state.width.current;
		leafData.metaActive       = this.hasActiveMeta();
		leafData.currentlyChanged = this.state.currentlyChanged;

		log( 2, '---end PrismTree.leafData()' );

		return leafData;
	},

	metaData: function() {

		log( 1, '---beg PrismTree.metaData()' );

		var metaData = { connections : [] };

		if ( this.hasActiveBranch() ) {

			var branch = this.state.active.branch;
			var leaf   = this.state.active.leaf;

			var branches = this.state.branches;
			var leaves   = branches[branch].leaves;

			// TODO: Currently cycles through whole map, convert to 'some' or use for/break?
			//       
			//       This is different than getSingular
			//       This returns whole branch object 2015-10-30 21:20:44
			PRISM.branches.map( function( b, i ) {
				if ( b.slug.plural == branch ) metaData.branch = b;
			} );

			if ( this.hasActiveLeaf() ) {

				PRISM.meta.default.map( function( key, i ) {
					metaData[key] = leaves[leaf.id][key];
				}, this );

				PRISM.branches.map( function( b, i ) {

					if ( b.slug.plural == branch ) {

						metaData.connections = b.connections;

						b.connections.map( function( connection, i ) {

							// An array of post_ids in another branch
							// (actor ids in the actor branch)
							var keys = leaves[leaf.id][connection];

							metaData[connection] = {};

							keys.map( function( key, i ) {
								metaData[connection][key] = {};
							} );

							if ( this.needsData( connection ) ) this.loadBranch( connection );

							if ( this.hasData ( connection ) ) {

								keys.map( function( key, i ) {
									metaData[connection][key]['name'] = branches[connection].leaves[key].title.rendered;
									metaData[connection][key]['slug'] = branches[connection].leaves[key].slug;
								} );

							} else {

								keys.map( function( key, i ) {
									metaData[connection][key]['name'] = key;
									metaData[connection][key]['slug'] = key;
								} );

							}


						}, this );

					}
				}, this );

			}

		}

		metaData.width            = this.state.width.current.meta;
		metaData.metaActive       = this.hasActiveMeta();
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
		var renderBranch = this.hasActiveBranch() || this.hasParentBranch() ? prismBranch : null;
		var renderLeaf   = this.hasActiveLeaf()   || this.hasParentLeaf()   ? prismLeaf   : null;
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