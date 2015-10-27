var PrismHeader = React.createClass( {

	render: function() {

		var auth = this.props.auth;
		var data = this.props.data;
		var func = this.props.func;

		return (
			<header id="prism-header">
				<a id="prism-home" href={PRISM.url.root + '/#/'}><i className="fa fa-home fa-2x"></i></a>
				<PrismStatus data={data} func={func} />
				<PrismUserAccount data={data} auth={auth} func={func} />
			</header>
		);
	}

} );


var PrismUserAccount = React.createClass( {

	render: function() {

		var auth = this.props.auth;
		var data = this.props.data;
		var func = this.props.func;

		var url, icon = null;

		if ( auth ) {
			url  = PRISM.url.login + '?redirect_to=' + PRISM.url.root + '&action=logout';
			icon = <img src={this.props.data.user.avatar_urls[PRISM.gravatar.width]} width={PRISM.gravatar.width} height={PRISM.gravatar.height} />;
		} else {
			url  = PRISM.url.login + '?redirect_to=' + PRISM.url.root;
			icon = <i className="fa fa-user fa-2x"></i>;
		}

		return (

			<a id="prism-user-account" onClick={func.toggleUserBar}>
				{icon}
			</a>

		)
	}

} );