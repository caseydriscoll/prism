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

	getInitialState: function() {

		this.getUser();

		return {};

	},

	componentDidMount: function() {
		// this.getUser();
	},

	getUser: function() {

		jQuery.ajax( {
			method  : 'GET',
			url     : PRISM.url.rest + 'users/me',
			beforeSend: function ( xhr ) {
				xhr.setRequestHeader( 'X-WP-Nonce', PRISM.nonce );
			},
			success : function( response ) {

				var state = {
					'authenticated' : true,
					'user'          : response
				}

				this.setState( state );

			}.bind( this ),
			error   : function( response ) {

				var state = {
					'authenticated' : false,
					'user'          : response
				}

				this.setState( state );

			}.bind( this )
		} );

	},

	render: function() {
		return (
			<div id="prism">
				<PrismHeader data={this.state} />
				<PrismTree   data={this.state} />
				<PrismFooter />
			</div>
		);
	}

} );

ReactDOM.render(
	<Prism />, document.body
);