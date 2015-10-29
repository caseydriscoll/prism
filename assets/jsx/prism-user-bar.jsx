var PrismUserBar = React.createClass( {

	componentDidUpdate: function() {
		window.scrollBy( 500, 0 );
	},

	render: function() {
		return(
			<div id="prism-user-bar">
				<a href={PRISM.url.login + '?redirect_to=' + PRISM.url.root}>Login</a>
			</div> 
		)
	}
} )