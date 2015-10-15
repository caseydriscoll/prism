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
				"h1",
				{ className: "title" },
				PRISM.title
			),
			React.createElement(PrismRainbowBar, { data: data, func: func }),
			React.createElement(PrismUserAccount, { data: data, auth: auth }),
			React.createElement(
				"span",
				{ className: "description" },
				PRISM.description
			)
		);
	}

});

var PrismRainbowBar = React.createClass({
	displayName: "PrismRainbowBar",

	render: function render() {

		var data = this.props.data;
		var func = this.props.func;

		return React.createElement("input", { type: "text", id: "prism-bar", onFocus: func.toggleRainbowBar, onBlur: func.toggleRainbowBar });
	}

});

var PrismUserAccount = React.createClass({
	displayName: "PrismUserAccount",

	render: function render() {

		var auth = this.props.auth;
		var data = this.props.data;

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
			{ id: "prism-user-account", href: url },
			icon
		);
	}

});

'use strict';

var PrismTree = React.createClass({
	displayName: 'PrismTree',

	getInitialState: function getInitialState() {

		var state = {
			branches: {},
			active: { branch: null },
			lockMetaPanel: PRISM.lockMetaPanel,
			isMetaPanelOpen: false,
			currentlyChanged: false
		};

		return state;
	},

	/**
  * Returns true if the value of this.state.active.branch is not null
  *    and if that value is a key in this.state.branches
  * 
  * @return {Boolean} The status of the active branch
  */
	hasActiveBranch: function hasActiveBranch() {

		var hasActiveBranch = false;

		if (this.state.active.branch !== null && this.state.active.branch in this.state.branches) hasActiveBranch = true;

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

		var hasActiveLeaf = false;

		if (this.hasActiveBranch()) {

			var activeBranch = this.state.branches[this.state.active.branch];

			if ('leaf' in activeBranch && activeBranch.leaf in activeBranch.leaves) hasActiveLeaf = true;
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
	isMetaPanelOpen: function isMetaPanelOpen() {

		var state = this.state;

		var isMetaPanelOpen = false;

		var branch = state.active.branch;
		var leaf = state.branches[branch].leaf;

		if (state.lockMetaPanel == 'lock' || state.branches[branch].leaves[leaf].metapanel == 'open') isMetaPanelOpen = true;

		return isMetaPanelOpen;
	},

	changeLeaf: function changeLeaf(e) {
		e.preventDefault();

		var state = this.state;

		state.branches[state.active.branch].leaf = jQuery(e.nativeEvent.target).data('id');

		state.isMetaPanelOpen = this.isMetaPanelOpen();

		this.setState(state);
	},

	changeBranch: function changeBranch(e) {
		e.preventDefault();

		jQuery('#prism-menu a').removeClass('active');

		e.nativeEvent.target.classList.toggle('active');

		var state = this.state;

		state.active.branch = jQuery(e.nativeEvent.target).data('slug');

		this.setState(state);

		this.loadLeaves();
	},

	changeValue: function changeValue(e) {

		var state = this.state;

		var branch = state.branches[state.active.branch];
		var leaf = branch.leaf;
		var key = e.target.dataset.key;

		if (key == 'title' || key == 'content') branch.leaves[leaf][key].rendered = e.target.value;else branch.leaves[leaf][key] = e.target.value;

		state.currentlyChanged = true;

		this.setState(state);
	},

	changeBranchView: function changeBranchView(e) {
		e.preventDefault();

		var view = jQuery(e.nativeEvent.target).data('view');

		var state = this.state;

		if (view == state.branches[state.active.branch].view) return;

		jQuery('#prism-branch-visual-controls i').removeClass('active');

		state.branches[state.active.branch].view = view;

		this.setState(state);
	},

	toggleMetaPanel: function toggleMetaPanel(e) {
		e.preventDefault();

		var state = this.state;

		var branch = state.active.branch;
		var leaf = state.branches[branch].leaf;

		if (state.branches[branch].leaves[leaf].metapanel == 'open') state.branches[branch].leaves[leaf].metapanel = 'closed';else state.branches[branch].leaves[leaf].metapanel = 'open';

		state.isMetaPanelOpen = this.isMetaPanelOpen();

		this.setState(state);
	},

	lockMetaPanel: function lockMetaPanel(e) {
		e.preventDefault();

		var state = this.state;

		var branch = state.active.branch;
		var leaf = state.branches[branch].leaf;

		if (state.lockMetaPanel == 'unlock') state.lockMetaPanel = 'lock';else state.lockMetaPanel = 'unlock';

		this.setState(state);
	},

	addLeaf: function addLeaf() {

		var data = {
			title: '',
			content: ' ',
			date: new Date().toISOString().slice(0, 19)
		};

		this.saveLeaf('create', data);
	},

	/**
  * This function creates a new leaf through this.addLeaf     (create type)
  *   or updates and existing leaf through PrismLeaf.prepLeaf (update type)
  *
  * TODO: The url should not rely on this.state.active.branch,
  *   cause maybe the user can switch it real fast
  */
	saveLeaf: function saveLeaf(type, data) {

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
				var branch = state.branches[this.state.active.branch];

				leaf.metapanel = 'closed';

				branch.leaf = leaf.id;
				branch.leaves[leaf.id] = leaf;

				state.currentlyChanged = false;
				state.isMetaPanelOpen = this.isMetaPanelOpen();

				this.setState(state);
			}).bind(this),
			error: (function (response) {
				console.log('error: ', response);
			}).bind(this)
		});
	},

	loadLeaves: function loadLeaves() {

		// TODO: This is a temporary stop gap. Don't fetch the query if we already have them.
		// Ultimately, we'll have to check for changes and all that.
		if (this.state.active.branch in this.state.branches) return;

		jQuery.ajax({
			method: 'GET',
			url: PRISM.url.rest + this.state.active.branch + '?filter[posts_per_page]=-1',
			success: (function (response) {

				var state = this.state;

				var leaves = {};

				for (var i = 0; i < response.length; i++) {
					var leaf = response[i];

					leaf.metapanel = 'closed';

					leaves[leaf.id] = leaf;
				}

				state.branches[this.state.active.branch] = { leaves: leaves, view: PRISM.view };

				this.setState(state);
			}).bind(this)
		});
	},

	branchData: function branchData() {

		var branchData = { leaves: [] };

		if (this.hasActiveBranch()) {

			var branch = this.state.active.branch;

			branchData = {
				title: branch,
				view: this.state.branches[branch].view,
				leaf: this.state.branches[branch].leaf,
				leaves: this.state.branches[branch].leaves
			};
		}

		return branchData;
	},

	leafData: function leafData() {

		var leafData = {};

		var branch = this.state.active.branch;

		if (this.hasActiveBranch()) {

			branch = this.state.branches[branch];

			if (this.hasActiveLeaf()) leafData = branch.leaves[branch.leaf];
		}

		leafData.lockMetaPanel = this.state.lockMetaPanel;
		leafData.isMetaPanelOpen = this.state.isMetaPanelOpen;
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
	render: function render() {

		var auth = this.props.data.authenticated;

		var trunkFunctions = {
			changeBranch: this.changeBranch
		};

		var branchFunctions = {
			changeLeaf: this.changeLeaf,
			changeView: this.changeBranchView,
			addLeaf: this.addLeaf
		};

		var leafFunctions = {
			lockMetaPanel: this.lockMetaPanel,
			toggleMetaPanel: this.toggleMetaPanel,
			changeValue: this.changeValue,
			saveLeaf: this.saveLeaf
		};

		var prismTrunk = React.createElement(PrismTrunk, { func: trunkFunctions, auth: auth });
		var prismBranch = React.createElement(PrismBranch, { func: branchFunctions, auth: auth, data: this.branchData() });
		var prismLeaf = React.createElement(PrismLeaf, { func: leafFunctions, auth: auth, data: this.leafData() });

		var renderTrunk = prismTrunk; // For code consistency
		var renderBranch = this.hasActiveBranch() ? prismBranch : null;
		var renderLeaf = this.hasActiveLeaf() ? prismLeaf : null;

		return React.createElement(
			'div',
			{ id: 'prism-tree' },
			renderTrunk,
			renderBranch,
			renderLeaf
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

"use strict";

var PrismTrunk = React.createClass({
	displayName: "PrismTrunk",

	render: function render() {

		var auth = this.props.auth;
		var func = this.props.func;

		return React.createElement(
			"div",
			{ id: "prism-trunk" },
			React.createElement(PrismSearch, null),
			React.createElement(PrismMenu, { func: func })
		);
	}

});

var PrismSearch = React.createClass({
	displayName: "PrismSearch",

	render: function render() {

		return React.createElement(
			"div",
			{ id: "prism-search" },
			React.createElement("input", { type: "text", placeholder: "Search" })
		);
	}

});

var PrismMenu = React.createClass({
	displayName: "PrismMenu",

	render: function render() {

		var func = this.props.func;

		var menuItems = PRISM.branches.map(function (branch, i) {
			return React.createElement(
				"li",
				{ key: i },
				React.createElement(
					"a",
					{ href: '#' + branch.slug, "data-slug": branch.slug, onClick: func.changeBranch },
					branch.title
				)
			);
		}, this);

		return React.createElement(
			"menu",
			{ id: "prism-menu" },
			React.createElement(
				"ul",
				null,
				menuItems
			)
		);
	}

});

'use strict';

var PrismBranch = React.createClass({
	displayName: 'PrismBranch',

	render: function render() {

		var auth = this.props.auth;
		var data = this.props.data;
		var func = this.props.func;

		var prismLeafNodes = Object.keys(data.leaves).reverse().map(function (key) {

			var leaf = data.leaves[key];

			if (leaf.id == data.leaf) leaf.active = 'active';else leaf.active = '';

			return React.createElement(PrismLeafNode, { data: leaf, key: key, func: func });
		}, this);

		return React.createElement(
			'div',
			{ id: 'prism-branch', className: data.view },
			React.createElement(PrismBranchHeader, { auth: auth, data: data, func: func }),
			React.createElement(
				'ul',
				{ id: 'prism-leaves' },
				prismLeafNodes
			)
		);
	}

});

var PrismBranchHeader = React.createClass({
	displayName: 'PrismBranchHeader',

	render: function render() {

		var auth = this.props.auth;
		var data = this.props.data;
		var func = this.props.func;

		var grid = data.view == 'grid' ? ' fa-th active' : ' fa-th';
		var list = data.view == 'list' ? ' fa-list active' : ' fa-list';

		var classes = 'fa fa-border fa-pull-right fa-2x';

		var renderAddLeaf = auth ? React.createElement('i', { id: 'prism-add-leaf', className: classes + ' fa-plus', onClick: func.addLeaf }) : null;

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
				React.createElement('i', { id: 'prism-branch-rows', 'data-view': 'list', className: classes + list, onClick: func.changeView }),
				React.createElement('i', { id: 'prism-branch-grid', 'data-view': 'grid', className: classes + grid, onClick: func.changeView }),
				renderAddLeaf
			)
		);
	}

});

var PrismLeafNode = React.createClass({
	displayName: 'PrismLeafNode',

	id: function id() {
		return this.props.data.type + "-" + this.props.data.id;
	},

	render: function render() {

		var auth = this.props.auth;
		var data = this.props.data;
		var func = this.props.func;

		var id = this.id();
		var title = data.title.rendered;

		var classes = 'prism-leaf ' + data.active;

		return React.createElement(
			'li',
			{ id: id, className: classes, key: this.props.key, onClick: func.changeLeaf },
			React.createElement(
				'span',
				{ 'data-title': title, 'data-id': data.id },
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

		var content = data.content.rendered;

		var editContent = React.createElement('textarea', { autoFocus: true, id: 'prism-leaf-content', 'data-key': 'content', value: content, onBlur: this.toggleEdit, onFocus: this.autoSelect, onChange: func.changeValue });
		var staticContent = React.createElement(
			'div',
			{ id: 'prism-leaf-content', onDoubleClick: this.toggleEdit },
			content
		);

		var renderContent = this.state.edit == true ? editContent : staticContent;

		return renderContent;
	},

	renderMetaPanel: function renderMetaPanel() {

		var auth = this.props.auth;
		var data = this.props.data;
		var func = this.props.func;

		if (data.isMetaPanelOpen) return React.createElement(PrismLeafMetaPanel, { auth: auth, data: data, func: func });else return null;
	},

	render: function render() {

		var auth = this.props.auth;
		var data = this.props.data;
		var func = this.props.func;

		func.prepLeaf = this.prepLeaf;
		func.autoSelect = this.autoSelect;

		var leafClasses = data.isMetaPanelOpen ? 'metapanel-open' : 'metapanel-closed';

		return React.createElement(
			'div',
			{ id: 'prism-leaf', className: leafClasses },
			React.createElement(PrismLeafHeader, { auth: auth, data: data, func: func }),
			this.renderContentPanel(),
			this.renderMetaPanel()
		);
	}

});

"use strict";

var PrismLeafHeader = React.createClass({
	displayName: "PrismLeafHeader",

	render: function render() {

		var auth = this.props.auth;
		var data = this.props.data;
		var func = this.props.func;

		return React.createElement(
			"header",
			{ id: "prism-leaf-header" },
			React.createElement(PrismLeafTitle, { auth: auth, data: data.title.rendered, func: func }),
			React.createElement(
				"div",
				{ id: "prism-leaf-meta-controls" },
				React.createElement(PrismLeafMetaControlIcon, { type: "lock", data: data, func: func }),
				React.createElement(PrismLeafMetaControlIcon, { type: "toggle", data: data, func: func }),
				React.createElement(
					"h3",
					null,
					"Post Meta"
				)
			)
		);
	}
});

var PrismLeafTitle = React.createClass({
	displayName: "PrismLeafTitle",

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

		var editTitle = React.createElement("input", { autoFocus: true, "data-key": "title", type: "text", value: data, onBlur: this.toggleEdit, onFocus: func.autoSelect, onChange: func.changeValue });
		var staticTitle = React.createElement(
			"div",
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
			"h2",
			null,
			this.renderTitle()
		);
	}

});

var PrismLeafMetaControlIcon = React.createClass({
	displayName: "PrismLeafMetaControlIcon",

	render: function render() {

		var auth = this.props.auth;
		var data = this.props.data;
		var func = this.props.func;

		var lockIcon = data.lockMetaPanel == 'lock' ? 'lock' : 'unlock-alt';

		var lockClasses = "fa fa-lg fa-border fa-pull-right fa-" + lockIcon;
		var toggleClasses = "fa fa-3x fa-pull-left metapanel-control";

		toggleClasses += data.isMetaPanelOpen ? ' fa-toggle-right' : ' fa-toggle-left';

		var classes = this.props.type == 'lock' ? lockClasses : toggleClasses;
		var handleClick = this.props.type == 'lock' ? func.lockMetaPanel : func.toggleMetaPanel;

		return React.createElement("i", { className: classes, onClick: handleClick });
	}

});

'use strict';

var PrismLeafMetaPanel = React.createClass({
	displayName: 'PrismLeafMetaPanel',

	render: function render() {

		var auth = this.props.auth;
		var data = this.props.data;
		var func = this.props.func;

		var metaInfoToDisplay = data.type in PRISM.meta ? data.type : 'default';

		var renderMetaPanel = PRISM.meta[metaInfoToDisplay].map(function (key, i) {

			return React.createElement(PrismLeafMetaPanelPiece, { auth: auth, data: data[key], func: func, key: i, label: key });
		}, this);

		return React.createElement(
			'ul',
			{ id: 'prism-leaf-meta-panel' },
			renderMetaPanel
		);
	}

});

var PrismLeafMetaPanelPiece = React.createClass({
	displayName: 'PrismLeafMetaPanelPiece',

	getInitialState: function getInitialState() {
		return { edit: false };
	},

	toggleEdit: function toggleEdit(e) {

		var key = e.target.dataset.key;
		var auth = this.props.auth;
		var data = this.props.data;
		var value = e.target.value;

		// If not authenticated, don't all to edit
		if (!auth) return;

		// Don't allow editing of the primary ID
		if (key == 'id') return;

		this.setState({ edit: this.state.edit ? false : true });

		// It is toggling from static to edit
		if (value == undefined) return;

		this.props.func.prepLeaf(e);
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

'use strict';

window.onkeyup = function (e) {

	var key = {
		code: e.keyCode ? e.keyCode : e.which,
		time: new Date()
	};

	var doubleKeyTime = key.time - PRISM.lastKey.time < PRISM.doubleKey.time;
	var doubleKeyCode = key.code == PRISM.doubleKey.code;

	if (doubleKeyTime && doubleKeyCode) document.getElementById('prism-bar').focus();

	switch (key.code) {

		case 32:
			// Spacebar
			break;

		default:
			break;
	}

	PRISM.lastKey = key;
};

/** 
 * Structure
 *
 * - #prism
 *   - #prism-header
 *   - #prism-body
 *     - #prism-trunk
 *       - #prism-search
 *       - .prism-branch
 *     - #prism-branch
 *       - #prism-branch-header
 *       - #prism-leaves
 *         - #prism-add-leaf
 *         - .prism-leaf
 *     - #prism-leaf
 *       - #prism-leaf-header
 *   - #prism-footer
 */

'use strict';

var Prism = React.createClass({
	displayName: 'Prism',

	getInitialState: function getInitialState() {

		var state = {
			rainbowBar: false
		};

		return state;
	},

	componentDidMount: function componentDidMount() {
		this.getUser();
	},

	getUser: function getUser() {

		jQuery.ajax({
			method: 'GET',
			url: PRISM.url.rest + 'users/me',
			beforeSend: function beforeSend(xhr) {
				xhr.setRequestHeader('X-WP-Nonce', PRISM.nonce);
			},
			success: (function (response) {

				var state = this.state;

				state.auth = true;
				state.user = response;

				this.setState(state);
			}).bind(this),
			error: (function (response) {

				var state = this.state;

				state.auth = false;
				state.user = response;

				this.setState(state);
			}).bind(this)
		});
	},

	toggleRainbowBar: function toggleRainbowBar() {
		var state = this.state;

		state.rainbowBar = state.rainbowBar ? false : true;

		this.setState(state);
	},

	render: function render() {

		var auth = this.state.auth;
		var data = this.state;
		var func = {};

		func.toggleRainbowBar = this.toggleRainbowBar;

		var classes = data.rainbowBar ? 'rainbow' : '';

		return React.createElement(
			'div',
			{ id: 'prism', className: classes },
			React.createElement(PrismHeader, { auth: auth, data: data, func: func }),
			React.createElement(PrismTree, { data: data }),
			React.createElement(PrismFooter, null)
		);
	}

});

ReactDOM.render(React.createElement(Prism, null), document.body);
