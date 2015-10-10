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

	changeActiveBranch: function(e) {
		e.preventDefault();

		jQuery( '#prism-menu a' ).removeClass( 'active' );

		e.nativeEvent.target.classList.toggle( 'active' );

		this.setState( { 'active' : jQuery( e.nativeEvent.target ).data( 'slug' ) } );
	},

	getInitialState: function() {
		return { active : '' }
	},

	render: function() {
		return (
			<div id="prism">
				<PrismHeader />
				<PrismBody changeActiveBranch={this.changeActiveBranch} active={this.state.active} />
				<PrismFooter />
			</div>
		);
	}

} );

ReactDOM.render(
	<Prism />, document.body
);