<?php

/**
 * Plugin Name: Prism | Posts Data
 * Description: Activate to load sample 'Posts' data
 * Author: PatchWorks
 * Author URI: https:/patch.works
 */

class Prism_Posts_Data {

	static function init() {
		register_activation_hook( __FILE__, array( __CLASS__, 'install' ) );

		add_filter( 'prism_branches', array( __CLASS__, 'add_branches' ), 111 );
	}

	private static function rand_date() {
		$int = rand( 1000000000, 1446068703 ); // 2015-10-28 17:45:12 (close to it)

		return date( "Y-m-d H:i:s", $int );
	}

	public static function add_branches( $branches ) {
		$post_branches = array(
			array(
				'title'       => 'Posts',
				'slug'        => array(
				                   'plural' => 'posts',
				                   'single' => 'post'
				                 ),
				'icon'        => 'fa-thumb-tack',
				'connections' => array()
			),
			array(
				'title'       => 'Swatches',
				'slug'        => array(
				                   'plural' => 'swatches',
				                   'single' => 'swatch'
				                 ),
				'icon'        => 'fa-sticky-note-o',
				'connections' => array()
			),
			array(
				'title'       => 'Crayons',
				'slug'        => array(
				                   'plural' => 'crayons',
				                   'single' => 'crayon'
				                 ),
				'connections' => array()
			),
			array(
				'title'       => 'Cities',
				'slug'        => array(
				                   'plural' => 'cities',
				                   'single' => 'city'
				                 ),
				'icon'        => 'fa-map',
				'connections' => array()
			),
		);

		return array_merge( $branches, $post_branches );
	}


	static function install() {

		P2P_Storage::install();

		$posts = array(
								array( 
									'post_title'   => 'You think Im an ignorant savage',
									'post_content' => ''
								),
								array( 
									'post_title'   => 'And you\'ve been so many places',
									'post_content' => ''
								),
								array( 
									'post_title'   => 'I guess it must be so',
									'post_content' => ''
								),
								array( 
									'post_title'   => 'But still I cannot see',
									'post_content' => ''
								),
								array( 
									'post_title'   => 'If the savage one is me',
									'post_content' => ''
								),
								array( 
									'post_title'   => 'How can there be so much that you dont know',
									'post_content' => ''
								),
								array( 
									'post_title'   => 'You dont know',
									'post_content' => ''
								),
								array( 
									'post_title'   => 'You think you own whatever land you land on',
									'post_content' => ''
								),
								array( 
									'post_title'   => 'The Earth is just a dead thing you can claim',
									'post_content' => ''
								),
								array( 
									'post_title'   => 'But I know every rock and tree and creature',
									'post_content' => ''
								),
								array( 
									'post_title'   => 'Has a life, has a spirit, has a name',
									'post_content' => ''
								),
								array( 
									'post_title'   => 'You think the only people who are people',
									'post_content' => ''
								),
								array( 
									'post_title'   => 'Are the people who look and think like you',
									'post_content' => ''
								),
								array( 
									'post_title'   => 'But if you walk the footsteps of a stranger',
									'post_content' => ''
								),
								array( 
									'post_title'   => 'Youll learn things you never knew, you never knew',
									'post_content' => ''
								),
								array( 
									'post_title'   => 'Have you ever heard the wolf cry to the blue corn moon',
									'post_content' => ''
								),
								array( 
									'post_title'   => 'Or asked the grinning bobcat why he grinned',
									'post_content' => ''
								),
								array( 
									'post_title'   => 'Can you sing with all the voices of the mountains',
									'post_content' => ''
								),
								array( 
									'post_title'   => 'Can you paint with all the colors of the wind',
									'post_content' => ''
								)
							);

		foreach ( $posts as $i => $post ) {
			$post['post_status'] = 'publish';
			$post['post_date']   = self::rand_date();

			$posts[$i]['id'] = wp_insert_post( $post );
		}


		// SWATCHES
		// https://en.wikipedia.org/wiki/List_of_colors:_A%E2%80%93F

		$swatches = array(
									array( 
										'post_title'   => 'Absolute Zero',
										'post_content' => ''
									),
									array( 
										'post_title'   => 'Aero',
										'post_content' => ''
									),
									array( 
										'post_title'   => 'Almond',
										'post_content' => ''
									),
									array( 
										'post_title'   => 'Amazon',
										'post_content' => ''
									),
									array( 
										'post_title'   => 'Amber',
										'post_content' => ''
									),
									array( 
										'post_title'   => 'Antique Ruby',
										'post_content' => ''
									),
									array( 
										'post_title'   => 'Barn Red',
										'post_content' => ''
									),
									array( 
										'post_title'   => 'Bazaar',
										'post_content' => ''
									),
									array( 
										'post_title'   => 'B\'dazzled Blue',
										'post_content' => ''
									),
									array( 
										'post_title'   => 'Black Olive',
										'post_content' => ''
									),
									array( 
										'post_title'   => 'Blue',
										'post_content' => ''
									),
									array( 
										'post_title'   => 'Blush',
										'post_content' => ''
									),
									array( 
										'post_title'   => 'Bright Lilac',
										'post_content' => ''
									),
									array( 
										'post_title'   => 'Bubble Gum',
										'post_content' => ''
									),
									array( 
										'post_title'   => 'Byzantium',
										'post_content' => ''
									),
									array( 
										'post_title'   => 'Canary Yellow',
										'post_content' => ''
									),
									array( 
										'post_title'   => 'Candy Apple Red',
										'post_content' => ''
									),
									array( 
										'post_title'   => 'Caribbean Green',
										'post_content' => ''
									),
									array( 
										'post_title'   => 'Carrot Orange',
										'post_content' => ''
									),
									array( 
										'post_title'   => 'Cerise',
										'post_content' => ''
									),
									array( 
										'post_title'   => 'Cherry',
										'post_content' => ''
									),
									array( 
										'post_title'   => 'Chestnut',
										'post_content' => ''
									),
									array( 
										'post_title'   => 'Congo Pink',
										'post_content' => ''
									),
									array( 
										'post_title'   => 'Coquelicot',
										'post_content' => ''
									),
									array( 
										'post_title'   => 'Cordovan',
										'post_content' => ''
									),
									array( 
										'post_title'   => 'Crimson',
										'post_content' => ''
									),
									array( 
										'post_title'   => 'Cyber Yellow',
										'post_content' => ''
									),
									array( 
										'post_title'   => 'Daffodil',
										'post_content' => ''
									),
									array( 
										'post_title'   => 'Dark Lava',
										'post_content' => ''
									),
									array( 
										'post_title'   => 'Deep Champagne',
										'post_content' => ''
									),
									array( 
										'post_title'   => 'Desert',
										'post_content' => ''
									),
									array( 
										'post_title'   => 'Dollar Bill',
										'post_content' => ''
									),
									array( 
										'post_title'   => 'Drab',
										'post_content' => ''
									),
									array( 
										'post_title'   => 'Ecru',
										'post_content' => ''
									),
									array( 
										'post_title'   => 'Eggplant',
										'post_content' => ''
									),
									array( 
										'post_title'   => 'Electric Ultramarine',
										'post_content' => ''
									),
									array( 
										'post_title'   => 'Emerald',
										'post_content' => ''
									),
									array( 
										'post_title'   => 'Eminence',
										'post_content' => ''
									),
									array( 
										'post_title'   => 'Eton Blue',
										'post_content' => ''
									),
									array( 
										'post_title'   => 'Falu Red',
										'post_content' => ''
									),
									array( 
										'post_title'   => 'Fandango',
										'post_content' => ''
									),
									array( 
										'post_title'   => 'Feldgrau',
										'post_content' => ''
									),
								);


		foreach ( $swatches as $i => $swatch ) {
			$swatch['post_status'] = 'publish';
			$swatch['post_type']   = 'swatches';
			$swatch['post_date']   = self::rand_date();

			$swatches[$i]['id'] = wp_insert_post( $swatch );
		}


		// Cities (Probably based on Pokemon Cities, which are based on colors)
		// http://bulbapedia.bulbagarden.net/wiki/List_of_cities_and_towns

		$cities = array(
									array( 
										'post_title'   => 'Celadon City',
										'post_content' => ''
									),
									array( 
										'post_title'   => 'Cerulean City',
										'post_content' => ''
									),
									array( 
										'post_title'   => 'Cinnabar Island',
										'post_content' => ''
									),
									array( 
										'post_title'   => 'Fuchsia City',
										'post_content' => ''
									),
									array( 
										'post_title'   => 'Lavendar Town',
										'post_content' => ''
									),
									array( 
										'post_title'   => 'Pallet Town',
										'post_content' => ''
									),
									array( 
										'post_title'   => 'Pewter City',
										'post_content' => ''
									),
									array( 
										'post_title'   => 'Saffron City',
										'post_content' => ''
									),
									array( 
										'post_title'   => 'Vermilion City',
										'post_content' => ''
									),
									array( 
										'post_title'   => 'Viridian City',
										'post_content' => ''
									),
								);


		foreach ( $cities as $i => $city ) {
			$city['post_status'] = 'publish';
			$city['post_type']   = 'cities';
			$city['post_date']   = self::rand_date();

			$cities[$i]['id'] = wp_insert_post( $city );
		}


		// CRAYONS
		// https://en.wikipedia.org/wiki/List_of_Crayola_crayon_colors

		$crayons = array(
								array( 
									'post_title'   => 'Maximum Red',
									'post_content' => ''
								),
								array( 
									'post_title'   => 'Light Venetian Red',
									'post_content' => ''
								),
								array( 
									'post_title'   => 'Macaroni and Cheese',
									'post_content' => ''
								),
								array( 
									'post_title'   => 'Mango Tango',
									'post_content' => ''
								),
								array( 
									'post_title'   => 'Goldenrod',
									'post_content' => ''
								),
								array( 
									'post_title'   => 'Maximum Yellow',
									'post_content' => ''
								),
								array( 
									'post_title'   => 'Inchworm',
									'post_content' => ''
								),
								array( 
									'post_title'   => 'Fern',
									'post_content' => ''
								),
								array( 
									'post_title'   => 'Shamrock',
									'post_content' => ''
								),
								array( 
									'post_title'   => 'Tropical Rain Forest',
									'post_content' => ''
								),
								array( 
									'post_title'   => 'Outer Space',
									'post_content' => ''
								),
								array( 
									'post_title'   => 'Pacific Blue',
									'post_content' => ''
								),
								array( 
									'post_title'   => 'Cornflower',
									'post_content' => ''
								),
								array( 
									'post_title'   => 'Denim',
									'post_content' => ''
								),
								array( 
									'post_title'   => 'Indigo',
									'post_content' => ''
								),
								array( 
									'post_title'   => 'Royal Purple',
									'post_content' => ''
								),
								array( 
									'post_title'   => 'Brilliant Rose',
									'post_content' => ''
								),
							);


		foreach ( $crayons as $i => $crayon ) {
			$crayon['post_status'] = 'publish';
			$crayon['post_type']   = 'crayons';
			$crayon['post_date']   = self::rand_date();

			$crayons[$i]['id'] = wp_insert_post( $crayon );
		}


	}

}

Prism_Posts_Data::init();