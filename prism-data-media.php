<?php

/**
 * Plugin Name: Prism | Media Data
 * Description: Activate to load sample 'Media' data
 * Author: PatchWorks
 * Author URI: https:/patch.works
 */

class Prism_Media_Data {

	static function init() {
		register_activation_hook( __FILE__, array( __CLASS__, 'install' ) );

		add_filter( 'prism_branches', array( __CLASS__, 'add_branches' ), 100 );

	}

	public static function add_branches( $branches ) {
		$media_branch =  array(
			array(
				'title'       => 'Media',
				'slug'        => array(
				                   'plural' => 'media',
				                   'single' => 'media'
				                 ),
				'icon'        => 'fa-image',
				'connections' => array()
			),
		);

		return array_merge( $branches, $media_branch );
	}


	public static function install() {

		// MEDIA
		// http://lorempixel.com/500/500/
		// 
		// BOOM:
		// https://codex.wordpress.org/Function_Reference/media_sideload_image

		$url = 'http://lorempixel.com/500/500/';
		$tmp = plugin_dir_path( __FILE__ ) . 'images/';

		if ( ! file_exists( $tmp ) ) {
			mkdir( $tmp , 0660, true );
		}


		for ( $i = 0; $i < 50; $i++) {
			$name = 'image_' . $i . '.jpg';

			if ( ! file_exists( $tmp . $name ) )
				file_put_contents( $tmp . $name, file_get_contents( $url ) );

			$file_array = array( 'tmp_name' => $tmp . $name, 'name' => $name );

			media_handle_sideload( $file_array, false );
		}


	}

}

Prism_Media_Data::init();