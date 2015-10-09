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
    return React.createElement("div", { id: "prism" });
  }

});

ReactDOM.render(React.createElement(Prism, null), document.body);
