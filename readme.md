Prism is a developer focused, React & Backbone front end framework for fast, API centric WordPress application development

WordPress is a super flexible and powerful system for _storing and retrieving_ stuff.

Prism is super flexible and powerful interface for _viewing and manipulating_ that stuff.

Prism is an simple [tree structure](https://en.wikipedia.org/wiki/Tree_(data_structure)). It provides a scaffolding for moving up and down your application data.

Take a look at an example install at <http://prism.patch.party>
Take a look at [The Purpose of Prism](https://caseypatrickdriscoll.com/the-purpose-of-prism/) for more background information.

## Features

### Tree UI

A simple hierarchy by design. Root access to information on the left. Branches in the middle. Leaf and node information on the right. Clicking on an item moves you up and down the tree. Commonly found in many desktop applications.

![prism-skeleton](docs/prism-skeleton.png)

## Getting Started

### Installing and Activating Plugins and Dependencies

1) Clone the plugin into your WordPress `plugins` directory

> `git clone git@github.com:patchdotworks/prism.git`

2) Confirm the [Node Package Manager](https://nodejs.org/en/download/) is installed on your system.

> `npm -v`

3) Install all Node packages and dependencies found in `package.json`.

> `npm install`

4) Compile all sass and jsx source files to css and js

> `grunt`

5) Activate plugin, activating [Posts-to-Posts](https://wordpress.org/plugins/posts-to-posts/) dependency at the same time.

> `wp plugin install posts-to-posts --activate`

> `wp plugin activate prism`

### Installing Sample Data

Load sample data by activating any of the 'Data' plugins. When activated the plugin will load sample data into the database

> `wp plugin activate prism/prism-data-movies`

## Development

### Loading

Run ./tools/reset to init the database and init with sample data with `wp plugin activate prism/prism-data-movies`


