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
			React.createElement(
				"span",
				{ className: "description" },
				PRISM.description
			)
		);
	}

});

'use strict';

var PrismTree = React.createClass({
	displayName: 'PrismTree',

	getInitialState: function getInitialState() {

		var state = {
			branches: {},
			active: { branch: null }
		};

		return state;
	},

	changeLeaf: function changeLeaf(e) {
		e.preventDefault();

		jQuery('.prism-leaf span').removeClass('active');

		e.nativeEvent.target.classList.toggle('active');

		var state = this.state;

		state.branches[state.active.branch].leaf = jQuery(e.nativeEvent.target).data('id');

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

	changeGrid: function changeGrid(e) {
		e.preventDefault();

		jQuery('#prism-branch-visual-controls i').removeClass('active');

		var state = this.state;

		state.branches[state.active.branch].view = jQuery(e.nativeEvent.target).data('view');

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

		if (this.state.active.branch in this.state.branches) return;

		jQuery.ajax({
			method: 'GET',
			url: PRISM.url + this.state.active.branch + '?filter[posts_per_page]=-1',
			success: (function (response) {

				var state = this.state;

				var leaves = {};

				for (var i = 0; i < response.length; i++) {
					var leaf = response[i];

					leaves[leaf.id] = leaf;
				}

				state.branches[this.state.active.branch] = { leaves: leaves, view: PRISM.view };

				this.setState(state);
			}).bind(this)
		});
	},

	branchData: function branchData() {

		var branchData = {};

		var branch = this.state.active.branch;

		if (this.state.branches[branch] !== undefined) {
			branchData = {
				title: branch,
				view: this.state.branches[branch].view
			};
		}

		return branchData;
	},

	leafData: function leafData() {

		var leafData = {};

		var branch = this.state.active.branch;

		if (this.state.branches[branch] !== undefined) leafData = this.state.branches[branch].leaves[this.state.branches[branch].leaf];

		return leafData;
	},

	render: function render() {

		var active = this.state.active;

		var leaves = this.state.branches[active.branch] == undefined ? [] : this.state.branches[active.branch].leaves;

		var prismBranch = React.createElement(PrismBranch, { data: this.branchData(), leaves: leaves, changeLeaf: this.changeLeaf, changeGrid: this.changeGrid, addLeaf: this.addLeaf });
		var prismLeaf = React.createElement(PrismLeaf, { data: this.leafData() });

		var renderBranch = active.branch == null ? null : prismBranch;
		var renderLeaf = active.leaf == null ? null : prismLeaf;

		return React.createElement(
			'div',
			{ id: 'prism-tree' },
			React.createElement(PrismTrunk, { changeBranch: this.changeBranch }),
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
			React.createElement(PrismMenu, { onClick: this.props.changeBranch })
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

"use strict";

var PrismBranch = React.createClass({
	displayName: "PrismBranch",

	render: function render() {

		var prismLeafNodes = Object.keys(this.props.leaves).reverse().map(function (key) {

			var leaf = this.props.leaves[key];

			return React.createElement(PrismLeafNode, { data: leaf, key: key, onClick: this.props.changeLeaf });
		}, this);

		return React.createElement(
			"div",
			{ id: "prism-branch", className: this.props.data.view },
			React.createElement(PrismBranchHeader, { data: this.props.data, changeGrid: this.props.changeGrid, addLeaf: this.props.addLeaf }),
			React.createElement(
				"ul",
				{ id: "prism-leaves" },
				prismLeafNodes
			)
		);
	}

});

var PrismBranchHeader = React.createClass({
	displayName: "PrismBranchHeader",

	render: function render() {

		var classes = 'fa fa-border fa-pull-right fa-2x';

		var grid = this.props.data.view == 'grid' ? ' fa-th active' : ' fa-th';
		var list = this.props.data.view == 'list' ? ' fa-list active' : ' fa-list';

		return React.createElement(
			"header",
			{ id: "prism-branch-header" },
			React.createElement(
				"h2",
				null,
				this.props.data.title
			),
			React.createElement(
				"div",
				{ id: "prism-branch-visual-controls" },
				React.createElement("i", { id: "prism-branch-rows", "data-view": "list", className: classes + list, onClick: this.props.changeGrid }),
				React.createElement("i", { id: "prism-branch-grid", "data-view": "grid", className: classes + grid, onClick: this.props.changeGrid }),
				React.createElement("i", { id: "prism-add-leaf", className: classes + ' fa-plus', onClick: this.props.addLeaf })
			)
		);
	}

});

var PrismLeafNode = React.createClass({
	displayName: "PrismLeafNode",

	render: function render() {

		var title = '';

		if (this.props.data.id == 'prism-add-leaf') title = '';else title = this.props.data.title.rendered;

		return React.createElement(
			"li",
			{ id: this.props.data.id, className: "prism-leaf", key: this.props.key, onClick: this.props.onClick },
			React.createElement(
				"span",
				{ "data-title": title, "data-id": this.props.data.id },
				title
			)
		);
	}

});

"use strict";

var PrismLeaf = React.createClass({
	displayName: "PrismLeaf",

	render: function render() {
		return React.createElement(
			"div",
			{ id: "prism-leaf" },
			React.createElement(
				"header",
				{ id: "prism-leaf-header" },
				React.createElement(
					"h2",
					null,
					this.props.data.title.rendered,
					React.createElement(
						"date",
						null,
						this.props.data.date.replace('T', ' ')
					)
				)
			),
			React.createElement(
				"div",
				{ id: "prism-leaf-content" },
				this.props.data.content.rendered
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

"use strict";

var Prism = React.createClass({
  displayName: "Prism",

  render: function render() {
    return React.createElement(
      "div",
      { id: "prism" },
      React.createElement(PrismHeader, null),
      React.createElement(PrismTree, null),
      React.createElement(PrismFooter, null)
    );
  }

});

ReactDOM.render(React.createElement(Prism, null), document.body);
