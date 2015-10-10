"use strict";

var PrismHeader = React.createClass({
	displayName: "PrismHeader",

	render: function render() {
		return React.createElement("header", { id: "prism-header" });
	}

});

'use strict';

var PrismTree = React.createClass({
	displayName: 'PrismTree',

	getInitialState: function getInitialState() {
		return { branches: { '': { leaves: [] } } };
	},

	addLeaf: function addLeaf() {
		var state = this.state;
		var active = this.props.active.branch;

		state.branches[active].leaves.unshift({ 'id': 'new' });

		this.setState(state);
	},

	loadLeaves: function loadLeaves() {
		if (this.props.active.branch == '') return;

		if (this.props.active.branch in this.state.branches) return;

		jQuery.ajax({
			method: 'GET',
			url: PRISM.url + this.props.active.branch + '?filter[posts_per_page]=-1',
			success: (function (response) {

				var state = this.state;

				state.branches[this.props.active.branch] = { leaves: response };

				this.setState(state);
			}).bind(this)
		});
	},

	render: function render() {

		return React.createElement(
			'div',
			{ id: 'prism-tree' },
			React.createElement(PrismTrunk, { changeBranch: this.props.changeBranch }),
			React.createElement(PrismBranch, {
				active: this.props.active,
				branches: this.state.branches,
				changeLeaf: this.props.changeLeaf,
				addLeaf: this.addLeaf,
				loadLeaves: this.loadLeaves }),
			React.createElement(PrismLeaf, { active: this.props.active.leaf })
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

'use strict';

var PrismBranch = React.createClass({
	displayName: 'PrismBranch',

	render: function render() {

		this.props.loadLeaves();

		var prismAddLeaf = this.props.active.branch != '' ? React.createElement(PrismAddLeaf, { addLeaf: this.props.addLeaf }) : '';

		var prismLeafNodes = this.props.branches[this.props.active.branch].leaves.map(function (leaf, i) {
			return React.createElement(PrismLeafNode, { data: leaf, key: i, onClick: this.props.changeLeaf });
		}, this);

		return React.createElement(
			'div',
			{ id: 'prism-branch' },
			React.createElement(PrismBranchHeader, { title: this.props.active.branch }),
			React.createElement(
				'ul',
				{ id: 'prism-leaves' },
				prismAddLeaf,
				prismLeafNodes
			)
		);
	}

});

var PrismBranchHeader = React.createClass({
	displayName: 'PrismBranchHeader',

	render: function render() {
		return React.createElement(
			'header',
			{ id: 'prism-branch-header' },
			React.createElement(
				'h2',
				null,
				this.props.title
			)
		);
	}

});

var PrismAddLeaf = React.createClass({
	displayName: 'PrismAddLeaf',

	render: function render() {

		var data = { 'id': '' };

		return React.createElement(PrismLeafNode, { data: data, id: 'prism-add-leaf', onClick: this.props.addLeaf, key: 0 });
	}

});

var PrismLeafNode = React.createClass({
	displayName: 'PrismLeafNode',

	render: function render() {

		var title = '';

		if (this.props.data.id == 'new') title = 'New';else if (this.props.data.id == '') title = '';else title = this.props.data.title.rendered;

		return React.createElement(
			'li',
			{ id: this.props.id, className: 'prism-leaf', key: this.props.key, onClick: this.props.onClick },
			React.createElement(
				'span',
				{ 'data-title': title },
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
			React.createElement(PrismLeafHeader, { title: this.props.active })
		);
	}

});

var PrismLeafHeader = React.createClass({
	displayName: "PrismLeafHeader",

	render: function render() {
		return React.createElement(
			"header",
			{ id: "prism-leaf-header" },
			React.createElement(
				"h2",
				null,
				this.props.title
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

	changeActiveLeaf: function changeActiveLeaf(e) {
		e.preventDefault();

		jQuery('.prism-leaf span').removeClass('active');

		e.nativeEvent.target.classList.toggle('active');

		var state = this.state;

		state.active.leaf = jQuery(e.nativeEvent.target).data('title');

		this.setState(state);
	},

	changeActiveBranch: function changeActiveBranch(e) {
		e.preventDefault();

		jQuery('#prism-menu a').removeClass('active');

		e.nativeEvent.target.classList.toggle('active');

		var state = this.state;

		state.active.branch = jQuery(e.nativeEvent.target).data('slug');

		this.setState(state);
	},

	getInitialState: function getInitialState() {
		return { active: { branch: '', leaf: '' } };
	},

	render: function render() {
		return React.createElement(
			'div',
			{ id: 'prism' },
			React.createElement(PrismHeader, null),
			React.createElement(PrismTree, {
				changeBranch: this.changeActiveBranch,
				changeLeaf: this.changeActiveLeaf,
				active: this.state.active }),
			React.createElement(PrismFooter, null)
		);
	}

});

ReactDOM.render(React.createElement(Prism, null), document.body);
