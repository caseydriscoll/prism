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
		return React.createElement("div", { id: "prism-trunk" });
	}

});

"use strict";

var PrismBranch = React.createClass({
	displayName: "PrismBranch",

	render: function render() {
		return React.createElement("div", { id: "prism-branch" });
	}

});

"use strict";

var PrismLeaf = React.createClass({
	displayName: "PrismLeaf",

	render: function render() {
		return React.createElement("div", { id: "prism-leaf" });
	}

});

/** 
 * Structure
 *
 * - #prism
 *   - #prism-header
 *   - #prism-body
 *     - #prism-trunk
 *       - .prism-branch
 *     - #prism-branch
 *       - .prism-leaf
 *     - #prism-leaf
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

ReactDOM.render(React.createElement(Prism, null), document.body);
