'use strict';

var PrismHeader = React.createClass({
	displayName: 'PrismHeader',

	render: function render() {

		var auth = this.props.auth;
		var data = this.props.data;
		var func = this.props.func;

		return React.createElement(
			'header',
			{ id: 'prism-header' },
			React.createElement(PrismStatus, { data: data, func: func }),
			React.createElement(PrismUserAccount, { data: data, auth: auth, func: func })
		);
	}

});

var PrismUserAccount = React.createClass({
	displayName: 'PrismUserAccount',

	render: function render() {

		var auth = this.props.auth;
		var data = this.props.data;
		var func = this.props.func;

		var url,
		    icon = null;

		if (auth) {
			url = PRISM.url.login + '?redirect_to=' + PRISM.url.root + '&action=logout';
			icon = React.createElement('img', { src: this.props.data.user.avatar_urls[PRISM.gravatar.width], width: PRISM.gravatar.width, height: PRISM.gravatar.height });
		} else {
			url = PRISM.url.login + '?redirect_to=' + PRISM.url.root;
			icon = React.createElement('i', { className: 'fa fa-user fa-2x' });
		}

		return React.createElement(
			'a',
			{ id: 'prism-user-account', onClick: func.toggleUserBar },
			icon
		);
	}

});

'use strict';

var PrismTree = React.createClass({
	displayName: 'PrismTree',

	getInitialState: function getInitialState() {

		log(11, 'beg PrismTree.getInitialState()');

		var state = {
			branches: {},
			active: {
				branch: null,
				leaf: null,
				parent: { branch: null, leaf: { id: null, slug: null } }
			},
			search: {
				last: null,
				query: ''
			},
			lockMeta: PRISM.lockMeta,
			currentlyChanged: false,
			width: PRISM.width
		};

		log(12, 'end PrismTree.getInitialState()');

		return state;
	},

	componentWillMount: function componentWillMount() {
		var _this = this;

		log(11, 'beg PrismTree.componentWillMount()');

		var func = this.props.func;

		PrismKeyHandler = function (changeState) {

			if ('view' in changeState) _this.changeView(changeState.view);

			if ('move' in changeState) _this.move(changeState.move);

			if ('lockMeta' in changeState) _this.lockMeta();

			if ('changeMeta' in changeState) _this.changeMeta();

			if ('addLeaf' in changeState) _this.addLeaf();

			if ('statusBar' in changeState) func.toggleStatusBar();

			if ('search' in changeState) {
				window.location = '/#/search';
				document.getElementById('prism-search-bar').focus();
			}

			if ('userBar' in changeState) func.toggleUserBar();
		};

		this.initRouter();

		log(12, 'end PrismTree.componentWillMount()');
	},

	componentDidMount: function componentDidMount() {
		this.props.func.checkQueue();
	},

	componentDidUpdate: function componentDidUpdate() {
		this.props.func.checkQueue();
	},

	move: function move(direction) {

		log(11, 'beg PrismTree.move()');

		if (this.hasActiveLeaf()) {

			var id = window.location.hash.substring(2);
			var view = this.state.branches[this.state.active.branch].view;

			var next;

			var k = 0;
			var e = document.getElementById(id);
			while (e = e.previousSibling) {
				++k;
			}

			if (view == 'grid') {

				if (direction == 'left' && k % 3 != 0) next = document.getElementById(id).previousSibling;else if (direction == 'down') {
					next = document.getElementById(id).nextSibling;
					if (next != null) next = next.nextSibling;
					if (next != null) next = next.nextSibling;
				} else if (direction == 'up') {
					next = document.getElementById(id).previousSibling;
					if (next != null) next = next.previousSibling;
					if (next != null) next = next.previousSibling;
				} else if (direction == 'right' && k % 3 != 2) next = document.getElementById(id).nextSibling;
			} else if (view == 'half') {

				if (direction == 'left' && k % 2 != 0) next = document.getElementById(id).previousSibling;else if (direction == 'down') {
					next = document.getElementById(id).nextSibling;
					if (next != null) next = next.nextSibling;
				} else if (direction == 'up') {
					next = document.getElementById(id).previousSibling;
					if (next != null) next = next.previousSibling;
				} else if (direction == 'right' && k % 2 != 1) next = document.getElementById(id).nextSibling;
			} else {

				if (direction == 'up') next = document.getElementById(id).previousSibling;else if (direction == 'down') next = document.getElementById(id).nextSibling;
			}

			if (next != null) window.location = '#/' + next.id;
		}

		log(12, 'end PrismTree.move()');
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
	initRouter: function initRouter() {

		log(11, 'beg PrismTree.initRouter()');

		var routes = {};
		var routerConfig = {};

		PRISM.branches.map(function (branch, i) {

			var activeBranchSingle = branch.slug.single;
			var activeBranchPlural = branch.slug.plural;

			// Route Pattern 1.
			// https://url.com/#/activeBranchPlural
			// https://patch.works/#/movies
			var activeBranchMethod = "get_" + activeBranchPlural;
			routes[activeBranchPlural] = activeBranchMethod;

			routerConfig[activeBranchMethod] = (function () {
				this.changeBranch(activeBranchPlural);
			}).bind(this);

			// Route Pattern 2.
			// https://url.com/#/activeBranchSingle/new
			// https://patch.works/#/movie/new
			var newLeafMethod = "new_" + activeBranchSingle;
			routes[activeBranchSingle + "/new"] = newLeafMethod;

			routerConfig[newLeafMethod] = (function () {
				this.newLeaf(activeBranchPlural);
			}).bind(this);

			// Route Pattern 3.
			// https://url.com/#/activeBranchSingle/:activeleaf
			// https://patch.works/#/movie/soylent-green
			var activeLeafMethod = "get_active_" + activeBranchSingle;
			routes[activeBranchSingle + "/:activeLeaf"] = activeLeafMethod;

			routerConfig[activeLeafMethod] = (function (activeLeaf) {
				this.changeLeaf(activeBranchPlural, activeLeaf);
			}).bind(this);

			// Create all dynamic Route Patterns 4, 5 and 6 for every connection
			// (if connections exist in the first place)
			if (!('connections' in branch)) return;

			branch.connections.map(function (activeBranch, i) {

				var parentBranchSingle = activeBranchSingle;
				var parentBranchPlural = activeBranchPlural;

				var childBranchSingle;
				var childBranchPlural;

				// TODO: Currently cycles through whole map, convert to 'some' or use for/break?
				PRISM.branches.map(function (branch, i) {
					if (branch.slug.plural == activeBranch) {
						childBranchSingle = branch.slug.single;
						childBranchPlural = branch.slug.plural;
					}
				}, this);

				// Route Pattern 4.
				// https://url.com/#/parentBranchSingle/:parentLeaf/childBranchPlural
				// https://patch.works/#/movie/soylent-green/actors
				var nestedBranchMethod = "get_" + childBranchPlural + "_of_" + parentBranchSingle;

				routes[parentBranchSingle + "/:parentLeaf/" + childBranchPlural] = nestedBranchMethod;
				routerConfig[nestedBranchMethod] = (function (parentLeaf) {
					this.changeNestedBranch(parentBranchPlural, parentLeaf, childBranchPlural);
				}).bind(this);

				// Route Pattern 5.
				// https://url.com/#/parentBranchSingle/:parentLeaf/childBranchPlural/new
				// https://patch.works/#/movie/soylent-green/actor/new
				var newNestedLeafMethod = "new_" + childBranchSingle + "_of_" + parentBranchSingle;

				routes[parentBranchSingle + "/:parentLeaf/" + childBranchSingle + '/new'] = newNestedLeafMethod;
				routerConfig[newNestedLeafMethod] = (function (parentBranchPlural, parentLeaf, childBranchPlural) {
					this.newNestedLeaf(parentBranchPlural, parentLeaf, childBranchPlural);
				}).bind(this);

				// Route Pattern 6.
				// https://url.com/#/parentBranchSingle/:parentLeaf/childBranchSingle/:activeLeaf
				// https://patch.works/#/movie/soylent-green/actor/charlton-heston
				var nestedLeafMethod = "get_active_" + childBranchSingle + "_of_" + parentBranchSingle;

				routes[parentBranchSingle + "/:parentLeaf/" + childBranchSingle + "/:activeLeaf"] = nestedLeafMethod;
				routerConfig[nestedLeafMethod] = (function (parentLeaf, activeLeaf) {
					this.changeNestedLeaf(parentBranchPlural, parentLeaf, childBranchPlural, activeLeaf);
				}).bind(this);
			}, this);
		}, this);

		routes.search = 'search';
		routerConfig.search = (function () {
			this.changeSearch();
		}).bind(this);

		routerConfig.routes = routes;

		console.log('Routes: ', routes);

		var Router = Backbone.Router.extend(routerConfig);

		new Router();
		Backbone.history.start();

		log(12, 'end PrismTree.initRouter()');
	},

	/**
  * Returns true if the value of this.state.active.branch is not null
  *    and if that value is a key in this.state.branches
  * 
  * @return {Boolean} The status of the active branch
  */
	hasActiveBranch: function hasActiveBranch() {

		log(1, '------beg PrismTree.hasActiveBranch()');

		var hasActiveBranch = false;

		if (this.state.active.branch !== null && this.state.active.branch in this.state.branches) hasActiveBranch = true;

		log(2, '------end PrismTree.hasActiveBranch() ' + hasActiveBranch);

		return hasActiveBranch;
	},

	hasParentBranch: function hasParentBranch() {

		log(1, '------beg PrismTree.hasParentBranch()');

		var hasParentBranch = false;

		if (this.state.active.parent.branch !== null && this.state.active.parent.route in this.state.branches) hasParentBranch = true;

		log(2, '------end PrismTree.hasParentBranch() ' + hasParentBranch);

		return hasParentBranch;
	},

	/**
  * Returns true if there is an active branch in state,
  *    there is an active leaf in that branch
  *    and pertinent active leaf data in state
  *    
  * @return {Boolean} The status of the active leaf
  */
	hasActiveLeaf: function hasActiveLeaf() {

		log(1, '------beg PrismTree.hasActiveLeaf()');

		var hasActiveLeaf = false;

		if (this.hasActiveBranch()) {

			var activeBranch = this.state.branches[this.state.active.branch];

			if (this.state.active.leaf !== null && this.state.active.leaf.id != null && this.state.active.leaf.id in activeBranch.leaves) hasActiveLeaf = true;
		}

		log(2, '------end PrismTree.hasActiveLeaf() ' + hasActiveLeaf);

		return hasActiveLeaf;
	},

	hasParentLeaf: function hasParentLeaf() {

		log(1, '------beg PrismTree.hasParentLeaf()');

		var hasParentLeaf = false;

		if (this.hasParentBranch()) {

			var parent = this.state.active.parent;

			if (parent.branch != null && this.state.active.leaf.id in this.state.branches[parent.route].leaves) hasParentLeaf = true;
		}

		log(2, '------end PrismTree.hasParentLeaf(): ' + hasParentLeaf);

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
	hasActiveMeta: function hasActiveMeta() {

		log(1, '------beg PrismTree.hasActiveMeta()');

		var state = this.state;

		var branch = state.active.branch;
		var leaf = state.active.leaf;

		var hasActiveMeta = false;

		if (this.hasActiveLeaf()) {
			if (state.lockMeta == 'lock' || state.branches[branch].leaves[leaf.id].metapanel == 'open') hasActiveMeta = true;
		}

		log(2, '------end PrismTree.hasActiveMeta() ' + hasActiveMeta);

		return hasActiveMeta;
	},

	changeStatus: function changeStatus(status) {

		log(11, 'beg PrismTree.changeStatus()');

		this.props.func.changeStatus(status);

		log(12, 'end PrismTree.changeStatus()');
	},

	/**
  * Previously, changeBranch was manually called from the PrismTrunk branch links.
  *
  * Now, with Backbone.js routing, changeBranch is only called from the route controller.
  * 
  * @param  {[type]} branch [description]
  * @return {[type]}        [description]
  */
	changeBranch: function changeBranch(activeBranch) {

		log(11, 'beg PrismTree.changeBranch() ' + activeBranch);

		var state = this.state;

		state.active.branch = activeBranch;
		state.active.leaf = { id: null, slug: null };
		state.active.parent = { branch: null, leaf: { id: null, slug: null } };

		if (!(activeBranch in state.branches)) {
			state.branches[activeBranch] = { leaves: {}, slugs: {} };
			this.loadBranch(activeBranch);
		}

		this.setState(state);

		log(12, 'end PrismTree.changeBranch() ' + activeBranch);
	},

	changeLeaf: function changeLeaf(activeBranch, activeLeaf) {

		log(11, 'beg PrismTree.changeLeaf()');

		var state = this.state;

		state.active.branch = activeBranch;
		state.active.leaf = { id: null, slug: null };
		state.active.parent = { branch: null, leaf: { id: null, slug: null } };

		if (_.isNumber(activeLeaf)) state.active.leaf.id = activeLeaf;else state.active.leaf.slug = activeLeaf;

		if (!(activeBranch in state.branches)) {
			state.branches[activeBranch] = { leaves: {}, slugs: {} };
			this.loadBranch(activeBranch);
		} else {
			if (state.active.leaf.id == null) state.active.leaf.id = state.branches[activeBranch].slugs[activeLeaf];
		}

		this.setState(state);

		log(12, 'end PrismTree.changeLeaf()');
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
	changeNestedBranch: function changeNestedBranch(parentBranch, parentLeaf, activeBranch) {
		log(11, 'beg PrismTree.changeNestedBranch()');

		var state = this.state;

		var route = parentBranch + '/' + parentLeaf + '/' + activeBranch;

		state.active.branch = activeBranch;
		state.active.leaf = { id: null, slug: null };
		state.active.parent = { branch: parentBranch, leaf: { id: null, slug: null }, route: route };

		if (_.isNumber(parentLeaf)) state.active.parent.leaf.id = parentLeaf;else state.active.parent.leaf.slug = parentLeaf;

		if (!(route in state.branches)) {
			state.branches[route] = { leaves: {}, slugs: {} };
			this.loadNestedBranch(parentBranch, parentLeaf, activeBranch, route);
		} else {
			if (state.active.parent.leaf.id == null) state.active.parent.leaf.id = state.branches[route].slugs[parentLeaf];
		}

		this.setState(state);

		log(12, 'end PrismTree.changeNestedBranch()');
	},

	changeNestedLeaf: function changeNestedLeaf(parentBranch, parentLeaf, activeBranch, activeLeaf) {
		log(11, 'beg PrismTree.changeNestedLeaf()');

		var state = this.state;

		var route = parentBranch + '/' + parentLeaf + '/' + activeBranch;

		state.active.branch = activeBranch;
		state.active.leaf = { id: null, slug: null };
		state.active.parent = { branch: parentBranch, leaf: { id: null, slug: null }, route: route };

		if (_.isNumber(parentLeaf)) state.active.parent.leaf.id = parentLeaf;else state.active.parent.leaf.slug = parentLeaf;

		if (_.isNumber(activeLeaf)) state.active.leaf.id = activeLeaf;else state.active.leaf.slug = activeLeaf;

		if (!(route in state.branches)) {
			state.branches[route] = { leaves: {}, slugs: {} };
			this.loadNestedBranch(parentBranch, parentLeaf, activeBranch, route);
		} else {
			if (state.active.leaf.id == null) state.active.leaf.id = state.branches[route].slugs[activeLeaf];
		}

		this.setState(state);

		log(12, 'end PrismTree.changeNestedLeaf()');
	},

	/**
  * A special case for dealing with search
  * @param  {[type]} branch [description]
  * @param  {[type]} leaf   [description]
  * @return {[type]}        [description]
  */
	changeSearch: function changeSearch() {

		log(11, 'beg PrismTree.changeSearch()');

		var state = this.state;
		var branch = 'search';

		state.active.branch = branch;
		state.active.leaf = { id: null, slug: null };
		state.search.last = state.search.query;
		state.search.query = window.location.hash.slice('#/search?query'.length + 1);

		if (!(branch in state.branches)) state.branches[branch] = { leaves: {}, slugs: {} };

		if (state.search.query != '') this.loadSearch(state.search.query);

		this.setState(state);

		log(12, 'end PrismTree.changeSearch()');
	},

	changeMeta: function changeMeta() {

		log(11, 'beg PrismTree.changeMeta()');

		var state = this.state;

		if (state.lockMeta == 'lock') return;

		var branch = state.active.branch;
		var leaf = state.active.leaf;

		if (state.branches[branch].leaves[leaf.id].metapanel == 'open') state.branches[branch].leaves[leaf.id].metapanel = 'closed';else state.branches[branch].leaves[leaf.id].metapanel = 'open';

		this.setState(state);

		log(12, 'end PrismTree.changeMeta()');
	},

	lockMeta: function lockMeta() {

		log(11, 'beg PrismTree.lockMeta()');

		var state = this.state;

		if (state.lockMeta == 'unlock') state.lockMeta = 'lock';else state.lockMeta = 'unlock';

		this.setState(state);

		log(12, 'end PrismTree.lockMeta()');
	},

	changeValue: function changeValue(e) {

		log(11, 'beg PrismTree.changeValue()');

		var state = this.state;

		var branch = state.branches[state.active.branch];
		var leaf = state.active.leaf.id;
		var key = e.target.dataset.key;

		if (key == 'title' || key == 'content') branch.leaves[leaf][key].raw = e.target.value;else branch.leaves[leaf][key] = e.target.value;

		state.currentlyChanged = true;

		this.setState(state);

		log(12, 'end PrismTree.changeValue()');
	},

	changeWidth: function changeWidth(e) {

		log(11, 'beg PrismTree.changeWidth()');

		if (e.clientX == 0) return;

		var state = this.state;

		var section = {
			name: e.target.parentElement.dataset.section,
			left: e.target.parentElement.offsetLeft
		};

		var position = e.clientX - section.left;

		// This could be more granular (currently at full percents),
		// but there is a rendering jump at smaller decimals
		section.width = parseInt(position / window.innerWidth * 100);

		// The sibling to the parent
		var partner = {};

		if (section.name == 'trunk') partner.name = 'branch';
		if (section.name == 'branch') partner.name = 'leaf';
		if (section.name == 'leaf') partner.name = 'meta';

		var totalWidth = state.width.current[section.name] + state.width.current[partner.name];

		partner.width = totalWidth - section.width;

		if (section.width == state.width.current[section.name]) return;

		if (section.width < state.width.minimum[section.name] || section.width > state.width.maximum[section.name]) return;
		if (partner.width < state.width.minimum[partner.name] || partner.width > state.width.maximum[partner.name]) return;

		state.width.current[section.name] = section.width;
		state.width.current[partner.name] = partner.width;

		this.setState(state);

		log(12, 'end PrismTree.changeWidth()');
	},

	changeView: function changeView(view) {

		log(11, 'beg PrismTree.changeView()');

		var state = this.state;

		if (view == state.branches[state.active.branch].view) return;

		state.branches[state.active.branch].view = view;

		this.setState(state);

		log(12, 'end PrismTree.changeView()');
	},

	resetWidth: function resetWidth(e) {

		log(11, 'beg PrismTree.resetWidth()');

		var state = this.state;

		state.width.current.trunk = state.width['default'].trunk;
		state.width.current.branch = state.width['default'].branch;
		state.width.current.leaf = state.width['default'].leaf;

		this.setState(state);

		log(12, 'end PrismTree.changeView()');
	},

	newLeaf: function newLeaf(branch) {

		log(11, 'beg PrismTree.newLeaf() ' + branch);

		this.changeBranch(branch);

		var data = {
			title: 'New',
			content_raw: '',
			branch: branch,
			url: PRISM.url.rest + branch,
			date: new Date().toISOString().slice(0, 19)
		};

		this.saveLeaf('create', data);

		log(12, 'end PrismTree.newLeaf()');
	},

	newNestedLeaf: function newNestedLeaf() {

		log(11, 'beg PrismTree.newNestedLeaf()');

		var data = {
			title: '',
			content: ' ',
			date: new Date().toISOString().slice(0, 19)
		};

		// this.saveLeaf( 'create', data );

		log(12, 'end PrismTree.newNestedLeaf()');
	},

	/**
  * This function creates a new leaf through this.newLeaf     (create type)
  *   or updates and existing leaf through PrismLeaf.prepLeaf (update type)
  */
	saveLeaf: function saveLeaf(type, data) {

		log(11, 'beg PrismTree.saveLeaf()');

		var request = {
			url: data.url,
			method: 'POST',
			data: data,
			type: type,
			url: data.url,
			callback: this.unloadLeaf
		};

		if (type == 'create') request.status = { type: 'saving', message: 'Creating new leaf in ' + data.branch + '...' };else request.status = { type: 'saving', message: 'Updating leaf ' + data.id + '...' };

		this.props.func.queueAJAX(request);

		this.props.func.checkQueue();

		log(12, 'end PrismTree.saveLeaf()');
	},

	unloadLeaf: function unloadLeaf(request, response) {
		log(request);
		log(response);

		if (response.status == 400 || response.status == 403) {

			this.changeStatus({ type: 'error', message: response.statusText + ': ' + response.responseJSON[0].message });
			this.changeStatus({ type: 'normal', message: null });
		} else {

			var state = this.state;

			var leaf = response;
			var branch = state.branches[state.active.branch];

			leaf.metapanel = 'closed';

			state.active.leaf.id = leaf.id;
			branch.leaves[leaf.id] = leaf;

			state.currentlyChanged = false;

			this.setState(state);

			if (request.type == 'create') this.changeStatus({ type: 'success', message: 'Created leaf!' });

			if (request.type == 'update') this.changeStatus({ type: 'success', message: 'Updated leaf ' + leaf.id + '!' });

			this.changeStatus({ type: 'normal', message: null });
		}
	},

	loadBranch: function loadBranch(branch) {

		log(11, 'beg PrismTree.loadBranch() ' + branch);

		var context = this.props.auth ? 'edit' : 'view';

		var params = '?filter[posts_per_page]=-1';
		params += '&context=' + context;

		var request = {
			url: PRISM.url.rest + branch + params,
			method: 'GET',
			callback: this.unloadBranch,
			branch: branch,
			status: { type: 'loading', message: 'Loading ' + branch + ' data...' }
		};

		this.props.func.queueAJAX(request);

		log(12, 'end PrismTree.loadBranch()');
	},

	loadSearch: function loadSearch(query) {

		log(11, 'beg PrismTree.loadSearch()');

		var params = '?filter[posts_per_page]=-1';
		params += '&filter[s]=' + query;

		var request = {
			url: PRISM.url.rest + 'posts' + params,
			method: 'GET',
			callback: this.unloadBranch,
			branch: 'search',
			status: { type: 'loading', message: 'Searching for "' + query + '" data!' }
		};

		this.props.func.queueAJAX(request);

		log(12, 'end PrismTree.loadBranch()');
	},

	loadNestedBranch: function loadNestedBranch(parentBranch, parentLeaf, activeBranch, route) {

		log(11, 'beg PrismTree.loadNestedBranch()');

		var state = this.state;

		var params = '?filter[posts_per_page]=-1';
		params += '&filter[connected_type]=' + parentBranch + '_to_' + activeBranch;
		params += '&filter[connected_id]=' + parentLeaf;

		var request = {
			url: PRISM.url.rest + parentBranch + params,
			method: 'GET',
			callback: this.unloadBranch,
			branch: route,
			status: { type: 'loading', message: 'Loading ' + activeBranch + ' data...' }
		};

		this.props.func.queueAJAX(request);

		log(12, 'end PrismTree.loadNestedBranch()');
	},

	unloadBranch: function unloadBranch(request, response) {

		log(11, 'beg PrismTree.unloadBranch()');

		var state = this.state;

		var slugs = {};
		var leaves = {};

		for (var i = 0; i < response.length; i++) {
			var leaf = response[i];
			var slug = leaf.slug;

			leaf.metapanel = 'closed';

			leaves[leaf.id] = leaf;

			// Create slug alias of id
			slugs[slug] = leaf.id;

			if (state.active.leaf.id == null && state.active.leaf.slug == slug) state.active.leaf.id = leaf.id;
		}

		state.branches[request.branch] = { leaves: leaves, slugs: slugs };

		if (request.branch in PRISM.view) state.branches[request.branch].view = PRISM.view[request.branch];else state.branches[request.branch].view = PRISM.view['default'];

		this.changeStatus({ type: 'success', message: 'Successfully loaded ' + request.branch + ' data!' });
		this.changeStatus({ type: 'normal', message: null });

		this.setState(state);

		log(12, 'end PrismTree.unloadBranch()');
	},

	needsData: function needsData(branch) {
		log(11, 'beg PrismTree.needsData() ' + branch);

		var needsData = false;

		var connectionBranch = this.state.branches[branch];

		var inQueue = false;

		PRISM.ajax.queue.map(function (request, i) {
			if (branch == request.branch) inQueue = true;
		}, this);

		this.props.data.ajax.queue.map(function (request, i) {
			if (branch == request.branch) inQueue = true;
		}, this);

		if (connectionBranch == undefined && !inQueue) needsData = true;

		log(12, 'end PrismTree.needsData() ' + needsData);
		return needsData;
	},

	hasData: function hasData(branch) {
		log(11, 'beg PrismTree.hasData() ' + branch);

		var hasData = false;

		var branchData = this.state.branches[branch];

		if (branchData != undefined) hasData = true;

		log(12, 'end PrismTree.hasData() ' + hasData);
		return hasData;
	},

	trunkData: function trunkData() {

		log(1, '---beg PrismTree.trunkData()');

		var state = this.state;

		var trunkData = {
			active: state.active,
			width: state.width.current.trunk,
			search: state.search,
			status: this.props.data.status
		};

		log(2, '---end PrismTree.trunkData()');

		return trunkData;
	},

	branchData: function branchData() {

		log(1, '---beg PrismTree.branchData()');

		var branch = null;
		var branchData = null;

		if (this.hasActiveBranch()) branch = this.state.active.branch;
		if (this.hasParentBranch()) branch = this.state.active.parent.route;

		if (branch == null) {
			branchData = {
				leaves: {},
				slugs: {},
				view: PRISM.view['default']
			};
		} else {
			branchData = this.state.branches[branch];
		}

		var query = this.state.search.query;

		if (branch == 'search' && _.isEmpty(branchData.leaves) && query != '') branchData.leaves[0] = {
			id: 0,
			type: null,
			content: { raw: '' },
			title: { raw: 'No search results for "' + query + '"' }
		};

		branchData.active = this.state.active;
		branchData.search = this.state.search;
		branchData.width = this.state.width.current.branch;

		log(2, '---end PrismTree.branchData()');

		return branchData;
	},

	leafData: function leafData() {

		log(1, '---beg PrismTree.leafData()');

		var leafData = {};

		var branch = this.state.active.branch;
		var leaf = this.state.active.leaf;

		if (this.hasActiveBranch()) {

			branch = this.state.branches[branch];

			if (this.hasActiveLeaf()) leafData = branch.leaves[leaf.id];
		}

		if (this.hasParentBranch()) {

			branch = this.state.active.parent.route;

			branch = this.state.branches[branch];

			if (this.hasParentLeaf()) leafData = branch.leaves[leaf.id];
		}

		leafData.width = this.state.width.current;
		leafData.metaActive = this.hasActiveMeta();
		leafData.currentlyChanged = this.state.currentlyChanged;

		log(2, '---end PrismTree.leafData()');

		return leafData;
	},

	metaData: function metaData() {

		log(1, '---beg PrismTree.metaData()');

		var metaData = { connections: [] };

		if (this.hasActiveBranch()) {

			var branch = this.state.active.branch;
			var leaf = this.state.active.leaf;

			var branches = this.state.branches;
			var leaves = branches[branch].leaves;

			// TODO: Currently cycles through whole map, convert to 'some' or use for/break?
			PRISM.branches.map(function (b, i) {
				if (b.slug.plural == branch) metaData.branch = b;
			});

			if (this.hasActiveLeaf()) {

				PRISM.meta['default'].map(function (key, i) {
					metaData[key] = leaves[leaf.id][key];
				}, this);

				PRISM.branches.map(function (b, i) {

					if (b.slug.plural == branch) {

						metaData.connections = b.connections;

						b.connections.map(function (connection, i) {

							// An array of post_ids in another branch
							// (actor ids in the actor branch)
							var keys = leaves[leaf.id][connection];

							metaData[connection] = {};

							keys.map(function (key, i) {
								metaData[connection][key] = {};
							});

							if (this.needsData(connection)) this.loadBranch(connection);

							if (this.hasData(connection)) {

								keys.map(function (key, i) {
									metaData[connection][key]['name'] = branches[connection].leaves[key].title.rendered;
									metaData[connection][key]['slug'] = branches[connection].leaves[key].slug;
								});
							} else {

								keys.map(function (key, i) {
									metaData[connection][key]['name'] = key;
									metaData[connection][key]['slug'] = key;
								});
							}
						}, this);
					}
				}, this);
			}
		}

		metaData.width = this.state.width.current.meta;
		metaData.metaActive = this.hasActiveMeta();
		metaData.lockMeta = this.state.lockMeta;
		metaData.currentlyChanged = this.state.currentlyChanged;

		log(2, '---end PrismTree.metaData()');

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
	render: function render() {

		log(11, 'beg PrismTree.render()');

		var auth = this.props.auth;
		var func = this.props.func;

		var trunkFunctions = {
			changeWidth: this.changeWidth,
			resetWidth: this.resetWidth,
			toggleRainbow: func.toggleRainbow,
			search: this.search
		};

		var branchFunctions = {
			loadBranch: this.loadBranch,
			changeLeaf: this.changeLeaf,
			changeView: this.changeView,
			changeWidth: this.changeWidth,
			resetWidth: this.resetWidth,
			addLeaf: this.addLeaf
		};

		var leafFunctions = {
			changeMeta: this.changeMeta,
			changeValue: this.changeValue,
			changeWidth: this.changeWidth,
			resetWidth: this.resetWidth,
			saveLeaf: this.saveLeaf
		};

		var metaFunctions = {
			changeValue: this.changeValue,
			lockMeta: this.lockMeta,
			saveLeaf: this.saveLeaf
		};

		var prismTrunk = React.createElement(PrismTrunk, { func: trunkFunctions, auth: auth, data: this.trunkData() });
		var prismBranch = React.createElement(PrismBranch, { func: branchFunctions, auth: auth, data: this.branchData() });
		var prismLeaf = React.createElement(PrismLeaf, { func: leafFunctions, auth: auth, data: this.leafData() });
		var prismMeta = React.createElement(PrismMeta, { func: metaFunctions, auth: auth, data: this.metaData() });

		var renderTrunk = prismTrunk; // For code consistency
		var renderBranch = this.hasActiveBranch() || this.hasParentBranch() ? prismBranch : null;
		var renderLeaf = this.hasActiveLeaf() || this.hasParentLeaf() ? prismLeaf : null;
		var renderMeta = this.hasActiveMeta() ? prismMeta : null;

		log(12, 'end PrismTree.render()');
		log(12, '----------------------');

		return React.createElement(
			'div',
			{ id: 'prism-tree' },
			renderTrunk,
			renderBranch,
			renderLeaf,
			renderMeta
		);
	}

});

"use strict";

var PrismFooter = React.createClass({
	displayName: "PrismFooter",

	render: function render() {

		return React.createElement("div", { id: "prism-footer" });
	}

});

'use strict';

var PrismTrunk = React.createClass({
	displayName: 'PrismTrunk',

	render: function render() {

		log(11, 'beg PrismTrunk.render()');

		var data = this.props.data;
		var func = this.props.func;

		var style = { 'width': data.width + '%' };

		log(11, 'end PrismTrunk.render()');

		return React.createElement(
			'div',
			{ id: 'prism-trunk', style: style, 'data-section': 'trunk' },
			React.createElement(PrismSearch, { data: data, func: func }),
			React.createElement(PrismMenu, { data: data }),
			React.createElement(PrismResizeBar, { data: data, func: func })
		);
	}

});

var PrismSearch = React.createClass({
	displayName: 'PrismSearch',

	changeBranch: function changeBranch() {

		var search = this.props.data.search;

		if (search.query == '' || search.last == search.query) window.location = '/#/search';
	},

	search: function search(e) {

		log(11, 'beg PrismSearchStatus.search()');

		var search = this.props.data.search;
		var value = e.target.value;

		if (value == '') {
			window.location = '/#/';
			return;
		}

		window.location = '/#/search?query=' + value;

		log(12, 'end PrismSearchStatus.search()');
	},

	autoSelect: function autoSelect(e) {
		e.nativeEvent.target.select();
	},

	render: function render() {

		log(11, 'beg PrismSearch.render()');

		var data = this.props.data;
		var func = this.props.func;

		var value = data.search.query;
		var focus = data.active.branch == 'search' ? true : false;

		var classes = 'prism-tree-header';
		classes += data.active.branch == 'search' ? ' active' : '';

		log(12, 'end PrismSearch.render()');

		return React.createElement(
			'div',
			{ id: 'prism-search', className: classes },
			React.createElement('input', { type: 'text', placeholder: 'Search', id: 'prism-search-bar', defaultValue: value, onClick: this.changeBranch, onBlur: this.search, onFocus: this.autoSelect, autoFocus: focus })
		);
	}

});

var PrismMenu = React.createClass({
	displayName: 'PrismMenu',

	render: function render() {

		var data = this.props.data;

		var menuItems = PRISM.branches.map(function (branch, i) {

			var branchPlural = branch.slug.plural;
			var href = '';

			if ('route' in branch) {
				href = branch.route;
			} else {
				href = '/#/' + branchPlural;
			}

			var active = branchPlural == data.active.branch;
			var parent = data.active.parent;

			var classes = active ? 'active' : '';
			classes += active && parent.branch != null ? ' parent' : '';

			var title = branch.title;

			var parentLink = (function () {

				if (active && parent.branch != null) {

					var leaf = data.active.parent.leaf;
					var parentSingle;

					PRISM.branches.map(function (b, i) {
						if (b.slug.plural == parent.branch) parentSingle = b.slug.single;
					});

					var href = '/#/' + parentSingle + '/' + leaf.slug;

					var link = React.createElement(
						'a',
						{ href: href, className: 'active parent' },
						'in ',
						parent.leaf.slug
					);
				}

				return link;
			}).bind(this);

			var iconClasses = branch.icon == null ? "fa fa-fw fa-thumb-tack" : "fa fa-fw " + branch.icon;

			return React.createElement(
				'li',
				{ key: i },
				React.createElement(
					'a',
					{ href: href, id: branchPlural, className: classes },
					React.createElement('i', { className: iconClasses }),
					title
				),
				parentLink()
			);
		}, this);

		return React.createElement(
			'menu',
			{ id: 'prism-menu' },
			React.createElement(
				'ul',
				null,
				menuItems
			)
		);
	}

});

'use strict';

var PrismBranch = React.createClass({
	displayName: 'PrismBranch',

	/**
  * Handles every later case, when user updates the branch
  */
	componentDidUpdate: function componentDidUpdate() {

		log(11, 'beg PrismBranch.componentDidUpdate()');

		this.scrollLeaf();

		log(12, 'end PrismBranch.componentDidUpdate()');
	},

	scrollLeaf: function scrollLeaf() {
		var data = this.props.data;

		var activeLeafID = window.location.hash.substring(2);

		var activeLeaf = document.getElementById(activeLeafID);
		var container = document.getElementById('prism-branch');
		var offset = document.getElementById('prism-branch-header');

		if (offset == null || activeLeaf == null) return;

		offset = offset.offsetHeight + 10;

		document.getElementById('prism-leaves').scrollTop = activeLeaf.offsetTop - offset;
	},

	render: function render() {

		log(11, 'beg PrismBranch.render()');

		var auth = this.props.auth;
		var data = this.props.data;
		var func = this.props.func;

		var style = { 'width': data.width + '%' };

		var prismLeafNodes = Object.keys(data.leaves).reverse().map(function (key) {

			var leaf = data.leaves[key];

			if (leaf.id == data.active.leaf.id) leaf.active = 'active';else leaf.active = '';

			var branch;
			var parentBranch;

			leaf.href = '';

			if (data.active.parent.branch != null) {
				// TODO: Currently cycles through whole map, convert to 'some' or use for/break?
				PRISM.branches.map(function (b, i) {
					if (b.slug.plural == data.active.parent.branch) parentBranch = b.slug.single;
				});

				leaf.href += parentBranch + '/' + data.active.parent.leaf.slug + '/';
			}

			// TODO: Currently cycles through whole map, convert to 'some' or use for/break?
			PRISM.branches.map(function (b, i) {
				if (b.slug.plural == leaf.type) branch = b.slug.single;
			});

			if (leaf.type == 'post') branch = 'post';
			if (leaf.type == 'attachment') branch = 'media';

			leaf.href += branch + '/' + leaf.slug;

			return React.createElement(PrismLeafNode, { data: leaf, key: key, func: func });
		}, this);

		log(12, 'end PrismBranch.render()');

		return React.createElement(
			'div',
			{ id: 'prism-branch', className: data.view, style: style, 'data-section': 'branch' },
			React.createElement(PrismBranchHeader, { auth: auth, data: data, func: func }),
			React.createElement(
				'ul',
				{ id: 'prism-leaves' },
				prismLeafNodes
			),
			React.createElement(PrismResizeBar, { data: data, func: func })
		);
	}

});

var PrismBranchHeader = React.createClass({
	displayName: 'PrismBranchHeader',

	changeView: function changeView(e) {

		log(11, 'beg PrismBranchHeader.changeView()');

		e.preventDefault();

		var view = e.target.dataset.view;

		this.props.func.changeView(view);

		log(12, 'end PrismBranchHeader.changeView()');
	},

	newLeaf: function newLeaf() {
		var branch;

		PRISM.branches.map(function (b, i) {
			if (b.slug.plural == this.props.data.active.branch) branch = b.slug.single;
		}, this);

		window.location.hash = '/' + branch + '/new';
	},

	render: function render() {

		log(11, 'beg PrismBranchHeader.render()');

		var auth = this.props.auth;
		var data = this.props.data;
		var func = this.props.func;

		var grid = data.view == 'grid' ? ' fa-th active' : ' fa-th';
		var half = data.view == 'half' ? ' fa-th-large active' : ' fa-th-large';
		var full = data.view == 'full' ? ' fa-square active' : ' fa-square';
		var list = data.view == 'list' ? ' fa-list active' : ' fa-list';

		var classes = 'fa fa-pull-right fa-2x';

		var newLeafButton = React.createElement('i', { id: 'prism-add-leaf', className: classes + ' fa-plus', onClick: this.newLeaf });

		var renderNewLeaf = auth && data.active.branch !== 'search' ? newLeafButton : null;

		log(12, 'end PrismBranchHeader.render()');

		return React.createElement(
			'header',
			{ id: 'prism-branch-header', className: 'prism-tree-header' },
			React.createElement(
				'h2',
				null,
				data.active.branch
			),
			React.createElement(
				'div',
				{ id: 'prism-branch-visual-controls' },
				React.createElement('i', { id: 'prism-branch-view-rows', 'data-view': 'list', className: classes + list, onClick: this.changeView }),
				React.createElement('i', { id: 'prism-branch-view-full', 'data-view': 'full', className: classes + full, onClick: this.changeView }),
				React.createElement('i', { id: 'prism-branch-view-half', 'data-view': 'half', className: classes + half, onClick: this.changeView }),
				React.createElement('i', { id: 'prism-branch-view-grid', 'data-view': 'grid', className: classes + grid, onClick: this.changeView }),
				renderNewLeaf
			)
		);
	}

});

var PrismLeafNode = React.createClass({
	displayName: 'PrismLeafNode',

	id: function id() {

		log(1, 'beg PrismLeafNode.id()');

		var id = this.props.data.type;

		if (id == null) return 'no-search-results';

		if (this.props.data.type == 'attachment') id = 'media';

		id += "/" + this.props.data.slug;

		log(2, 'end PrismLeafNode.id()');

		return id;
	},

	render: function render() {

		log(1, 'beg PrismLeafNode.render()');

		var auth = this.props.auth;
		var data = this.props.data;
		var func = this.props.func;

		var id = this.id();

		if (id == 'no-search-results') data.href = 'search';

		var classes = 'prism-leaf ' + data.active;

		var thumbnail = {
			url: null,
			styles: {},
			classes: 'media'
		};

		if (data.type == 'attachment' && data.media_type == 'image') thumbnail.url = data.media_details.sizes.thumbnail.source_url;

		if ('featured_image_thumbnail_url' in data) thumbnail.url = data.featured_image_thumbnail_url;

		if (thumbnail.url != null) {
			thumbnail.styles.backgroundImage = 'url(' + thumbnail.url + ')';
			classes += ' media';
		}

		var contentType,
		    content = null;

		if (data.content != null) {
			contentType = data.content.raw == null ? 'rendered' : 'raw';
			content = data.content[contentType].length > 0 ? data.content[contentType].substring(0, 75) + '...' : '';
		}

		log(2, 'end PrismLeafNode.render()');

		return React.createElement(
			'li',
			{ id: data.href, className: classes, key: this.props.key },
			React.createElement(
				'a',
				{ href: '#/' + data.href },
				React.createElement(
					'h4',
					null,
					data.title[contentType]
				),
				React.createElement(
					'p',
					null,
					content
				)
			),
			React.createElement('b', { className: thumbnail.classes, style: thumbnail.styles })
		);
	}

});

'use strict';

var PrismLeaf = React.createClass({
	displayName: 'PrismLeaf',

	getInitialState: function getInitialState() {
		return { edit: false };
	},

	toggleEdit: function toggleEdit(e) {

		if (this.props.auth) {

			if (this.state.edit) this.prepLeaf(e);

			this.setState({ edit: this.state.edit ? false : true });
		}
	},

	prepLeaf: function prepLeaf(e) {

		var data = this.props.data;
		var func = this.props.func;

		if (!data.currentlyChanged) return;

		data = {
			'id': data.id,
			'status': 'publish',
			'branch': data.type,
			'url': PRISM.url.rest + data.type + '/' + data.id
		};

		data[e.target.dataset.key] = e.target.value;

		func.saveLeaf('update', data);
	},

	autoSelect: function autoSelect(e) {
		e.nativeEvent.target.select();
	},

	renderContentPanel: function renderContentPanel() {

		var auth = this.props.auth;
		var data = this.props.data;
		var func = this.props.func;

		var contentType,
		    content = null;

		if (data.content != null) {
			contentType = data.content.raw == null ? 'rendered' : 'raw';
			content = data.content[contentType].length > 0 ? data.content[contentType].substring(0, 75) + '...' : '';
		}

		if (data.type == 'attachment') content = React.createElement('img', { src: data.source_url });else content = data.content[contentType];

		var editContent = React.createElement('textarea', { autoFocus: true, id: 'prism-leaf-content', 'data-key': 'content', value: content, onBlur: this.toggleEdit, onFocus: this.autoSelect, onChange: func.changeValue });
		var staticContent = React.createElement(
			'pre',
			{ id: 'prism-leaf-content', onDoubleClick: this.toggleEdit },
			content
		);

		var renderContent = this.state.edit == true ? editContent : staticContent;

		return renderContent;
	},

	render: function render() {

		var auth = this.props.auth;
		var data = this.props.data;
		var func = this.props.func;

		func.prepLeaf = this.prepLeaf;
		func.autoSelect = this.autoSelect;

		var style = {};

		if (data.metaActive) style.width = data.width.leaf + '%';else style.width = 100 - (data.width.trunk + data.width.branch) + '%';

		var resizeBar = data.metaActive ? React.createElement(PrismResizeBar, { data: data, func: func }) : null;

		return React.createElement(
			'div',
			{ id: 'prism-leaf', 'data-section': 'leaf', style: style },
			React.createElement(PrismLeafHeader, { auth: auth, data: data, func: func }),
			this.renderContentPanel(),
			resizeBar
		);
	}

});

var PrismLeafHeader = React.createClass({
	displayName: 'PrismLeafHeader',

	render: function render() {

		var auth = this.props.auth;
		var data = this.props.data;
		var func = this.props.func;

		var contentType = data.title.raw == null ? 'rendered' : 'raw';

		return React.createElement(
			'header',
			{ id: 'prism-leaf-header', className: 'prism-tree-header' },
			React.createElement(PrismLeafTitle, { auth: auth, data: data.title[contentType], func: func }),
			React.createElement(PrismIcon, { type: 'toggle', data: data, func: func })
		);
	}
});

var PrismLeafTitle = React.createClass({
	displayName: 'PrismLeafTitle',

	getInitialState: function getInitialState() {
		return { edit: false };
	},

	toggleEdit: function toggleEdit(e) {

		if (this.props.auth) {

			if (this.state.edit) this.props.func.prepLeaf(e);

			this.setState({ edit: this.state.edit ? false : true });
		}
	},

	renderTitle: function renderTitle() {

		var auth = this.props.auth;
		var data = this.props.data;
		var func = this.props.func;

		var editTitle = React.createElement('input', { autoFocus: true, 'data-key': 'title', type: 'text', value: data, onBlur: this.toggleEdit, onFocus: func.autoSelect, onChange: func.changeValue });
		var staticTitle = React.createElement(
			'div',
			{ onClick: this.toggleEdit },
			data
		);

		var renderTitle = this.state.edit ? editTitle : staticTitle;

		return renderTitle;
	},

	clickTitle: function clickTitle() {
		if (PRISM.newleaf) {
			PRISM.newleaf = false;

			jQuery('#prism-leaf-header h2 div').click();
		}
	},

	componentDidMount: function componentDidMount() {
		this.clickTitle();
	},

	componentDidUpdate: function componentDidUpdate() {
		this.clickTitle();
	},

	render: function render() {

		return React.createElement(
			'h2',
			null,
			this.renderTitle()
		);
	}

});

'use strict';

var PrismMeta = React.createClass({
	displayName: 'PrismMeta',

	prepMeta: function prepMeta(e) {

		var data = this.props.data;
		var func = this.props.func;

		if (!data.currentlyChanged) return;

		data = {
			'id': data.id,
			'status': 'publish'
		};

		data[e.target.dataset.key] = e.target.value;

		func.saveLeaf('update', data);
	},

	autoSelect: function autoSelect(e) {
		e.nativeEvent.target.select();
	},

	render: function render() {

		log(11, 'beg PrismMeta.render()');

		var auth = this.props.auth;
		var data = this.props.data;
		var func = this.props.func;

		func.prepMeta = this.prepMeta;
		func.autoSelect = this.autoSelect;

		var metaInfoToDisplay = data.type in PRISM.meta ? data.type : 'default';

		var renderMetaInfo = PRISM.meta[metaInfoToDisplay].map(function (key, i) {

			return React.createElement(PrismMetaInfo, { auth: auth, data: data[key], func: func, key: i, label: key });
		}, this);

		var renderConnections = data.connections.map(function (key, i) {
			return React.createElement(PrismMetaConnection, { auth: auth, data: data, func: func, key: i, label: key });
		}, this);

		var style = { 'width': data.width + '%' };

		log(12, 'end PrismMeta.render()');

		return React.createElement(
			'div',
			{ id: 'prism-meta', style: style },
			React.createElement(
				'header',
				{ id: 'prism-meta-header', className: 'prism-tree-header' },
				React.createElement(
					'h2',
					null,
					'Meta'
				),
				React.createElement(PrismIcon, { type: 'lock', data: data, func: func })
			),
			React.createElement(
				'ul',
				{ id: 'prism-meta-info' },
				renderMetaInfo,
				renderConnections
			)
		);
	}

});

var PrismMetaInfo = React.createClass({
	displayName: 'PrismMetaInfo',

	getInitialState: function getInitialState() {
		return { edit: false };
	},

	toggleEdit: function toggleEdit(e) {

		var key = e.target.dataset.key;
		var auth = this.props.auth;
		var data = this.props.data;
		var func = this.props.func;
		var value = e.target.value;

		// If not authenticated, don't all to edit
		if (!auth) return;

		// If currently editing, ignore extra clicks
		if (this.state.edit && e.type == 'click') return;

		// Don't allow editing of the primary ID
		if (key == 'id') return;

		this.setState({ edit: this.state.edit ? false : true });

		// It is toggling from static to edit
		if (value == undefined) return;

		func.prepMeta(e);
	},

	render: function render() {

		var data = this.props.data;
		var func = this.props.func;

		var label = this.props.label;

		var editData = React.createElement('input', { autoFocus: true, type: 'text', 'data-key': label, value: data, onBlur: this.toggleEdit, onFocus: func.autoSelect, onChange: func.changeValue });
		var staticData = React.createElement(
			'code',
			{ 'data-key': label },
			data
		);

		var renderData = this.state.edit == true ? editData : staticData;

		return React.createElement(
			'li',
			{ key: label },
			React.createElement(
				'h4',
				null,
				label + ':'
			),
			React.createElement(
				'span',
				{ onClick: this.toggleEdit },
				renderData
			)
		);
	}

});

var PrismMetaConnection = React.createClass({
	displayName: 'PrismMetaConnection',

	render: function render() {

		log(11, 'beg PrismMetaConnection.render()');

		var data = this.props.data;
		var func = this.props.func;

		var label = this.props.label;

		var nameSingle = data.branch.slug.single;
		var nestedSingle;

		// TODO: Currently cycles through whole map, convert to 'some' or use for/break?
		PRISM.branches.map(function (branch, i) {
			if (branch.slug.plural == label) nestedSingle = branch.slug.single;
		});

		var renderData = Object.keys(data[label]).map(function (key, i) {
			var href = "/#/" + nameSingle + "/" + data.slug + "/" + nestedSingle + "/" + data[label][key].slug;

			return React.createElement(
				'a',
				{ key: i, href: href },
				data[label][key].name
			);
		});

		var href = "/#/" + nameSingle + "/" + data.slug + "/" + label;

		log(12, 'end PrismMetaConnection.render()');

		return React.createElement(
			'li',
			{ key: label, className: 'connections' },
			React.createElement(
				'h4',
				null,
				React.createElement(
					'a',
					{ href: href },
					'Connected ' + label + ':'
				)
			),
			React.createElement(
				'span',
				null,
				renderData
			)
		);
	}

});

/**
 * Utilities used in all parts of the application
 */

"use strict";

var PrismResizeBar = React.createClass({
	displayName: "PrismResizeBar",

	render: function render() {

		var data = this.props.data;
		var func = this.props.func;

		return React.createElement("div", { draggable: "true", className: "prism-resize-bar", onDoubleClick: func.resetWidth, onDrag: func.changeWidth });
	}

});

var PrismIcon = React.createClass({
	displayName: "PrismIcon",

	lockMeta: function lockMeta(e) {
		e.preventDefault();

		this.props.func.lockMeta();
	},

	changeMeta: function changeMeta(e) {
		e.preventDefault();

		this.props.func.changeMeta();
	},

	render: function render() {

		var auth = this.props.auth;
		var data = this.props.data;
		var func = this.props.func;

		var lockIcon = data.lockMeta == 'lock' ? 'lock' : 'unlock-alt';

		var lockClasses = "fa fa-2x fa-pull-right lock-meta fa-" + lockIcon;
		var toggleClasses = "fa fa-2x fa-pull-left toggle-meta";

		toggleClasses += data.metaActive ? ' fa-toggle-right active' : ' fa-toggle-left';

		var classes = this.props.type == 'lock' ? lockClasses : toggleClasses;
		var handleClick = this.props.type == 'lock' ? this.lockMeta : this.changeMeta;

		return React.createElement("i", { className: classes, onClick: handleClick });
	}

});

var log = function log(level, message) {

	// For log( message ) calls to set default
	if (!_.isNumber(level)) {
		message = level;
		level = 10000;
	}

	if (parseInt(PRISM.debug.level) <= level) {

		var ignore = false;

		PRISM.debug.ignore.map(function (obj) {
			if (_.isString(message) && message.indexOf(obj) >= 0) ignore = true;
		});

		if (!ignore) console.log(_.now(), message);
	}
};

"use strict";

var PrismStatusBar = React.createClass({
	displayName: "PrismStatusBar",

	render: function render() {

		var data = this.props.data;
		var func = this.props.func;

		var statusLog = _.clone(data.status.log).reverse().map(function (entry, i) {
			return React.createElement(
				"li",
				{ className: entry.type },
				React.createElement("i", { className: "fa fa-li fa-chevron-right" }),
				entry.message
			);
		}, this);

		return React.createElement(
			"div",
			{ id: "prism-status-bar" },
			React.createElement(
				"h3",
				null,
				"Status Log"
			),
			React.createElement(
				"ul",
				{ id: "prism-status-log", className: "fa-ul" },
				statusLog
			)
		);
	}

});

var PrismStatus = React.createClass({
	displayName: "PrismStatus",

	timeout: null,

	getInitialState: function getInitialState() {
		var state = {
			showStatus: false,
			status: {
				type: null,
				message: null,
				time: null
			}
		};

		return state;
	},

	componentWillReceiveProps: function componentWillReceiveProps() {

		log(11, 'beg PrismStatus.componentWillReceiveProps()');

		var data = this.props.data;
		var state = this.state;

		var logs = data.status.log.length;

		if (logs == 0) {
			state.showStatus = false;
			state.status = { type: null, message: null, time: null };
		} else {
			if (data.status.log[logs - 1].time == state.status.time) return;
			state.showStatus = true;
			state.status = data.status.log[logs - 1];
		}

		if (this.timeout != null) clearTimeout(this.timeout);

		this.timeout = setTimeout(this.hide, PRISM.status.timeout);

		this.setState(state);

		log(12, 'end PrismStatus.componentWillReceiveProps()');
	},

	hide: function hide() {
		var state = this.state;

		state.showStatus = false;

		this.setState(state);
	},

	render: function render() {
		log(11, 'beg PrismStatus.render()');

		var state = this.state;

		var data = this.props.data;
		var func = this.props.func;

		var statusClasses = state.showStatus ? 'show-status' : 'hide-status';

		var buttonClasses = state.showStatus ? state.status.type : '';
		buttonClasses += data.statusBar ? ' active' : '';

		var status = state.status;

		log(12, 'end PrismStatus.render()');

		return React.createElement(
			"div",
			{ id: "prism-status", className: statusClasses },
			React.createElement(
				"div",
				{ id: "prism-status-button", className: buttonClasses, onClick: func.toggleStatusBar },
				React.createElement("i", { className: "fa fa-play" }),
				React.createElement("i", { className: "fa fa-play" }),
				React.createElement("i", { className: "fa fa-play" }),
				React.createElement("i", { className: "fa fa-play" }),
				React.createElement("i", { className: "fa fa-play" }),
				React.createElement("i", { className: "fa fa-play" })
			),
			React.createElement(
				"div",
				{ id: "prism-status-message" },
				status.message
			)
		);
	}

});

"use strict";

var PrismUserBar = React.createClass({
	displayName: "PrismUserBar",

	componentDidUpdate: function componentDidUpdate() {
		window.scrollBy(500, 0);
	},

	render: function render() {
		return React.createElement(
			"div",
			{ id: "prism-user-bar" },
			React.createElement(
				"a",
				{ href: PRISM.url.login + '?redirect_to=' + PRISM.url.root },
				"Login"
			)
		);
	}
});

'use strict';

window.onkeyup = function (e) {

	var key = {
		code: e.keyCode ? e.keyCode : e.which,
		time: new Date(),
		mode: ''
	};

	var stateChange;

	if (PRISM.key.mode == false) {
		key.mode = false;
	} else {
		key.mode = PRISM.key.mode;
		PRISM.key.mode = false;
	}

	var input = document.activeElement.tagName == 'INPUT';

	// TODO: The 'RainbowBar' idea is deprecated for the time being 2015-10-27 15:58:07
	// var doubleKeyTime = key.time - PRISM.key.last.time < PRISM.key.double.time;
	// var doubleKeyCode = key.code == PRISM.key.double.code && PRISM.key.last.code == PRISM.key.double.code;

	// if ( doubleKeyTime && doubleKeyCode )
	// 	document.getElementById( 'prism-rainbow-bar' ).focus();

	// console.log( key.code );

	switch (key.code) {
		case 13:
			// Return
			if (input) document.activeElement.blur();else stateChange = { 'addLeaf': true };

			break;

		// case 27: // Escape
		// 	if ( document.activeElement.id == 'prism-status-bar' )
		// 		document.getElementById( 'prism-status-bar' ).blur();
		// 	break;

		case 32:
			// Spacebar
			break;

		case 37:
			// 'left'
			if (!input) stateChange = { 'move': 'left' };
			break;

		case 38:
			// 'up'
			if (!input) stateChange = { 'move': 'up' };
			break;

		case 39:
			// 'right'
			if (!input) stateChange = { 'move': 'right' };
			break;

		case 40:
			// 'down'
			if (!input) stateChange = { 'move': 'down' };
			break;

		case 70:
			// f - for 'full' (with 'v' keyMode)
			if (!input && key.mode == 'v') stateChange = { 'view': 'full' };
			break;

		case 71:
			// g - for 'grid' (with 'v' keyMode)
			if (!input && key.mode == 'v') stateChange = { 'view': 'grid' };
			break;

		case 72:
			// h - for 'half' (with 'v' keyMode)
			if (!input && key.mode == 'v') stateChange = { 'view': 'half' };else if (!input) stateChange = { 'move': 'left' };

			break;

		case 73:
			// i
			break;

		case 74:
			// j - for 'down' (vim style)
			if (!input) stateChange = { 'move': 'down' };
			break;

		case 75:
			// k - for 'up' (vim style)
			if (!input) stateChange = { 'move': 'up' };
			break;

		case 76:
			// l - for 'right' (vim style)

			if (!input && e.shiftKey) stateChange = { 'lockMeta': true };else if (!input && key.mode == 'v') stateChange = { 'view': 'list' };else if (!input) stateChange = { 'move': 'right' };

			break;

		case 80:
			// p - for panel
			if (!input) stateChange = { 'changeMeta': true };
			break;

		case 83:
			// s - for status and search
			if (!input && e.shiftKey) stateChange = { 'statusBar': true };else if (!input) stateChange = { 'search': true };

			break;

		case 85:
			// u - for user bar
			if (!input) stateChange = { 'userBar': true };
			break;

		case 86:
			// v - for view
			if (!input && key.mode == false) PRISM.key.mode = 'v';
			break;

		case 187:
			// =/+
			if (!input && e.shiftKey) stateChange = { 'addLeaf': true };
			break;

		default:
			break;
	}

	PRISM.key.last.code = key.code;
	PRISM.key.last.time = key.time;

	if (stateChange != null) PrismKeyHandler(stateChange);
};

var PrismKeyHandler = function PrismKeyHandler(data) {};

var RainbowBarHandler = {
	'add post': function addPost() {
		jQuery('#posts').click();jQuery('#prism-add-leaf').click();
	}
};

/** 
 * Structure
 *
 * - #prism
 *   - #prism-header
 *     - #prism-title
 *     - #prism-rainbow-bar
 *     - #prism-user-account
 *   - #prism-body
 *     - #prism-trunk
 *       - #prism-search
 *       - .prism-branch
 *     - #prism-branch
 *       - #prism-branch-header
 *         - #prism-add-leaf
 *       - #prism-leaves
 *         - .prism-leaf
 *     - #prism-leaf
 *       - #prism-leaf-header
 *   - #prism-footer
 */

'use strict';

var Prism = React.createClass({
	displayName: 'Prism',

	getInitialState: function getInitialState() {

		log(11, 'beg Prism.getInitialState()');

		var state = {
			status: {
				log: [],
				current: {
					type: 'normal',
					time: new Date(),
					message: null
				}
			},
			ajax: {
				status: 'done',
				queue: []
			},
			statusBar: false,
			userBar: false
		};

		log(12, 'end Prism.getInitialState()');

		return state;
	},

	componentWillMount: function componentWillMount() {

		log(11, 'beg Prism.componentWillMount()');

		this.loadUser();

		log(12, 'end Prism.componentWillMount()');
	},

	checkQueue: function checkQueue() {

		log(11, 'beg Prism.checkQueue()');

		var state = this.state;

		state.ajax.queue = state.ajax.queue.concat(PRISM.ajax.queue);
		PRISM.ajax.queue = [];

		if (state.ajax.queue.length > 0 && state.ajax.status == 'done') this.sendRequest(state.ajax.queue[0]);

		this.setState;

		log(12, 'end Prism.checkQueue()');
	},

	sendRequest: function sendRequest(request) {

		log(11, 'beg Prism.sendRequest()');

		var state = this.state;

		if (request.method == 'GET') state.ajax.status = 'getting';else if (request.method == 'POST') state.ajax.status = 'posting';

		this.setState(state);

		this.changeStatus(request.status);

		log(request);

		jQuery.ajax({
			method: request.method,
			url: request.url,
			data: request.data,
			beforeSend: function beforeSend(xhr) {
				xhr.setRequestHeader('X-WP-Nonce', PRISM.nonce);
			},
			success: this.dequeueAJAX,
			error: this.dequeueAJAX
		});

		log(12, 'end Prism.sendRequest()');
	},

	queueAJAX: function queueAJAX(request) {
		log(11, 'beg Prism.queueAJAX()');

		PRISM.ajax.queue.push(request);

		log(12, 'end Prism.queueAJAX()');
	},

	dequeueAJAX: function dequeueAJAX(response) {
		log(11, 'beg Prism.dequeueAJAX()');

		var state = this.state;

		var request = state.ajax.queue.shift();

		state.ajax.status = 'done';

		request.callback(request, response);

		// TODO: GREAT WORKAROUND OR UGLIEST WORKAROUND
		//       TIE AJAX QUEUE TO STATE, BUT DON'T DISRUPT STATE IF NOT DONE
		//       PUT IN TEMP QUEUE, THEN COMBINE AT END OF EVERY AJAX CALL
		//       SHOULD BE A CLEANER WAY, BUT THIS SEEMS TO BE WORKING
		state.ajax.queue = state.ajax.queue.concat(PRISM.ajax.queue);
		PRISM.ajax.queue = [];

		this.setState(state);

		log(12, 'end Prism.dequeueAJAX()');
	},

	loadUser: function loadUser() {

		log(11, 'beg Prism.loadUser()');

		// TODO: Brought over from loadBranch, consider using
		// var context = this.props.auth ? 'edit' : 'view';
		// var params += '&context=' + context;

		var request = {
			url: PRISM.url.rest + 'users/me',
			method: 'GET',
			callback: this.unloadUser,
			status: { type: 'loading', message: 'Loading user data...' }
		};

		this.queueAJAX(request);

		log(12, 'end Prism.loadUser()');
	},

	unloadUser: function unloadUser(request, response) {
		log(11, 'beg Prism.unloadUser()');

		var state = this.state;

		state.auth = response.status == 401 ? false : true;

		state.user = response;

		this.setState(state);

		if (state.auth) {
			this.changeStatus({ type: 'success', message: 'Successfully loaded user!' });
		} else {
			this.changeStatus({ type: 'warning', message: 'No user logged in.' });
		}
		this.changeStatus({ type: 'normal', message: null });

		log(12, 'end Prism.unloadUser()');
	},

	toggleStatusBar: function toggleStatusBar() {

		log(11, 'beg Prism.toggleStatusBar()');

		var state = this.state;

		state.statusBar = state.statusBar ? false : true;

		this.setState(state);

		log(12, 'end Prism.toggleStatusBar()');
	},

	toggleUserBar: function toggleUserBar() {

		log(11, 'beg Prism.toggleUserBar()');

		var state = this.state;

		state.userBar = state.userBar ? false : true;

		this.setState(state);

		log(12, 'end Prism.toggleUserBar()');
	},

	changeStatus: function changeStatus(status) {

		log(11, 'beg Prism.changeStatus()');

		var state = this.state;

		log(status);

		status.time = new Date();

		if (status.type != 'normal') state.status.log.push(status);

		state.status.current = status;

		this.setState(state);

		log(12, 'end Prism.changeStatus()');
	},

	render: function render() {

		log(11, 'beg Prism.render()');

		var auth = this.state.auth;
		var data = this.state;
		var func = {};

		func.queueAJAX = this.queueAJAX;
		func.checkQueue = this.checkQueue;
		func.changeStatus = this.changeStatus;
		func.toggleUserBar = this.toggleUserBar;
		func.toggleStatusBar = this.toggleStatusBar;

		var classes = data.statusBar ? 'status-bar' : '';

		classes += data.userBar ? ' user-bar' : '';

		log(12, 'end Prism.render()');

		return React.createElement(
			'div',
			{ id: 'prism', className: classes },
			React.createElement(PrismStatusBar, { data: data }),
			React.createElement(PrismHeader, { auth: auth, data: data, func: func }),
			React.createElement(PrismTree, { auth: auth, data: data, func: func }),
			React.createElement(PrismFooter, { func: func }),
			React.createElement(PrismUserBar, { data: data })
		);
	}

});

ReactDOM.render(React.createElement(Prism, null), document.body);
