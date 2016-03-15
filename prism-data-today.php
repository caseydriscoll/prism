<?php

/**
 * Plugin Name: Prism | Today Data
 * Description: Activate to load sample 'Today' data
 * Author: Casey Patrick Driscoll
 * Author URI: https://caseypatrickdriscoll.com
 */

class Prism_Today_Data {

	static function init() {
		add_filter( 'prism_branches', array( __CLASS__, 'add_branches' ), 1 );
	}

	public static function add_branches( $branches ) {
		$today_branch =  array(
			array(
				'title'       => 'Today',
				'slug'        => array(
				                   'plural' => 'today',
				                   'single' => 'today'
				                 ),
				'icon'        => 'fa-calendar-o',
				'route'       => 'today',
				'callback'    => 'get_today'
			),
		);

		return array_merge( $branches, $today_branch );
	}

}

Prism_Today_Data::init();