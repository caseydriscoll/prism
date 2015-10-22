module.exports = function( grunt ) {

	require("load-grunt-tasks")(grunt); // npm install --save-dev load-grunt-tasks

	'use strict';
	var banner = '/**\n * <%= pkg.homepage %>\n * Copyright (c) <%= grunt.template.today("yyyy") %>\n * This file is generated automatically. Do not edit.\n */\n';
	// Project configuration
	grunt.initConfig( {

		pkg:    grunt.file.readJSON( 'package.json' ),

		meta: {
			banner: banner
		},

		addtextdomain: {
			options: {
				textdomain: 'prism',
			},
			target: {
				files: {
					src: [ '*.php', '**/*.php', '!node_modules/**', '!php-tests/**', '!bin/**' ]
				}
			}
		},

		wp_readme_to_markdown: {
			your_target: {
				files: {
					'readme.md': 'readme.txt'
				}
			},
		},

		sass: {
			dist: {
				options: {
					sourcemap: 'none'
				},
				files: {
					'assets/css/prism.css' : 'assets/sass/prism.scss',
				}
			}
		},

		babel: {
			dist: {
				files: {
					'assets/js/prism.js' : 'assets/jsx/prism.jsx',

					'assets/js/prism-header.js'         : 'assets/jsx/prism-header.jsx',
					'assets/js/prism-tree.js'           : 'assets/jsx/prism-tree.jsx',
					'assets/js/prism-footer.js'         : 'assets/jsx/prism-footer.jsx',

					'assets/js/prism-trunk.js'          : 'assets/jsx/prism-trunk.jsx',
					'assets/js/prism-branch.js'         : 'assets/jsx/prism-branch.jsx',
					'assets/js/prism-leaf.js'           : 'assets/jsx/prism-leaf.jsx',
					'assets/js/prism-meta.js'           : 'assets/jsx/prism-meta.jsx',

					'assets/js/prism-utils.js'          : 'assets/jsx/prism-utils.jsx',
					'assets/js/prism-rainbow-bar.js'    : 'assets/jsx/prism-rainbow-bar.jsx',
					'assets/js/prism-user-bar.js'       : 'assets/jsx/prism-user-bar.jsx',

					'assets/js/keyboard.js'             : 'assets/jsx/keyboard.jsx'
				}
			}
		},

		concat: {
			dist: {
				src: [
					'assets/js/prism-header.js',
					'assets/js/prism-tree.js',
					'assets/js/prism-footer.js',

					'assets/js/prism-trunk.js',
					'assets/js/prism-branch.js',
					'assets/js/prism-leaf.js',
					'assets/js/prism-meta.js',

					'assets/js/prism-utils.js',
					'assets/js/prism-rainbow-bar.js',
					'assets/js/prism-user-bar.js',

					'assets/js/keyboard.js',

					'assets/js/prism.js'
				],
				dest: 'assets/js/prism.js'
			}
		},

		/* These are extra files that should be removed after concatenated into patchchat.js */
		clean: [
				'assets/js/prism-header.js',
				'assets/js/prism-tree.js',
				'assets/js/prism-footer.js',

				'assets/js/prism-trunk.js',
				'assets/js/prism-branch.js',
				'assets/js/prism-leaf.js',
				'assets/js/prism-meta.js',

				'assets/js/prism-utils.js',
				'assets/js/prism-rainbow-bar.js',
				'assets/js/prism-user-bar.js',

				'assets/js/keyboard.js'
		],

		watch: {
			jsx : {
				files : ['assets/jsx/*.jsx', 'assets/jsx/*/*.jsx',],
				tasks : ['babel', 'concat', 'clean']
			},
			sass: {
				files : ['assets/sass/*.scss'],
				tasks : ['sass']
			}
		},

		configFiles: {
			files: [ 'Gruntfile.js' ],
			options: {
				reload: true
			}
		},


		makepot: {
			target: {
				options: {
					domainPath: '/languages',
					mainFile: 'prism.php',
					potFilename: 'prism.pot',
					potHeaders: {
						poedit: true,
						'x-poedit-keywordslist': true
					},
					type: 'wp-plugin',
					updateTimestamp: true
				}
			}
		},

		notify_hooks: {
			options: {
				enabled: true,
				max_jshint_notifications: 5,
				success: true,
				duration: 5
			},
			watch: {
				options: {
					// TODO: Make this cute message appear
					// TODO: Make a sound appear too
					message: "And now his watch is ended."
				}
			}
		}
	} );


	grunt.loadNpmTasks( 'grunt-wp-i18n' );
	grunt.loadNpmTasks( 'grunt-wp-readme-to-markdown' );
	grunt.loadNpmTasks( 'grunt-contrib-concat' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	grunt.loadNpmTasks( 'grunt-contrib-clean' );
	grunt.loadNpmTasks( 'grunt-contrib-sass' );
	grunt.loadNpmTasks( 'grunt-notify' );

	grunt.registerTask( 'i18n', ['addtextdomain', 'makepot'] );
	grunt.registerTask( 'readme', ['wp_readme_to_markdown'] );

	grunt.registerTask( 'default', ['babel', 'concat'] );

	grunt.task.run( 'notify_hooks' );

	grunt.util.linefeed = '\n';

};