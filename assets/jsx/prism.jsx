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

		log( 1, 'beg Prism.getInitialState()' );

		var state = {
			rainbowBar : false
		};

		log( 2, 'end Prism.getInitialState()' );

		return state;

	},

	componentWillMount: function() {

		log( 1, 'beg Prism.componentWillMount()' );

		this.getUser();

		log( 2, 'end Prism.componentWillMount()' );

	},

	getUser: function() {

		log( 1, 'beg Prism.getUser()' );

		jQuery.ajax( {
			method  : 'GET',
			url     : PRISM.url.rest + 'users/me',
			beforeSend: function ( xhr ) {
				xhr.setRequestHeader( 'X-WP-Nonce', PRISM.nonce );
			},
			success : function( response ) {

				log( 10, 'success Prism.getUser()' );

				var state = this.state;

				state.auth = true;
				state.user = response;

				this.setState( state );

			}.bind( this ),
			error   : function( response ) {

				log( 10, 'error Prism.getUser()' );

				var state = this.state;

				state.auth = false;
				state.user = response;

				this.setState( state );

			}.bind( this )
		} );

		log( 2, 'end Prism.getUser()' );

	},

	toggleRainbow: function() {

		log( 1, 'beg Prism.toggleRainbow()' );

		var state = this.state;

		state.rainbowBar = state.rainbowBar ? false : true;

		this.setState( state );

		log( 2, 'end Prism.toggleRainbow()' );

	},

	render: function() {

		log( 1, 'beg Prism.render()' );

		var auth = this.state.auth;
		var data = this.state;
		var func = {};

		func.toggleRainbow    = this.toggleRainbow;
		func.executeRainbow   = this.executeRainbow;

		var classes = data.rainbowBar ? 'rainbow' : '';

		log( 2, 'end Prism.render()' );

		return (
			<div id="prism" className={classes}>
				<PrismRainbowBar />
				<PrismHeader auth={auth} data={data} func={func} />
				<PrismTree   auth={auth} data={data} func={func} />
				<PrismFooter func={func} />
			</div>
		);
	}

} );

ReactDOM.render(
	<Prism />, document.body
);