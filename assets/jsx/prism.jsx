/** 
 * Structure
 *
 * - #prism
 *   - #prism-header
 *     - #prism-title
 *     - #prism-rainbow-bar
 *     - #prism-user-account
 *   - #prism-body
 *     - #prism-trunk
 *       - #prism-search
 *       - .prism-branch
 *     - #prism-branch
 *       - #prism-branch-header
 *         - #prism-add-leaf
 *       - #prism-leaves
 *         - .prism-leaf
 *     - #prism-leaf
 *       - #prism-leaf-header
 *   - #prism-footer
 */

var Prism = React.createClass( {

	getInitialState: function() {

		var state = {
			rainbowBar : false
		};

		return state;

	},

	componentDidMount: function() {
		this.getUser();
	},

	getUser: function() {

		jQuery.ajax( {
			method  : 'GET',
			url     : PRISM.url.rest + 'users/me',
			beforeSend: function ( xhr ) {
				xhr.setRequestHeader( 'X-WP-Nonce', PRISM.nonce );
			},
			success : function( response ) {

				var state = this.state;

				state.auth = true;
				state.user = response;

				this.setState( state );

			}.bind( this ),
			error   : function( response ) {

				var state = this.state;

				state.auth = false;
				state.user = response;

				this.setState( state );

			}.bind( this )
		} );

	},

	toggleRainbowBar: function() {
		var state = this.state;

		state.rainbowBar = state.rainbowBar ? false : true;

		this.setState( state );
	},

	executeRainbow: function(value) {

		if ( value in RainbowBarHandler )
			RainbowBarHandler[value]();

	},

	render: function() {

		var auth = this.state.auth;
		var data = this.state;
		var func = {};

		func.toggleRainbowBar = this.toggleRainbowBar;
		func.executeRainbow   = this.executeRainbow;

		var classes = data.rainbowBar ? 'rainbow' : '';

		return (
			<div id="prism" className={classes}>
				<PrismHeader auth={auth} data={data} func={func} />
				<PrismTree   auth={auth} data={data} />
				<PrismFooter />
			</div>
		);
	}

} );

ReactDOM.render(
	<Prism />, document.body
);