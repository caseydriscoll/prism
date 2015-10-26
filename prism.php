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

		add_action( 'rest_api_init', 'Prism::append_p2p_connections' );

		add_filter( 'rest_private_query_vars', 'Prism::override_query_vars', 10, 1 );

		add_filter( 'rest_post_query', 'Prism::override_query', 10, 2 );

		add_action( 'init', array( __CLASS__, 'business_logic' ) );
		add_action( 'p2p_init', array( __CLASS__, 'connections' ) );


	}
	
	static function business_logic() {
		$args = array(
			'public'       => true,
			'label'        => 'Movies',
			'labels'       => array(
			                    'singular' => 'movie'
			                  ),
			'show_in_rest' => true
		);

		register_post_type( 'movies', $args );

		$args = array(
			'public'       => true,
			'label'        => 'Actors',
			'labels'       => array(
			                    'singular' => 'actor'
			                  ),
			'show_in_rest' => true
		);

		register_post_type( 'actors', $args );

	}



	public static function connections() {

		p2p_register_connection_type( array(
			'name'       => 'movies_to_actors',
			'from'       => 'movies',
			'to'         => 'actors',
			// 'reciprocal' => true
		) );

	}

	public static function sample_types() {

		$args = array(
			'public' => true,
			'label'  => 'Swatches',
			'show_in_rest' => true
		);

		// register_post_type( 'swatches', $args );

		$args = array(
			'public' => true,
			'label'  => 'Crayons',
			'show_in_rest' => true
		);

		// register_post_type( 'crayons', $args );

		$args = array(
			'public' => true,
			'label'  => 'Cities',
			'show_in_rest' => true
		);

		// register_post_type( 'cities', $args );

		$args = array(
			'public' => true,
			'label'  => 'Birds',
			'show_in_rest' => true
		);

		// register_post_type( 'birds', $args );

	}


	public static function append_p2p_connections() {

		$connections = P2P_Connection_Type_Factory::get_all_instances();

		// TODO: Remove this line
		// print_r( $connections ); die();

		foreach( $connections as $name => $connection ) {
			$args = array(
							'get_callback'    => 'Prism::get_connections',
							'update_callback' => 'Prism::set_connection',
							'schema'          => null
						);


			$from = $connection->side['from']->query_vars['post_type'][0];
			$to   = $connection->side[  'to']->query_vars['post_type'][0];

			register_api_field( $from, $to, $args );

			add_filter( 'rest_prepare_' . $from, 'Prism::prepare_request', 10, 3 );
			add_filter( 'rest_prepare_' . $to,   'Prism::prepare_request', 10, 3 );
			// TODO: If reciprocal, do a second reversed register_api_field here?
		}

	}

	public static function override_query_vars( $args ) {

		array_push( $args, 'post_type', 'connected_type', 'connected_items', 'nopaging' );

		return $args;
	}

	public static function override_query( $args, $request ) {

		if ( array_key_exists( 's', $args ) )
			$args['post_type'] = 'any';


		if ( array_key_exists( 'connected_id', $args ) ) {

			$query = array(
			           'post_type' => 'any'
			         );

			if ( is_numeric( $args['connected_id'] ) )
				$query['p']    = $args['connected_id'];
			else
				$query['name'] = $args['connected_id'];


			$connected_items = new WP_Query( $query );

			$connected_items->the_post();

			// print_r( get_post() ); die();

			$args['nopaging']        = true;
			$args['connected_items'] = get_post();

			wp_reset_postdata();

			// print_r( $args ); die();

		}

		return $args;
	}

	public static function get_connections( $object, $field_name, $request ) {

		// return $object;

		$connections = P2P_Connection_Type_Factory::get_all_instances();

		$args = '';

		foreach( $connections as $name => $connection ) {

			$side = $connection->side;

			if ( $side['from']->query_vars['post_type'][0] == $field_name || 
					 $side[  'to']->query_vars['post_type'][0] == $field_name ) {

				$args = array(
									'connected_type' => $name,
									'connected_items' => $object,
									'nopaging' => true,
								);

				continue;
			}

		}

		$posts = new WP_Query( $args );

		$data  = [];

		foreach ( $posts->posts as $post ) {
			array_push( $data, $post->ID );
		}

		return $data;

	}

	public static function prepare_request( $data, $post, $request ) {

		return $data;

	}

	public static function load_assets() {

		add_action( 'wp_print_styles', 'Prism::clean_slate' );

		wp_register_script( 'react', 'https://fb.me/react-with-addons-0.14.0.js', '', '0.14.0', 1 );
		wp_register_script( 'react-dom', 'https://fb.me/react-dom-0.14.0.js', '', '0.14.0', 1 );

		wp_register_script( 'bootstrap', 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js', '', '3.3.5', 1 );

		wp_register_script( 'prism', plugin_dir_url( __FILE__ ) . 'assets/js/prism.js', array( 'react', 'react-dom', 'bootstrap', 'jquery', 'backbone' ), '', 1 );

		wp_localize_script( 'prism', 'PRISM', self::localize() );

		wp_enqueue_script( 'prism' );


		wp_register_style( 'bootstrap', 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css', '', '3.3.5' );
		wp_register_style( 'font-awesome', 'https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css', '', '4.4.0' );

		wp_register_style( 'prism', plugin_dir_url( __FILE__ ) . 'assets/css/prism.css', array( 'bootstrap', 'font-awesome' ) );

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
			// array( 'title' => 'Posts',    'slug' => 'posts',    'icon' => 'fa-thumb-tack' ),
			// array( 'title' => 'Swatches', 'slug' => 'swatches', 'icon' => 'fa-sticky-note-o' ),
			// array( 'title' => 'Crayons',  'slug' => 'crayons',  ),
			// array( 'title' => 'Cities',   'slug' => 'cities',   'icon' => 'fa-map' ),
			// array( 'title' => 'Media',    'slug' => 'media',    'icon' => 'fa-image' )
		);

		$meta = array(
			'default' => array(
				'id',
				'date',
				'modified',
				'modified_gmt',
				'slug'
			)
		);

		$data = array(
			'debug'         => array(
					'level'           => 1,
					'ignore'          => array(
															   // 'PrismLeafNode'
															 ),
					'only'            => array(

					                     )
												 ),
			'title'         => get_bloginfo( 'title' ),
			'description'   => get_bloginfo( 'description' ),
			'nonce'         => wp_create_nonce( 'wp_rest' ),
			'url'           => array(
					'root'            => get_bloginfo( 'url' ),
					'rest'            => get_bloginfo( 'url' ) . '/wp-json/wp/v2/',
					'login'           => wp_login_url()
												 ),
			'gravatar'      => array(
					'width'           => 48,
					'height'          => 48
												 ),
			'ajax'          => array(
					'queue'           => array()
												 ),
			'view'          => array(
					// 'posts'           => 'list',
					// 'media'           => 'grid',
					'search'          => 'list',
					'default'         => 'grid'
												 ),
			'branches'      => apply_filters( 'prism_branches', $branches ),
			'meta'          => $meta,
			'lockMeta'      => 'lock',
			'newleaf'       => false,
			'key'           => array(
					'mode'            => false,
					'last'            => array( 'code' =>  0, 'time' => 0   ),
					'double'          => array( 'code' => 32, 'time' => 200 )
												 ),
			'rainbowbar'    => array(
					'name'            => 'Rainbow Bar!'
												 ),
			'width'         => array( 
					'default'         => array( 'trunk' => 17, 'branch' => 33, 'leaf' => 35, 'meta' =>  15 ),
					'current'         => array( 'trunk' => 17, 'branch' => 33, 'leaf' => 35, 'meta' =>  15 ),
					'minimum'         => array( 'trunk' => 10, 'branch' => 25, 'leaf' => 30, 'meta' =>  10 ),
					'maximum'         => array( 'trunk' => 30, 'branch' => 40, 'leaf' => 65, 'meta' =>  30 )
												 ),
			'status'        => array(
					'timeout'         => 1000
												 )
		);

		return $data;

	}


}


Prism::init();