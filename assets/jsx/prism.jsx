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

var Prism = React.createClass( {

	render: function() {
		return (
			<div id="prism">
			</div>
		);
	}

} );

ReactDOM.render(
	<Prism />, document.body
);