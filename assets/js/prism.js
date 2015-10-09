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
			React.createElement(PrismTrunk, null),
			React.createElement(PrismBranch, null),
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
			React.createElement(PrismMenu, null)
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

		var menuItems = PRISM.menu.map(function (menuItem, i) {
			return React.createElement(
				"li",
				{ key: i },
				React.createElement(
					"a",
					{ href: menuItem.url },
					menuItem.title
				)
			);
		});

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
		return React.createElement(
			"div",
			{ id: "prism-branch" },
			React.createElement(PrismBranchHeader, null),
			React.createElement(PrismAddLeaf, null)
		);
	}

});

var PrismBranchHeader = React.createClass({
	displayName: "PrismBranchHeader",

	render: function render() {
		return React.createElement(
			"header",
			{ id: "prism-branch-header" },
			React.createElement(
				"h2",
				null,
				"Branch Type"
			)
		);
	}

});

var PrismAddLeaf = React.createClass({
	displayName: "PrismAddLeaf",

	render: function render() {
		return React.createElement(
			"div",
			{ id: "prism-add-leaf", className: "prism-leaf" },
			React.createElement("a", null)
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
			React.createElement(
				"h2",
				null,
				"Leaf Name"
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
 *       - #prism-add-leaf
 *       - .prism-leaf
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
      React.createElement(PrismBody, null),
      React.createElement(PrismFooter, null)
    );
  }

});

ReactDOM.render(React.createElement(Prism, { data: PRISM }), document.body);
