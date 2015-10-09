<?php

/**
 * Plugin Name: Prism
 * Description: A developer friendly, React and Backbone based theme for fast API centric WordPress application development.
 * Author: PatchWorks
 * Author URI: https:/patch.works
 */


class Prism {

	public static function init() {

		self::load_assets();

	}


	private static function load_assets() {

		wp_register_script( 'react', 'https://fb.me/react-with-addons-0.14.0.js', '', '0.14.0', 1 );
		wp_register_script( 'prism', plugin_dir_url( __FILE__ ) . 'assets/js/prism.js', array( 'react', 'jquery' ), '', 1 );

		wp_enqueue_script( 'prism' );

	}


}


Prism::init();