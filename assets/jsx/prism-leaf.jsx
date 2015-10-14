var PrismLeaf = React.createClass( {

	metapanel: function() {

		if ( this.props.data.isMetaPanelOpen )
			return <PrismLeafMetaPanel data={this.props.data} />;
		else
			return null;

	},

	render: function() {

		var leafClasses        = this.props.data.isMetaPanelOpen ? 'metapanel-open' : 'metapanel-closed';
		var metapanelHeading   = this.props.data.isMetaPanelOpen ? 'Post Meta' : null;

		var panelLockClasses   = "fa fa-lg fa-border fa-pull-right fa-" + this.props.data.lockMetaPanel;
		var panelToggleClasses = "fa fa-3x fa-pull-left metapanel-control";

		if ( this.props.data.isMetaPanelOpen ) {
			panelToggleClasses += ' fa-toggle-right';
		} else {
			panelToggleClasses += ' fa-toggle-left';
		}


		return (
			<div id="prism-leaf" className={leafClasses}>
				<header id="prism-leaf-header">
					<h2>
						{this.props.data.title.rendered}
					</h2>
					<div id="prism-leaf-meta-controls" >
						<i className={panelToggleClasses} onClick={this.props.functions.toggleMetaPanel}></i>
						<h3>{metapanelHeading}</h3>
						<i className={panelLockClasses} onClick={this.props.functions.lockMetaPanel}></i>
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
				<li key={i}>
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