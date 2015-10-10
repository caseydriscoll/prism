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

		add_action( 'init', 'Prism::sample_types' );

	}

	public static function sample_types() {

		$args = array(
			'public' => true,
			'label'  => 'Events',
			'show_in_rest' => true
		);

		register_post_type( 'events', $args );

		$args = array(
			'public' => true,
			'label'  => 'Books',
			'show_in_rest' => true
		);

		register_post_type( 'books', $args );

		$args = array(
			'public' => true,
			'label'  => 'Tasks',
			'show_in_rest' => true
		);

		register_post_type( 'tasks', $args );

	}


	public static function load_assets() {

		add_action( 'wp_print_styles', 'Prism::clean_slate' );

		wp_register_script( 'react', 'https://fb.me/react-with-addons-0.14.0.js', '', '0.14.0', 1 );
		wp_register_script( 'react-dom', 'https://fb.me/react-dom-0.14.0.js', '', '0.14.0', 1 );

		wp_register_script( 'bootstrap', 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js', '', '3.3.5', 1 );

		wp_register_script( 'prism', plugin_dir_url( __FILE__ ) . 'assets/js/prism.js', array( 'react', 'react-dom', 'bootstrap', 'jquery' ), '', 1 );

		wp_localize_script( 'prism', 'PRISM', self::localize() );

		wp_enqueue_script( 'prism' );


		wp_register_style( 'bootstrap', 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css', '', '3.3.5' );

		wp_register_style( 'prism', plugin_dir_url( __FILE__ ) . 'assets/css/prism.css', array( 'bootstrap' ) );

		wp_enqueue_style( 'prism' );

	}


	public static function clean_slate() {

		global $wp_styles;
		foreach( $wp_styles->queue as $handle ) :
			if ( $handle == 'admin-bar' || $handle == 'prism' ) continue;

			wp_dequeue_style( $handle );
		endforeach;

		global $wp_scripts;
		foreach( $wp_scripts->queue as $handle ) :
			if ( $handle == 'admin-bar' || $handle == 'prism' ) continue;

			wp_dequeue_script( $handle );
		endforeach;
	}


	public static function localize() {

		$branches = array(
			array( 'title' => 'Posts',  'slug' => 'posts' ),
			array( 'title' => 'Tasks',  'slug' => 'tasks' ),
			array( 'title' => 'Books',  'slug' => 'books' ),
			array( 'title' => 'Events', 'slug' => 'events' )
		);

		$data = array(
			'url'      => get_bloginfo( 'url' ) . '/wp-json/wp/v2/',
			'branches' => $branches
		);

		return $data;

	}


}


Prism::init();