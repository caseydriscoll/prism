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
				}
			}
		},

		concat: {
			dist: {
				src: [
					'assets/js/prism.js'
				],
				dest: 'assets/js/prism.js'
			}
		},

		/* These are extra files that should be removed after concatenated into patchchat.js */
		clean: [
		],

		watch: {
			jsx : {
				files : ['assets/jsx/*.jsx'],
				tasks : ['babel', 'concat']
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