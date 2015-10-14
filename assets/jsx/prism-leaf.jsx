var PrismLeaf = React.createClass( {

	getInitialState : function() {
		return { edit : false }
	},

	startEdit: function(e) {

		var state = this.state;

		state.edit = true;

		this.setState( state );

	},

	stopEdit: function() {

		var state = this.state;

		state.edit = false;

		this.setState( state );

	},

	autoSelect: function(e) {
		e.nativeEvent.target.select();
	},

	metapanel: function() {

		if ( this.props.data.isMetaPanelOpen )
			return <PrismLeafMetaPanel data={this.props.data} />;
		else
			return null;

	},

	renderContent: function() {

		var content = this.props.data.content.rendered;
		
		var editContent    = <textarea autoFocus readOnly id="prism-leaf-content" value={content} onBlur={this.stopEdit} onFocus={this.autoSelect} />;
		var staticContent  = <div id="prism-leaf-content" onDoubleClick={this.startEdit}>{content}</div>;

		var renderContent  = this.state.edit == true ? editContent : staticContent;

		return renderContent;

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
				{this.renderContent()}
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
				<PrismLeafMetaPanelPiece data={this.props.data[key]} key={i} label={key} />
			)
		}, this );

		return (
			<ul id="prism-leaf-meta-panel">
				{renderMetaPanel}
			</ul>
		)

	}

} );


var PrismLeafMetaPanelPiece = React.createClass( {

	getInitialState : function() {
		return { edit : false }
	},

	startEdit: function(e) {

		var state = this.state;

		state.edit = true;

		this.setState( state );

	},

	stopEdit: function() {

		var state = this.state;

		state.edit = false;

		this.setState( state );

	},

	autoSelect: function(e) {
		e.nativeEvent.target.select();
	},

	render: function() {

		var editData    = <input autoFocus readOnly type="text" value={this.props.data} onBlur={this.stopEdit} onFocus={this.autoSelect} />;
		var staticData  = <code>{this.props.data}</code>;

		var renderData  = this.state.edit == true ? editData : staticData;

		return (
			<li key={this.props.label}>
				<h4>{this.props.label + ':'}</h4>
				<span onClick={this.startEdit}>
					{renderData}
				</span>
			</li>
		)
	}

} );

