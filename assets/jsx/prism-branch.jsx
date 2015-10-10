var PrismBranch = React.createClass( {

	getInitialState: function() {
		return { branches: { '': { leaves: [] } } };
	},

	addLeaf: function() {
		var state = this.state;
		var active = this.props.active.branch;

		state.branches[active].leaves.unshift( { 'id' : 'new' } );

		this.setState( state );
	},

	loadLeaves: function() {
		if ( this.props.active.branch == '' ) return;

		if ( this.props.active.branch in this.state.branches ) return;

		jQuery.ajax( {
			method  : 'GET',
			url     : PRISM.url + this.props.active.branch,
			success : function( response ) {

				var state = this.state;

				state.branches[this.props.active.branch] = { leaves: response };

				this.setState( state );

			}.bind( this )
		} );

	},

	render: function() {

		this.loadLeaves();

		var prismAddLeaf = this.props.active.branch != '' ? <PrismAddLeaf addLeaf={this.addLeaf} /> : '';

		var prismLeafNodes = this.state.branches[this.props.active.branch].leaves.map( function( leaf, i ) {
			return <PrismLeafNode data={leaf} key={i} onClick={this.props.changeLeaf} />;
		}, this );

		return (
			<div id="prism-branch">
				<PrismBranchHeader title={this.props.active.branch} />
				<ul id="prism-leaves">
					{prismAddLeaf}
					{prismLeafNodes}
				</ul>
			</div>
		);
	}

} );

var PrismBranchHeader = React.createClass( {

	render: function() {
		return (
			<header id="prism-branch-header">
				<h2>{this.props.title}</h2>
			</header>
		);
	}

} );


var PrismAddLeaf = React.createClass( {

	render: function() {

		var data = { 'id' : '' };

		return <PrismLeafNode data={data} id="prism-add-leaf" onClick={this.props.addLeaf} key={0} />;
	}

} );


var PrismLeafNode = React.createClass( {

	render: function() {

		var title = '';

		if ( this.props.data.id == 'new' )
			title = 'New';
		else if ( this.props.data.id == '' )
			title = '';
		else
			title = this.props.data.title.rendered;

		return (
			<li id={this.props.id} className="prism-leaf" key={this.props.key} onClick={this.props.onClick}>
				<span data-title={title}>{title}</span>
			</li>
		)
	}

} );