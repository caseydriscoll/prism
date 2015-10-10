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

	changeActiveLeaf: function(e) {
		e.preventDefault();

		jQuery( '.prism-leaf span' ).removeClass( 'active' );

		e.nativeEvent.target.classList.toggle( 'active' );

		var state = this.state;

		state.active.leaf = jQuery( e.nativeEvent.target ).data( 'title' );

		this.setState( state );
	},

	changeActiveBranch: function(e) {
		e.preventDefault();

		jQuery( '#prism-menu a' ).removeClass( 'active' );

		e.nativeEvent.target.classList.toggle( 'active' );

		var state = this.state;

		state.active.branch = jQuery( e.nativeEvent.target ).data( 'slug' );

		this.setState( state );
	},

	getInitialState: function() {
		return { active : { branch : '', leaf : '' } }
	},

	render: function() {
		return (
			<div id="prism">
				<PrismHeader />
				<PrismTree 
					changeBranch={this.changeActiveBranch} 
					changeLeaf={this.changeActiveLeaf} 
					active={this.state.active} />
				<PrismFooter />
			</div>
		);
	}

} );

ReactDOM.render(
	<Prism />, document.body
);