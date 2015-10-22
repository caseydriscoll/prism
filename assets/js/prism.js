"use strict";

var PrismHeader = React.createClass({
	displayName: "PrismHeader",

	render: function render() {

		var auth = this.props.auth;
		var data = this.props.data;
		var func = this.props.func;

		return React.createElement(
			"header",
			{ id: "prism-header" },
			React.createElement(
				"a",
				{ href: PRISM.url.root },
				React.createElement(
					"h1",
					{ id: "prism-title", className: "title" },
					PRISM.title
				)
			),
			React.createElement(PrismUserAccount, { data: data, auth: auth, func: func }),
			React.createElement(
				"span",
				{ className: "description" },
				PRISM.description
			)
		);
	}

});

var PrismUserAccount = React.createClass({
	displayName: "PrismUserAccount",

	render: function render() {

		var auth = this.props.auth;
		var data = this.props.data;
		var func = this.props.func;

		var url,
		    icon = null;

		if (auth) {
			url = PRISM.url.login + '?redirect_to=' + PRISM.url.root + '&action=logout';
			icon = React.createElement("img", { src: this.props.data.user.avatar_urls[PRISM.gravatar.width], width: PRISM.gravatar.width, height: PRISM.gravatar.height });
		} else {
			url = PRISM.url.login + '?redirect_to=' + PRISM.url.root;
			icon = React.createElement("i", { className: "fa fa-user fa-2x fa-border" });
		}

		return React.createElement(
			"a",
			{ id: "prism-user-account", onClick: func.toggleUser },
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
				meta: false
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

			if ('rainbow' in changeState) func.toggleRainbow();

			if ('user' in changeState) func.toggleUser();
		};

		this.initRouter();

		log(12, 'end PrismTree.componentWillMount()');
	},

	move: function move(direction) {

		log(11, 'beg PrismTree.move()');

		if (this.hasActiveLeaf()) {
			var leaf = this.state.active.leaf;
			var branch = this.state.active.branch;

			var view = this.state.branches[branch].view;

			var id = branch + '/' + leaf;

			var next;

			var k = 0;
			var e = document.getElementById(id);
			while (e = e.previousSibling) {
				++k;
			}

			if (view == 'grid') {

				if (direction == 'left' && k % 4 != 0) next = document.getElementById(id).previousSibling;else if (direction == 'down') {
					next = document.getElementById(id).nextSibling;
					if (next != null) next = next.nextSibling;
					if (next != null) next = next.nextSibling;
					if (next != null) next = next.nextSibling;
				} else if (direction == 'up') {
					next = document.getElementById(id).previousSibling;
					if (next != null) next = next.previousSibling;
					if (next != null) next = next.previousSibling;
					if (next != null) next = next.previousSibling;
				} else if (direction == 'right' && k % 4 != 3) next = document.getElementById(id).nextSibling;
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

			if (next != null) window.location = '/#/' + next.id;
		}

		log(12, 'end PrismTree.move()');
	},

	initRouter: function initRouter() {

		log(11, 'beg PrismTree.initRouter()');

		var routes = {};
		var routerConfig = {};

		PRISM.branches.map(function (branch, i) {

			var method = "get_" + branch.slug + "_by_id";

			routes[branch.slug] = branch.slug;
			routes[branch.slug + "/:id"] = method;

			routerConfig[branch.slug] = (function () {
				this.changeBranch(branch.slug);
			}).bind(this);
			routerConfig[method] = (function (id) {
				this.changeLeaf(branch.slug, id);
			}).bind(this);
		}, this);

		routes.search = 'search';
		routerConfig.search = (function () {
			this.changeSearch();
		}).bind(this);

		routerConfig.routes = routes;

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

		log(2, '------end PrismTree.hasActiveBranch()');

		return hasActiveBranch;
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

			if (this.state.active.leaf !== null && this.state.active.leaf in activeBranch.leaves) hasActiveLeaf = true;
		}

		log(2, '------end PrismTree.hasActiveLeaf()');

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
	hasActiveMeta: function hasActiveMeta() {

		log(1, '------beg PrismTree.hasActiveMeta()');

		var state = this.state;

		var branch = state.active.branch;
		var leaf = state.active.leaf;

		var meta = false;

		if (this.hasActiveLeaf()) {
			if (state.lockMeta == 'lock' || state.branches[branch].leaves[leaf].metapanel == 'open') meta = true;
		}

		log(2, '------end PrismTree.hasActiveMeta()');

		return meta;
	},

	changeStatus: function changeStatus(type, message) {

		log(11, 'beg PrismTree.changeStatus()');

		this.props.func.changeStatus({ type: type, message: message });

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
	changeBranch: function changeBranch(branch) {

		log(11, 'beg PrismTree.changeBranch()');

		var state = this.state;

		state.active.branch = branch;

		if (!(branch in state.branches)) state.branches[branch] = { leaves: {} };

		this.setState(state);

		log(12, 'end PrismTree.changeBranch()');
	},

	changeLeaf: function changeLeaf(branch, leaf) {

		log(11, 'beg PrismTree.changeLeaf()');

		var state = this.state;

		state.active.branch = branch;
		state.active.leaf = leaf;
		state.active.meta = this.hasActiveMeta();

		if (!(branch in state.branches)) state.branches[branch] = { leaves: {} };

		this.setState(state);

		log(12, 'end PrismTree.changeLeaf()');
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
		state.search.last = state.search.query;
		state.search.query = window.location.hash.slice('#/search?query'.length + 1);

		if (!(branch in state.branches)) state.branches[branch] = { leaves: {} };

		this.setState(state);

		log(12, 'end PrismTree.changeSearch()');
	},

	changeMeta: function changeMeta() {

		log(11, 'beg PrismTree.changeMeta()');

		var state = this.state;

		if (state.lockMeta == 'lock') return;

		var branch = state.active.branch;
		var leaf = state.active.leaf;

		if (state.branches[branch].leaves[leaf].metapanel == 'open') state.branches[branch].leaves[leaf].metapanel = 'closed';else state.branches[branch].leaves[leaf].metapanel = 'open';

		state.active.meta = this.hasActiveMeta();

		this.setState(state);

		log(12, 'end PrismTree.changeMeta()');
	},

	lockMeta: function lockMeta() {

		log(11, 'beg PrismTree.lockMeta()');

		var state = this.state;

		if (state.lockMeta == 'unlock') state.lockMeta = 'lock';else state.lockMeta = 'unlock';

		state.active.meta = this.hasActiveMeta();

		this.setState(state);

		log(12, 'end PrismTree.lockMeta()');
	},

	changeValue: function changeValue(e) {

		log(11, 'beg PrismTree.changeValue()');

		var state = this.state;

		var branch = state.branches[state.active.branch];
		var leaf = state.active.leaf;
		var key = e.target.dataset.key;

		if (key == 'title' || key == 'content') branch.leaves[leaf][key].rendered = e.target.value;else branch.leaves[leaf][key] = e.target.value;

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

	addLeaf: function addLeaf() {

		log(11, 'beg PrismTree.addLeaf()');

		var data = {
			title: '',
			content: ' ',
			date: new Date().toISOString().slice(0, 19)
		};

		this.saveLeaf('create', data);

		log(12, 'end PrismTree.addLeaf()');
	},

	/**
  * This function creates a new leaf through this.addLeaf     (create type)
  *   or updates and existing leaf through PrismLeaf.prepLeaf (update type)
  *
  * TODO: The url should not rely on this.state.active.branch,
  *   cause maybe the user can switch it real fast
  */
	saveLeaf: function saveLeaf(type, data) {

		log(11, 'beg PrismTree.saveLeaf()');

		var url = PRISM.url.rest + this.state.active.branch;

		if (type == 'create') PRISM.newleaf = true;

		if (type == 'update') url += '/' + data.id;

		jQuery.ajax({
			method: 'POST',
			url: url,
			data: data,
			beforeSend: function beforeSend(xhr) {
				xhr.setRequestHeader('X-WP-Nonce', PRISM.nonce);
			},
			success: (function (response) {

				var state = this.state;

				var leaf = response;
				var branch = state.branches[state.active.branch];

				leaf.metapanel = 'closed';

				state.active.leaf = leaf.id;
				branch.leaves[leaf.id] = leaf;

				state.currentlyChanged = false;

				if (PRISM.newleaf) location.hash = "/" + this.state.active.branch + "/" + leaf.id;

				this.setState(state);
			}).bind(this),
			error: (function (response) {
				console.log('error: ', response);
			}).bind(this)
		});

		log(12, 'end PrismTree.saveLeaf()');
	},

	/**
  * There is a difference between loading the branch with local data a doing an ajax run.
  *
  * This function should only be called from the PrismBranch itself after mounting/updating.
  */
	loadBranch: function loadBranch(branch, params) {

		log(11, 'beg PrismTree.loadBranch()');

		// TODO: Temp stop gap to prevent infinite loop from firing millions of AJAX calls
		if (this.props.data.status.current.type != 'normal') return;

		this.changeStatus('loading', 'Loading ' + branch + ' data...');

		var url = PRISM.url.rest + branch + params;

		jQuery.ajax({
			method: 'GET',
			url: url,
			success: (function (response) {

				log(10, 'success PrismTree.loadBranch()');

				var state = this.state;
				var branch = this.state.active.branch;

				var leaves = {};

				for (var i = 0; i < response.length; i++) {
					var leaf = response[i];

					leaf.metapanel = this.state.active.meta ? 'open' : 'closed';

					leaves[leaf.id] = leaf;
				}

				state.branches[branch] = { leaves: leaves };

				// TODO: Temp stop gap to prevent constant updating loop in PrismBranch.componentWillUpdate/loadBranch
				if (branch == 'search') state.search.last = state.search.query;

				if (branch in PRISM.view) state.branches[branch].view = PRISM.view[branch];else state.branches[branch].view = PRISM.view['default'];

				this.changeStatus('success', 'Successfully loaded ' + branch + ' data!');
				this.changeStatus('normal', null);

				this.setState(state);
			}).bind(this)
		});

		log(12, 'end PrismTree.loadBranch()');
	},

	trunkData: function trunkData() {

		log(1, '---beg PrismTree.trunkData()');

		var state = this.state;

		var trunkData = {
			branch: '',
			width: state.width.current.trunk,
			search: state.search,
			status: this.props.data.status,
			rainbow: this.props.data.rainbowBar
		};

		if (this.hasActiveBranch()) trunkData.branch = this.state.active.branch;

		log(2, '---end PrismTree.trunkData()');

		return trunkData;
	},

	branchData: function branchData() {

		log(1, '---beg PrismTree.branchData()');

		var branchData = {
			leaves: [],
			width: this.state.width.current.branch,
			search: this.state.search,
			view: PRISM.view['default']
		};

		if (this.hasActiveBranch()) {

			var branch = this.state.active.branch;

			branchData.title = branch;
			branchData.leaf = this.state.active.leaf;
			branchData.view = this.state.branches[branch].view;
			branchData.leaves = this.state.branches[branch].leaves;
		}

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

			if (this.hasActiveLeaf()) leafData = branch.leaves[leaf];
		}

		leafData.width = this.state.width.current;
		leafData.metaActive = this.state.active.meta;
		leafData.currentlyChanged = this.state.currentlyChanged;

		log(2, '---end PrismTree.leafData()');

		return leafData;
	},

	metaData: function metaData() {

		log(1, '---beg PrismTree.metaData()');

		var metaData = {};

		var branch = this.state.active.branch;
		var leaf = this.state.active.leaf;

		if (this.hasActiveBranch()) {

			branch = this.state.branches[branch];

			if (this.hasActiveLeaf()) {

				PRISM.meta['default'].map(function (key, i) {
					metaData[key] = branch.leaves[leaf][key];
				}, this);
			}
		}

		metaData.width = this.state.width.current.meta;
		metaData.metaActive = this.state.active.meta;
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
		var renderBranch = this.hasActiveBranch() ? prismBranch : null;
		var renderLeaf = this.hasActiveLeaf() ? prismLeaf : null;
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

		var data = this.props.data;
		var func = this.props.func;

		var style = { 'width': data.width + '%' };

		return React.createElement(
			'div',
			{ id: 'prism-trunk', style: style, 'data-section': 'trunk' },
			React.createElement(PrismSearchStatus, { data: data, func: func }),
			React.createElement(PrismMenu, { data: data }),
			React.createElement(PrismResizeBar, { data: data, func: func })
		);
	}

});

var PrismSearchStatus = React.createClass({
	displayName: 'PrismSearchStatus',

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
	},

	hide: function hide() {
		var state = this.state;

		state.showStatus = false;

		this.setState(state);
	},

	changeBranch: function changeBranch() {

		var search = this.props.data.search;

		if (search.query == '' || search.last == search.query) window.location = '/#/search';
	},

	search: function search(e) {

		log(11, 'beg PrismSearch.search()');

		var search = this.props.data.search;
		var value = e.target.value;

		if (value == '') {
			window.location = '/#/';
			return;
		}

		window.location = '/#/search?query=' + value;

		log(12, 'end PrismSearch.search()');
	},

	autoSelect: function autoSelect(e) {
		e.nativeEvent.target.select();
	},

	render: function render() {

		var data = this.props.data;
		var func = this.props.func;

		var value = data.search.query;
		var focus = data.branch == 'search' ? true : false;
		var classes = data.branch == 'search' ? 'active' : '';

		var status = this.state;
		status.rainbow = data.rainbow;

		return React.createElement(
			'div',
			{ id: 'prism-search-status', className: classes },
			React.createElement(PrismRainbowButton, { data: status, func: func }),
			React.createElement(PrismRainbowStatus, { data: status, func: func }),
			React.createElement('input', { type: 'text', placeholder: 'Search', defaultValue: value, onClick: this.changeBranch, onBlur: this.search, onFocus: this.autoSelect, autoFocus: focus })
		);
	}

});

var PrismMenu = React.createClass({
	displayName: 'PrismMenu',

	render: function render() {

		var menuItems = PRISM.branches.map(function (branch, i) {

			var classes = branch.slug == this.props.data.branch ? 'active' : '';

			return React.createElement(
				'li',
				{ key: i },
				React.createElement(
					'a',
					{ href: '/#/' + branch.slug, id: branch.slug, className: classes, 'data-slug': branch.slug },
					branch.title
				)
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
  * Handles initial case, when a full url mounts the branch
  */
	componentDidMount: function componentDidMount() {

		log(11, 'beg PrismBranch.componentDidMount()');

		this.loadBranch();

		log(12, 'end PrismBranch.componentDidMount()');
	},

	/**
  * Handles every later case, when user updates the branch
  */
	componentDidUpdate: function componentDidUpdate() {

		log(11, 'beg PrismBranch.componentDidUpdate()');

		this.loadBranch();

		log(12, 'end PrismBranch.componentDidUpdate()');
	},

	/**
  * The branch loads with no leaves and runs this function to check on loading the branch with leaves.
  * 
  * @return {[type]} [description]
  */
	loadBranch: function loadBranch() {

		log(11, 'beg PrismBranch.loadBranch()');

		var data = this.props.data;
		var func = this.props.func;

		var branch = data.title;
		var params = '?filter[posts_per_page]=-1';

		var isNormal = branch != 'search';
		var isSearch = branch == 'search' && data.search.query != '' && data.search.query != data.search.last;

		var isEmpty = _.isEmpty(data.leaves);

		if (branch == 'search') {
			branch = 'posts';
			params += '&filter[s]=' + data.search.query;
		}

		if (isSearch || isNormal && isEmpty) func.loadBranch(branch, params);

		log(12, 'end PrismBranch.loadBranch()');
	},

	render: function render() {

		log(11, 'beg PrismBranch.render()');

		var auth = this.props.auth;
		var data = this.props.data;
		var func = this.props.func;

		var style = { 'width': data.width + '%' };

		var prismLeafNodes = Object.keys(data.leaves).reverse().map(function (key) {

			var leaf = data.leaves[key];

			if (leaf.id == data.leaf) leaf.active = 'active';else leaf.active = '';

			return React.createElement(PrismLeafNode, { data: leaf, key: key, func: func, type: data.title });
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

	render: function render() {

		log(11, 'beg PrismBranchHeader.render()');

		var auth = this.props.auth;
		var data = this.props.data;
		var func = this.props.func;

		var grid = data.view == 'grid' ? ' fa-th active' : ' fa-th';
		var half = data.view == 'half' ? ' fa-th-large active' : ' fa-th-large';
		var full = data.view == 'full' ? ' fa-square active' : ' fa-square';
		var list = data.view == 'list' ? ' fa-list active' : ' fa-list';

		var classes = 'fa fa-border fa-pull-right fa-2x';

		var renderAddLeaf = auth && data.title !== 'search' ? React.createElement('i', { id: 'prism-add-leaf', className: classes + ' fa-plus', onClick: func.addLeaf }) : null;

		log(12, 'end PrismBranchHeader.render()');

		return React.createElement(
			'header',
			{ id: 'prism-branch-header' },
			React.createElement(
				'h2',
				null,
				data.title
			),
			React.createElement(
				'div',
				{ id: 'prism-branch-visual-controls' },
				React.createElement('i', { id: 'prism-branch-view-rows', 'data-view': 'list', className: classes + list, onClick: this.changeView }),
				React.createElement('i', { id: 'prism-branch-view-full', 'data-view': 'full', className: classes + full, onClick: this.changeView }),
				React.createElement('i', { id: 'prism-branch-view-half', 'data-view': 'half', className: classes + half, onClick: this.changeView }),
				React.createElement('i', { id: 'prism-branch-view-grid', 'data-view': 'grid', className: classes + grid, onClick: this.changeView }),
				renderAddLeaf
			)
		);
	}

});

var PrismLeafNode = React.createClass({
	displayName: 'PrismLeafNode',

	id: function id() {

		log(1, 'beg PrismLeafNode.id()');

		var id = this.props.data.type;

		if (id.slice(-1) != 's') id += 's';

		if (this.props.data.type == 'attachment') id = 'media';

		id += "/" + this.props.data.id;

		log(2, 'end PrismLeafNode.id()');

		return id;
	},

	render: function render() {

		log(1, 'beg PrismLeafNode.render()');

		var auth = this.props.auth;
		var data = this.props.data;
		var func = this.props.func;
		var type = this.props.data.type;

		// TODO: Don't do this.
		// This is an UGLY stop gap to get around the post/posts problem
		if (type.slice(-1) != 's') type += 's';

		if (this.props.type == 'media') type = this.props.type;

		var id = this.id();
		var href = '/#/' + type + '/' + data.id;
		var title = data.title.rendered;

		var styles = {};
		var classes = 'prism-leaf ' + data.active;

		if (type == 'media' && data.media_type == 'image') {
			var thumbnail = data.media_details.sizes.thumbnail.source_url;

			styles.backgroundImage = 'url(' + thumbnail + ')';

			classes += ' ' + type;
		}

		log(2, 'end PrismLeafNode.render()');

		return React.createElement(
			'li',
			{ id: id, className: classes, key: this.props.key, style: styles },
			React.createElement(
				'a',
				{ href: href, 'data-title': title, 'data-id': data.id },
				title
			)
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
			'status': 'publish'
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

		var content;

		if (data.type == 'attachment') content = React.createElement('img', { src: data.source_url });else content = data.content.rendered;

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

		return React.createElement(
			'div',
			{ id: 'prism-leaf', 'data-section': 'leaf', style: style },
			React.createElement(PrismLeafHeader, { auth: auth, data: data, func: func }),
			this.renderContentPanel(),
			React.createElement(PrismResizeBar, { data: data, func: func })
		);
	}

});

var PrismLeafHeader = React.createClass({
	displayName: 'PrismLeafHeader',

	render: function render() {

		var auth = this.props.auth;
		var data = this.props.data;
		var func = this.props.func;

		return React.createElement(
			'header',
			{ id: 'prism-leaf-header' },
			React.createElement(PrismLeafTitle, { auth: auth, data: data.title.rendered, func: func }),
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

		var auth = this.props.auth;
		var data = this.props.data;
		var func = this.props.func;

		func.prepMeta = this.prepMeta;
		func.autoSelect = this.autoSelect;

		var metaInfoToDisplay = data.type in PRISM.meta ? data.type : 'default';

		var renderMetaInfo = PRISM.meta[metaInfoToDisplay].map(function (key, i) {

			return React.createElement(PrismMetaInfo, { auth: auth, data: data[key], func: func, key: i, label: key });
		}, this);

		var style = { 'width': data.width + '%' };

		return React.createElement(
			'div',
			{ id: 'prism-meta', style: style },
			React.createElement(
				'header',
				{ id: 'prism-meta-header' },
				React.createElement(
					'h3',
					null,
					'Post Meta'
				),
				React.createElement(PrismIcon, { type: 'lock', data: data, func: func })
			),
			React.createElement(
				'ul',
				{ id: 'prism-meta-info' },
				renderMetaInfo
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
		var toggleClasses = "fa fa-3x fa-pull-left toggle-meta";

		toggleClasses += data.metaActive ? ' fa-toggle-right active' : ' fa-toggle-left';

		var classes = this.props.type == 'lock' ? lockClasses : toggleClasses;
		var handleClick = this.props.type == 'lock' ? this.lockMeta : this.changeMeta;

		return React.createElement("i", { className: classes, onClick: handleClick });
	}

});

var log = function log(level, message) {
	if (parseInt(PRISM.debug.level) <= level) {

		var ignore = false;

		PRISM.debug.ignore.map(function (obj) {
			if (message.indexOf(obj) >= 0) ignore = true;
		});

		if (!ignore) console.log(_.now(), message);
	}
};

"use strict";

var PrismRainbowBar = React.createClass({
	displayName: "PrismRainbowBar",

	executeRainbow: function executeRainbow(e) {

		var key = e.keyCode ? e.keyCode : e.which;
		var func = this.props.func;
		var value = e.target.value;

		if (key == 13) {
			func.executeRainbow(value);
			e.target.value = '';
		}
	},

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
			{ id: "prism-rainbow-bar" },
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

var PrismRainbowButton = React.createClass({
	displayName: "PrismRainbowButton",

	render: function render() {

		var data = this.props.data;
		var func = this.props.func;

		var classes = data.showStatus ? data.status.type : null;

		classes += data.rainbow ? ' active' : '';

		return React.createElement(
			"div",
			{ id: "prism-rainbow-button", className: classes, onClick: func.toggleRainbow },
			React.createElement("i", { className: "fa fa-play" }),
			React.createElement("i", { className: "fa fa-play" }),
			React.createElement("i", { className: "fa fa-play" }),
			React.createElement("i", { className: "fa fa-play" }),
			React.createElement("i", { className: "fa fa-play" }),
			React.createElement("i", { className: "fa fa-play" })
		);
	}

});

var PrismRainbowStatus = React.createClass({
	displayName: "PrismRainbowStatus",

	render: function render() {

		var data = this.props.data;
		var func = this.props.func;

		var classes = data.showStatus ? 'show' : 'hide';

		var status = data.status;

		return React.createElement(
			"div",
			{ id: "prism-rainbow-status", className: classes },
			status.message
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
		return React.createElement("div", { id: "prism-user-bar" });
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

	var doubleKeyTime = key.time - PRISM.key.last.time < PRISM.key.double.time;
	var doubleKeyCode = key.code == PRISM.key.double.code && PRISM.key.last.code == PRISM.key.double.code;

	if (doubleKeyTime && doubleKeyCode) document.getElementById('prism-rainbow-bar').focus();

	// console.log( key.code );

	switch (key.code) {
		case 13:
			// Return
			if (input) document.activeElement.blur();else stateChange = { 'addLeaf': true };

			break;

		case 27:
			// Escape
			if (document.activeElement.id == 'prism-rainbow-bar') document.getElementById('prism-rainbow-bar').blur();
			break;

		case 32:
			// Spacebar
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

		case 82:
			// r - for rainbow bar
			if (!input) stateChange = { 'rainbow': true };
			break;

		case 85:
			// u - for user bar
			if (!input) stateChange = { 'user': true };
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
			rainbowBar: false,
			userBar: false
		};

		log(12, 'end Prism.getInitialState()');

		return state;
	},

	componentWillMount: function componentWillMount() {

		log(11, 'beg Prism.componentWillMount()');

		this.getUser();

		log(12, 'end Prism.componentWillMount()');
	},

	getUser: function getUser() {

		log(11, 'beg Prism.getUser()');

		jQuery.ajax({
			method: 'GET',
			url: PRISM.url.rest + 'users/me',
			beforeSend: function beforeSend(xhr) {
				xhr.setRequestHeader('X-WP-Nonce', PRISM.nonce);
			},
			success: (function (response) {

				log(10, 'success Prism.getUser()');

				var state = this.state;

				state.auth = true;
				state.user = response;

				this.setState(state);
			}).bind(this),
			error: (function (response) {

				log(10, 'error Prism.getUser()');

				var state = this.state;

				state.auth = false;
				state.user = response;

				this.setState(state);
			}).bind(this)
		});

		log(12, 'end Prism.getUser()');
	},

	toggleRainbow: function toggleRainbow() {

		log(11, 'beg Prism.toggleRainbow()');

		var state = this.state;

		state.rainbowBar = state.rainbowBar ? false : true;

		this.setState(state);

		log(12, 'end Prism.toggleRainbow()');
	},

	toggleUser: function toggleUser() {

		log(11, 'beg Prism.toggleUser()');

		var state = this.state;

		state.userBar = state.userBar ? false : true;

		this.setState(state);

		log(12, 'end Prism.toggleUser()');
	},

	changeStatus: function changeStatus(status) {

		log(11, 'beg Prism.changeStatus()');

		var state = this.state;

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

		func.changeStatus = this.changeStatus;
		func.toggleUser = this.toggleUser;
		func.toggleRainbow = this.toggleRainbow;

		var classes = data.rainbowBar ? 'rainbow' : '';

		classes += data.userBar ? ' user' : '';

		log(12, 'end Prism.render()');

		return React.createElement(
			'div',
			{ id: 'prism', className: classes },
			React.createElement(PrismRainbowBar, { data: data }),
			React.createElement(PrismHeader, { auth: auth, data: data, func: func }),
			React.createElement(PrismTree, { auth: auth, data: data, func: func }),
			React.createElement(PrismFooter, { func: func }),
			React.createElement(PrismUserBar, { data: data })
		);
	}

});

ReactDOM.render(React.createElement(Prism, null), document.body);
