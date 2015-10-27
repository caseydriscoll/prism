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
			ajax             : {
				status  : 'done',
				queue   : []
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

	checkQueue: function() {

		log( 11, 'beg Prism.checkQueue()' );

		var state = this.state;

		state.ajax.queue = state.ajax.queue.concat( PRISM.ajax.queue );
		PRISM.ajax.queue = [];

		if ( state.ajax.queue.length > 0 && state.ajax.status == 'done' )
			this.getData( state.ajax.queue[0] );

		this.setState;

		log( 12, 'end Prism.checkQueue()' );

	},

	getData: function( request ) {

		log( 11, 'beg Prism.getData()' );

		var state = this.state;

		state.ajax.status = 'getting';

		this.setState( state );

		this.changeStatus( request.status );

		log( request );

		jQuery.ajax( {
			method  : 'GET',
			url     : request.url,
			beforeSend: function ( xhr ) {
				xhr.setRequestHeader( 'X-WP-Nonce', PRISM.nonce );
			},
			success : this.dequeueAJAX,
			error   : this.dequeueAJAX
		} );

		log( 12, 'end Prism.getData()' );

	},

	queueAJAX: function( request ) {
		log( 11, 'beg Prism.queueAJAX()' );

		PRISM.ajax.queue.push( request );

		log( 12, 'end Prism.queueAJAX()' );
	},

	dequeueAJAX: function( response ) {
		log( 11, 'beg Prism.dequeueAJAX()' );

		var state   = this.state;

		var request = state.ajax.queue.shift();

		state.ajax.status = 'done';

		request.callback( request, response );

		// TODO: GREAT WORKAROUND OR UGLIEST WORKAROUND
		//       TIE AJAX QUEUE TO STATE, BUT DON'T DISRUPT STATE IF NOT DONE
		//       PUT IN TEMP QUEUE, THEN COMBINE AT END OF EVERY AJAX CALL
		//       SHOULD BE A CLEANER WAY, BUT THIS SEEMS TO BE WORKING
		state.ajax.queue = state.ajax.queue.concat( PRISM.ajax.queue );
		PRISM.ajax.queue = [];

		this.setState( state );

		log( 12, 'end Prism.dequeueAJAX()' );
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

		func.queueAJAX       = this.queueAJAX;
		func.checkQueue      = this.checkQueue;
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