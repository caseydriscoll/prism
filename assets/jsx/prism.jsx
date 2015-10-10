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

var Prism = React.createClass( {

	render: function() {
		return (
			<div id="prism">
				<PrismHeader />
				<PrismTree />
				<PrismFooter />
			</div>
		);
	}

} );

ReactDOM.render(
	<Prism />, document.body
);