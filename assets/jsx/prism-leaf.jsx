var PrismLeaf = React.createClass( {

	getInitialState : function() {
		return { edit : false }
	},

	startEdit: function(e) {

		if ( ! this.props.auth ) return;

		var state = this.state;

		state.edit = true;

		this.setState( state );

	},

	stopEdit: function() {

		if ( ! this.props.auth ) return;

		var state = this.state;

		state.edit = false;

		this.setState( state );

	},

	autoSelect: function(e) {
		e.nativeEvent.target.select();
	},

	metapanel: function() {

		if ( this.props.data.isMetaPanelOpen )
			return <PrismLeafMetaPanel auth={this.props.auth} data={this.props.data} />;
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

		var lockIcon           = this.props.data.lockMetaPanel  == 'lock' ? 'lock' : 'unlock-alt';

		var panelLockClasses   = "fa fa-lg fa-border fa-pull-right fa-" + lockIcon;
		var panelToggleClasses = "fa fa-3x fa-pull-left metapanel-control";

		if ( this.props.data.isMetaPanelOpen ) {
			panelToggleClasses += ' fa-toggle-right';
		} else {
			panelToggleClasses += ' fa-toggle-left';
		}

		return (
			<div id="prism-leaf" className={leafClasses}>
				<header id="prism-leaf-header">
					<PrismLeafTitle auth={this.props.auth} title={this.props.data.title.rendered} />
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


var PrismLeafTitle = React.createClass( {

	getInitialState : function() {
		return { edit : false }
	},

	startEdit: function(e) {

		if ( ! this.props.auth ) return;

		var state = this.state;

		state.edit = true;

		this.setState( state );

	},

	stopEdit: function() {

		if ( ! this.props.auth ) return;

		var state = this.state;

		state.edit = false;

		this.setState( state );

	},

	autoSelect: function(e) {
		e.nativeEvent.target.select();
	},

	renderTitle: function() {
		var editTitle    = <input autoFocus readOnly type="text" value={this.props.title} onBlur={this.stopEdit} onFocus={this.autoSelect} />;
		var staticTitle  = <div onClick={this.startEdit}>{this.props.title}</div>;

		var renderTitle  = this.state.edit ? editTitle : staticTitle;

		return renderTitle;
	},

	render: function() {

		return (
			<h2>{this.renderTitle()}</h2>
		)
	}

} );


var PrismLeafMetaPanel = React.createClass( {

	render: function() {

		var metaInfoToDisplay = this.props.data.type in PRISM.meta ? this.props.data.type : 'default';

		var renderMetaPanel = PRISM.meta[metaInfoToDisplay].map( function( key, i ) {
			return (
				<PrismLeafMetaPanelPiece auth={this.props.auth} data={this.props.data[key]} key={i} label={key} />
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

		if ( ! this.props.auth ) return;

		var state = this.state;

		state.edit = true;

		this.setState( state );

	},

	stopEdit: function() {

		if ( ! this.props.auth ) return;

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

