var PrismLeaf = React.createClass( {

	metapanel: function() {

		if ( this.props.data.metapanel == 'open' )
			return <PrismLeafMetaPanel data={this.props.data} />;
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

		var metaInfoToDisplay = this.props.data.type in PRISM.meta ? this.props.data.type : 'default';

		var renderMetaPanel = PRISM.meta[metaInfoToDisplay].map( function( key, i ) {
			return (
				<li>
					<h4>{key + ':'}</h4>
					<span><code>{this.props.data[key]}</code></span>
				</li>
			)
		}, this );

		return (
			<ul id="prism-leaf-meta-panel">
				{renderMetaPanel}
			</ul>
		)

	}

} );