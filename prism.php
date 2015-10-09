<?php

/**
 * Plugin Name: Prism
 * Description: A developer friendly, React and Backbone based theme for fast API centric WordPress application development.
 * Author: PatchWorks
 * Author URI: https:/patch.works
 */


class Prism {

	public static function init() {

		add_action( 'wp_enqueue_scripts', 'Prism::load_assets' );

	}


	public static function load_assets() {

		add_action( 'wp_print_styles', 'Prism::clean_slate' );

		wp_register_script( 'react', 'https://fb.me/react-with-addons-0.14.0.js', '', '0.14.0', 1 );
		wp_register_script( 'react-dom', 'https://fb.me/react-dom-0.14.0.js', '', '0.14.0', 1 );

		wp_register_script( 'prism', plugin_dir_url( __FILE__ ) . 'assets/js/prism.js', array( 'react', 'react-dom', 'jquery' ), '', 1 );

		wp_enqueue_script( 'prism' );

	}


	public static function clean_slate() {

		global $wp_styles;
		foreach( $wp_styles->queue as $handle ) :
			if ( $handle == 'admin-bar' ) continue;

			wp_dequeue_style( $handle );
		endforeach;

		global $wp_scripts;
		foreach( $wp_scripts->queue as $handle ) :
			if ( $handle == 'admin-bar' || $handle == 'prism' ) continue;

			wp_dequeue_script( $handle );
		endforeach;
	}


}


Prism::init();