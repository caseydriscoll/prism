var PrismLeaf = React.createClass( {

	metapanel: function() {

		if ( this.props.data.metapanel == 'open' )
			return <PrismLeafMetaPanel />;
		else
			return null;


	},

	render: function() {

		var classes = "metapanel-" + this.props.data.metapanel;
		var controlClasses = "fa fa-3x fa-pull-left";

		if ( this.props.data.metapanel == 'open' ) {
			controlClasses += ' fa-toggle-right';
		} else {
			controlClasses += ' fa-toggle-left';
		}

		var metapanelHeading = this.props.data.metapanel == 'open' ? 'Post Meta' : null;

		return (
			<div id="prism-leaf" className={classes}>
				<header id="prism-leaf-header">
					<h2>
						{this.props.data.title.rendered}
					</h2>
					<div id="prism-leaf-meta-controls" onClick={this.props.changeMetaPanel}>
						<i className={controlClasses}></i>
						<h3>{metapanelHeading}</h3>
					</div>
				</header>
				<div id="prism-leaf-content">
					{this.props.data.content.rendered}
				</div>
				{this.metapanel()}
			</div>
		);
	}

} );


var PrismLeafMetaPanel = React.createClass( {

	render: function() {

		return (
			<div id="prism-leaf-meta-panel">
				metapanel
			</div>
		)

	}

} );
