Prism is a developer friendly, React & Backbone based theme for fast, API centric WordPress application development

Actually, it's a plugin to start. Actually actually, it will probably never be a theme.

WordPress is a super flexible way of holding all your stuff.

We need a super flexible way for viewing and manipulating all your stuff.

That's the name, Prism. It's a fast way of viewing the data in your application.

#Simple UI

Like millions of other users, I enjoy the simple and effective three tier UI commonly found in desktop applications.

![prism-skeleton](docs/prism-skeleton.png)

It's non-pretentious hierarchy by design. Root access to information on the left. Branches in the middle. Leaf and node information on the right.

Clicking on an item moves you up and down the tree.

Here is what it could look like with more stuffs.

![prism](docs/prism.png)


## Getting Started

1. Clone the plugin into your WordPress `plugins` directory
1. Make sure npm, grunt and grunt-cli are installed on your system.
1. Run `npm install` to install all dependencies.
1. Run `grunt` to initially compile assets
1. Activate plugin, activating Posts-to-Posts dependency at the same time.

## Installing Sample Data

Load sample data by activating any of the 'Data' plugins

## Loading

Run ./tools/reset to init the database and init with sample data with `wp plugin activate prism/prism-data-movies`

A model of the plugin with sample data can be found at <http://prism.patch.party>
