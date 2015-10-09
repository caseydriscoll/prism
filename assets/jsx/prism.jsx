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
 *       - .prism-leaf
 *     - #prism-leaf
 *       - #prism-leaf-header
 *   - #prism-footer
 */

var Prism = React.createClass( {

	render: function() {
		return (
			<div id="prism">
				<PrismHeader />
				<PrismBody />
				<PrismFooter />
			</div>
		);
	}

} );

ReactDOM.render(
	<Prism data={PRISM} />, document.body
);