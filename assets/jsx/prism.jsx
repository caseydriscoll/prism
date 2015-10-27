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

		log( 11, 'beg Prism.getInitialState()' );

		var state = {
			status     : {
				log     : [],
				current : {
					type    : 'normal',
					time    : new Date(),
					message : null
				}
			},
			statusBar  : false,
			userBar    : false
		};

		log( 12, 'end Prism.getInitialState()' );

		return state;

	},

	componentWillMount: function() {

		log( 11, 'beg Prism.componentWillMount()' );

		this.getUser();

		log( 12, 'end Prism.componentWillMount()' );

	},

	getUser: function() {

		log( 11, 'beg Prism.getUser()' );

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

		log( 12, 'end Prism.getUser()' );

	},

	toggleStatusBar: function() {

		log( 11, 'beg Prism.toggleStatusBar()' );

		var state = this.state;

		state.statusBar = state.statusBar ? false : true;

		this.setState( state );

		log( 12, 'end Prism.toggleStatusBar()' );

	},

	toggleUserBar: function() {

		log( 11, 'beg Prism.toggleUserBar()' );

		var state = this.state;

		state.userBar = state.userBar ? false : true;

		this.setState( state );

		log( 12, 'end Prism.toggleUserBar()' );

	},

	changeStatus: function( status ) {

		log( 11, 'beg Prism.changeStatus()' );

		var state = this.state;

		log( status );

		status.time = new Date();

		if ( status.type != 'normal' )
			state.status.log.push( status );

		state.status.current = status;

		this.setState( state );

		log( 12, 'end Prism.changeStatus()' );

	},

	render: function() {

		log( 11, 'beg Prism.render()' );

		var auth = this.state.auth;
		var data = this.state;
		var func = {};

		func.changeStatus    = this.changeStatus;
		func.toggleUserBar   = this.toggleUserBar;
		func.toggleStatusBar = this.toggleStatusBar;

		var classes = data.statusBar ? 'status-bar' : '';

		classes += data.userBar ? ' user-bar' : '';

		log( 12, 'end Prism.render()' );

		return (
			<div id="prism" className={classes}>
				<PrismStatusBar              data={data} />
				<PrismHeader     auth={auth} data={data} func={func} />
				<PrismTree       auth={auth} data={data} func={func} />
				<PrismFooter                             func={func} />
				<PrismUserBar                data={data} />
			</div>
		);
	}

} );

ReactDOM.render(
	<Prism />, document.body
);