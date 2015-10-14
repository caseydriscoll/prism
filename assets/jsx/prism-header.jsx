var PrismHeader = React.createClass( {

	render: function() {
		return (
			<header id="prism-header">
				<h1 className="title">{PRISM.title}</h1>
				<PrismUserAccount data={this.props.data} />
				<span className="description">{PRISM.description}</span>
			</header>
		);
	}

} );


var PrismUserAccount = React.createClass( {

	render: function() {

		var url, icon = null;

		if ( this.props.data.authenticated ) {
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