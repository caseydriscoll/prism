var PrismHeader = React.createClass( {

	render: function() {

		var auth = this.props.auth;
		var data = this.props.data;
		var func = this.props.func;

		return (
			<header id="prism-header">
				<a href={PRISM.url.root}>
					<h1 id="prism-title" className="title">{PRISM.title}</h1>
				</a>
				<PrismRainbowBar  data={data} func={func} />
				<PrismUserAccount data={data} auth={auth} />
				<span className="description">{PRISM.description}</span>
			</header>
		);
	}

} );


var PrismRainbowBar = React.createClass( {

	executeRainbow: function(e) {

		var key   = e.keyCode ? e.keyCode : e.which;
		var func  = this.props.func;
		var value = e.target.value;

		if ( key == 13 ) {
			func.executeRainbow( value );
			e.target.value = '';
		}

	},

	render: function() {

		var data = this.props.data;
		var func = this.props.func;

		return (
			<input type="text" id="prism-rainbow-bar" onKeyUp={this.executeRainbow} onFocus={func.toggleRainbowBar} onBlur={func.toggleRainbowBar} />
		);
	}

} );


var PrismUserAccount = React.createClass( {

	render: function() {

		var auth = this.props.auth;
		var data = this.props.data;

		var url, icon = null;

		if ( auth ) {
			url  = PRISM.url.login + '?redirect_to=' + PRISM.url.root + '&action=logout';
			icon = <img src={this.props.data.user.avatar_urls[PRISM.gravatar.width]} width={PRISM.gravatar.width} height={PRISM.gravatar.height} />;
		} else {
			url  = PRISM.url.login + '?redirect_to=' + PRISM.url.root;
			icon = <i className="fa fa-user fa-2x fa-border"></i>;
		}

		return (

			<a id="prism-user-account" href={url}>
				{icon}
			</a>

		)
	}

} );