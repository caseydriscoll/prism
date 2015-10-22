var PrismUserBar = React.createClass( {

	componentDidUpdate: function() {
		window.scrollBy( 500, 0 );
	},

	render: function() {
		return(
			<div id="prism-user-bar"></div> 
		)
	}
} )