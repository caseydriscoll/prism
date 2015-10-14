"use strict";

var PrismHeader = React.createClass({
	displayName: "PrismHeader",

	render: function render() {
		return React.createElement(
			"header",
			{ id: "prism-header" },
			React.createElement(
				"h1",
				{ className: "title" },
				PRISM.title
			),
			React.createElement(PrismUserAccount, { data: this.props.data }),
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

		var url,
		    icon = null;

		if (this.props.data.authenticated) {
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
			isMetaPanelOpen: false
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
		var state = this.state;
		var active = this.state.active;

		state.branches[active.branch].leaves['new'] = {
			id: 'new',
			date: new Date().toISOString().slice(0, 19),
			content: {
				rendered: ''
			},
			title: {
				rendered: 'new'
			}
		};

		this.setState(state);
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

		var prismTrunkFunctions = {
			changeBranch: this.changeBranch
		};

		var prismBranchFunctions = {
			changeLeaf: this.changeLeaf,
			changeView: this.changeBranchView,
			addLeaf: this.addLeaf
		};

		var prismLeafFunctions = {
			lockMetaPanel: this.lockMetaPanel,
			toggleMetaPanel: this.toggleMetaPanel
		};

		var prismTrunk = React.createElement(PrismTrunk, { functions: prismTrunkFunctions, auth: auth });
		var prismBranch = React.createElement(PrismBranch, { functions: prismBranchFunctions, auth: auth, data: this.branchData() });
		var prismLeaf = React.createElement(PrismLeaf, { functions: prismLeafFunctions, auth: auth, data: this.leafData() });

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
		return React.createElement(
			"div",
			{ id: "prism-trunk" },
			React.createElement(PrismSearch, null),
			React.createElement(PrismMenu, { onClick: this.props.functions.changeBranch })
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

		var menuItems = PRISM.branches.map(function (branch, i) {
			return React.createElement(
				"li",
				{ key: i },
				React.createElement(
					"a",
					{ href: '#' + branch.slug, "data-slug": branch.slug, onClick: this.props.onClick },
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

		var prismLeafNodes = Object.keys(this.props.data.leaves).reverse().map(function (key) {

			var leaf = this.props.data.leaves[key];

			if (leaf.id == this.props.data.leaf) leaf.active = 'active';else leaf.active = '';

			return React.createElement(PrismLeafNode, { data: leaf, key: key, onClick: this.props.functions.changeLeaf });
		}, this);

		return React.createElement(
			'div',
			{ id: 'prism-branch', className: this.props.data.view },
			React.createElement(PrismBranchHeader, { auth: this.props.auth, data: this.props.data, changeView: this.props.functions.changeView, addLeaf: this.props.functions.addLeaf }),
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

		var classes = 'fa fa-border fa-pull-right fa-2x';

		var grid = this.props.data.view == 'grid' ? ' fa-th active' : ' fa-th';
		var list = this.props.data.view == 'list' ? ' fa-list active' : ' fa-list';

		var renderAddLeaf = this.props.auth ? React.createElement('i', { id: 'prism-add-leaf', className: classes + ' fa-plus', onClick: this.props.addLeaf }) : null;

		return React.createElement(
			'header',
			{ id: 'prism-branch-header' },
			React.createElement(
				'h2',
				null,
				this.props.data.title
			),
			React.createElement(
				'div',
				{ id: 'prism-branch-visual-controls' },
				React.createElement('i', { id: 'prism-branch-rows', 'data-view': 'list', className: classes + list, onClick: this.props.changeView }),
				React.createElement('i', { id: 'prism-branch-grid', 'data-view': 'grid', className: classes + grid, onClick: this.props.changeView }),
				renderAddLeaf
			)
		);
	}

});

var PrismLeafNode = React.createClass({
	displayName: 'PrismLeafNode',

	render: function render() {

		var title = this.props.data.title.rendered;

		var classes = 'prism-leaf ' + this.props.data.active;

		return React.createElement(
			'li',
			{ id: this.props.data.id, className: classes, key: this.props.key, onClick: this.props.onClick },
			React.createElement(
				'span',
				{ 'data-title': title, 'data-id': this.props.data.id },
				title
			)
		);
	}

});

"use strict";

var PrismLeaf = React.createClass({
	displayName: "PrismLeaf",

	getInitialState: function getInitialState() {
		return { edit: false };
	},

	startEdit: function startEdit(e) {

		if (!this.props.auth) return;

		var state = this.state;

		state.edit = true;

		this.setState(state);
	},

	stopEdit: function stopEdit() {

		if (!this.props.auth) return;

		var state = this.state;

		state.edit = false;

		this.setState(state);
	},

	autoSelect: function autoSelect(e) {
		e.nativeEvent.target.select();
	},

	metapanel: function metapanel() {

		if (this.props.data.isMetaPanelOpen) return React.createElement(PrismLeafMetaPanel, { data: this.props.data });else return null;
	},

	renderContent: function renderContent() {

		var content = this.props.data.content.rendered;

		var editContent = React.createElement("textarea", { autoFocus: true, readOnly: true, id: "prism-leaf-content", value: content, onBlur: this.stopEdit, onFocus: this.autoSelect });
		var staticContent = React.createElement(
			"div",
			{ id: "prism-leaf-content", onDoubleClick: this.startEdit },
			content
		);

		var renderContent = this.state.edit == true ? editContent : staticContent;

		return renderContent;
	},

	render: function render() {

		var leafClasses = this.props.data.isMetaPanelOpen ? 'metapanel-open' : 'metapanel-closed';
		var metapanelHeading = this.props.data.isMetaPanelOpen ? 'Post Meta' : null;

		var panelLockClasses = "fa fa-lg fa-border fa-pull-right fa-" + this.props.data.lockMetaPanel;
		var panelToggleClasses = "fa fa-3x fa-pull-left metapanel-control";

		if (this.props.data.isMetaPanelOpen) {
			panelToggleClasses += ' fa-toggle-right';
		} else {
			panelToggleClasses += ' fa-toggle-left';
		}

		return React.createElement(
			"div",
			{ id: "prism-leaf", className: leafClasses },
			React.createElement(
				"header",
				{ id: "prism-leaf-header" },
				React.createElement(
					"h2",
					null,
					this.props.data.title.rendered
				),
				React.createElement(
					"div",
					{ id: "prism-leaf-meta-controls" },
					React.createElement("i", { className: panelToggleClasses, onClick: this.props.functions.toggleMetaPanel }),
					React.createElement(
						"h3",
						null,
						metapanelHeading
					),
					React.createElement("i", { className: panelLockClasses, onClick: this.props.functions.lockMetaPanel })
				)
			),
			this.renderContent(),
			this.metapanel()
		);
	}

});

var PrismLeafMetaPanel = React.createClass({
	displayName: "PrismLeafMetaPanel",

	render: function render() {

		var metaInfoToDisplay = this.props.data.type in PRISM.meta ? this.props.data.type : 'default';

		var renderMetaPanel = PRISM.meta[metaInfoToDisplay].map(function (key, i) {
			return React.createElement(PrismLeafMetaPanelPiece, { data: this.props.data[key], key: i, label: key });
		}, this);

		return React.createElement(
			"ul",
			{ id: "prism-leaf-meta-panel" },
			renderMetaPanel
		);
	}

});

var PrismLeafMetaPanelPiece = React.createClass({
	displayName: "PrismLeafMetaPanelPiece",

	getInitialState: function getInitialState() {
		return { edit: false };
	},

	startEdit: function startEdit(e) {

		if (!this.props.auth) return;

		var state = this.state;

		state.edit = true;

		this.setState(state);
	},

	stopEdit: function stopEdit() {

		if (!this.props.auth) return;

		var state = this.state;

		state.edit = false;

		this.setState(state);
	},

	autoSelect: function autoSelect(e) {
		e.nativeEvent.target.select();
	},

	render: function render() {

		var editData = React.createElement("input", { autoFocus: true, readOnly: true, type: "text", value: this.props.data, onBlur: this.stopEdit, onFocus: this.autoSelect });
		var staticData = React.createElement(
			"code",
			null,
			this.props.data
		);

		var renderData = this.state.edit == true ? editData : staticData;

		return React.createElement(
			"li",
			{ key: this.props.label },
			React.createElement(
				"h4",
				null,
				this.props.label + ':'
			),
			React.createElement(
				"span",
				{ onClick: this.startEdit },
				renderData
			)
		);
	}

});

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

		this.getUser();

		return {};
	},

	componentDidMount: function componentDidMount() {
		// this.getUser();
	},

	getUser: function getUser() {

		jQuery.ajax({
			method: 'GET',
			url: PRISM.url.rest + 'users/me',
			beforeSend: function beforeSend(xhr) {
				xhr.setRequestHeader('X-WP-Nonce', PRISM.nonce);
			},
			success: (function (response) {

				var state = {
					'authenticated': true,
					'user': response
				};

				this.setState(state);
			}).bind(this),
			error: (function (response) {

				var state = {
					'authenticated': false,
					'user': response
				};

				this.setState(state);
			}).bind(this)
		});
	},

	render: function render() {
		return React.createElement(
			'div',
			{ id: 'prism' },
			React.createElement(PrismHeader, { data: this.state }),
			React.createElement(PrismTree, { data: this.state }),
			React.createElement(PrismFooter, null)
		);
	}

});

ReactDOM.render(React.createElement(Prism, null), document.body);
