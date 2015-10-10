"use strict";

var PrismHeader = React.createClass({
	displayName: "PrismHeader",

	render: function render() {
		return React.createElement("header", { id: "prism-header" });
	}

});

"use strict";

var PrismBody = React.createClass({
	displayName: "PrismBody",

	render: function render() {

		return React.createElement(
			"div",
			{ id: "prism-body" },
			React.createElement(PrismTrunk, { changeActiveBranch: this.props.changeActiveBranch }),
			React.createElement(PrismBranch, { active: this.props.active }),
			React.createElement(PrismLeaf, null)
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
			React.createElement(PrismMenu, { onClick: this.props.changeActiveBranch })
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

	getInitialState: function getInitialState() {
		return { branches: { '': { leaves: [] } } };
	},

	addLeaf: function addLeaf() {

		var state = this.state;

		state.branches[this.props.active].leaves.unshift({ 'id': 'new' });

		this.setState(state);
	},

	loadLeaves: function loadLeaves() {
		if (this.props.active == '') return;

		if (this.props.active in this.state.branches) return;

		jQuery.ajax({
			method: 'GET',
			url: PRISM.url + this.props.active,
			success: (function (response) {

				var state = this.state;

				state.branches[this.props.active] = { leaves: response };

				this.setState(state);
			}).bind(this)
		});
	},

	render: function render() {

		this.loadLeaves();

		var prismAddLeaf = this.props.active != '' ? React.createElement(PrismAddLeaf, { addLeaf: this.addLeaf }) : '';

		var prismLeafNodes = this.state.branches[this.props.active].leaves.map(function (leaf, i) {
			return React.createElement(PrismLeafNode, { data: leaf, key: i });
		});

		return React.createElement(
			'div',
			{ id: 'prism-branch' },
			React.createElement(PrismBranchHeader, { active: this.props.active }),
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
				this.props.active
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
		return React.createElement(
			'li',
			{ id: this.props.id, className: 'prism-leaf', key: this.props.key, onClick: this.props.onClick },
			React.createElement(
				'span',
				null,
				this.props.data.id
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
			React.createElement(PrismLeafHeader, null)
		);
	}

});

var PrismLeafHeader = React.createClass({
	displayName: "PrismLeafHeader",

	render: function render() {
		return React.createElement(
			"header",
			{ id: "prism-leaf-header" },
			React.createElement("h2", null)
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

	changeActiveBranch: function changeActiveBranch(e) {
		e.preventDefault();

		jQuery('#prism-menu a').removeClass('active');

		e.nativeEvent.target.classList.toggle('active');

		this.setState({ 'active': jQuery(e.nativeEvent.target).data('slug') });
	},

	getInitialState: function getInitialState() {
		return { active: '' };
	},

	render: function render() {
		return React.createElement(
			'div',
			{ id: 'prism' },
			React.createElement(PrismHeader, null),
			React.createElement(PrismBody, { changeActiveBranch: this.changeActiveBranch, active: this.state.active }),
			React.createElement(PrismFooter, null)
		);
	}

});

ReactDOM.render(React.createElement(Prism, null), document.body);
