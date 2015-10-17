/**
 * Utilities used in all parts of the application
 */


var PrismResizeBar = React.createClass( {

	render: function() {

		var data = this.props.data;
		var func = this.props.func;

		return(
			<div draggable="true" className="prism-resize-bar" onDoubleClick={func.resetWidth} onDrag={func.changeWidth}></div>
		)
	}

} );

var log = function( message ) {
	console.log( message );
}