<?php

/**
 * Plugin Name: Prism | Movies Data
 * Description: Activate to load sample 'Movies' data
 * Author: PatchWorks
 * Author URI: https:/patch.works
 */

class Prism_Movies_Data {

	static function init() {
		register_activation_hook( __FILE__, array( __CLASS__, 'install' ) );

		add_action( 'init', array( __CLASS__, 'business_logic' ) );

		add_action( 'p2p_init', array( __CLASS__, 'connections' ) );

		add_filter( 'prism_branches', array( __CLASS__, 'add_branches' ) );

	}

	static function business_logic() {
		$args = array(
			'public' => true,
			'label'  => 'Movies',
			'show_in_rest' => true
		);

		register_post_type( 'movies', $args );

		$args = array(
			'public' => true,
			'label'  => 'Actors',
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

	public static function add_branches( $branches ) {
		$movie_branches =  array(
			array(
				'title'       => 'Movies',
				'slug'        => 'movies',
				'icon'        => 'fa-film',
				'connections' => array( 'actors' )
			),
			array(
				'title' => 'Actors',
				'slug' => 'actors',
				'icon' => 'fa-group',
				'connections' => array()
			),
		);

		return array_merge( $branches, $movie_branches );
	}


	static function install() {

		P2P_Storage::install();

		$movies = array(
								array( 'post_title' => 'Yellow Submarine'               ),
								array( 'post_title' => 'The Color Purple'               ),
								array( 'post_title' => 'The Pink Panther'               ),
								array( 'post_title' => 'Red Dragon'                     ),
								array( 'post_title' => 'Soylent Green'                  ),
								array( 'post_title' => 'The Thin Red Line'              ),
								array( 'post_title' => 'Red Planet'                     ),
								array( 'post_title' => 'The Blue Lagoon'                ),
								array( 'post_title' => 'The Purple Rose of Cario'       ),
								array( 'post_title' => 'Moulin Rouge'                   ),
								array( 'post_title' => 'RED'                            ),
								array( 'post_title' => 'Red Dawn'                       ),
								array( 'post_title' => 'Clock Work Orange'              ),
								array( 'post_title' => 'The Blues Brothers'             ),
								array( 'post_title' => 'Black Hawk Down'                ),
								array( 'post_title' => 'Deep Blue Sea'                  ),
								array( 'post_title' => 'Creature from the Black Lagoon' ),
								array( 'post_title' => 'The Green Lantern'              ),
								array( 'post_title' => 'She Wore a Yellow Ribbon'       ),
								array( 'post_title' => 'Black Sheep'                    ),
								array( 'post_title' => 'Hunt for Red October'           ),
								array( 'post_title' => 'Meet Joe Black'                 ),
								array( 'post_title' => 'Reservoir Dogs'                 ),
								array( 'post_title' => 'Fried Green Tomatoes'           ),
								array( 'post_title' => 'The Black Stallion'             ),
								array( 'post_title' => 'The Scarlet Letter'             ),
								array( 'post_title' => 'Goldfinger'                     ),
								array( 'post_title' => 'The Man with the Golden Gun'    ),
								array( 'post_title' => 'Goldeneye'                      ),
								array( 'post_title' => 'Purple Rain'                    ),
								array( 'post_title' => 'White Christmas'                ),
								array( 'post_title' => 'Blue is the Warmest Colour'     ),
								array( 'post_title' => 'Fifty Shades of Grey'           ),
								array( 'post_title' => 'Silver Streak'                  ),
								array( 'post_title' => 'Crimson Tide'                   )
							);

		$actors = array(
								array( 
									'post_title' => 'George Harrison'        ,
									'movies'     => array( 'Yellow Submarine' )
								),
								array( 
									'post_title' => 'John Lennon'            ,
									'movies'     => array( 'Yellow Submarine' )
								),
								array( 
									'post_title' => 'Paul McCartney'         ,
									'movies'     => array( 'Yellow Submarine' )
								),
								array( 
									'post_title' => 'Ringo Star'         ,
									'movies'     => array( 'Yellow Submarine' )
								),
								array( 
									'post_title' => 'Danny Glover'         ,
									'movies'     => array( 'The Color Purple' )
								),
								array( 
									'post_title' => 'Whoopi Goldberg'         ,
									'movies'     => array( 'The Color Purple' )
								),
								array( 
									'post_title' => 'Margaret Avery'         ,
									'movies'     => array( 'The Color Purple' )
								),
								array( 
									'post_title' => 'Oprah Winfrey'         ,
									'movies'     => array( 'The Color Purple' )
								),
								array( 
									'post_title' => 'David Niven'         ,
									'movies'     => array( 'The Pink Panther' )
								),
								array( 
									'post_title' => 'Peter Sellers'         ,
									'movies'     => array( 'The Pink Panther' )
								),
								array( 
									'post_title' => 'Rober Wagner'         ,
									'movies'     => array( 'The Pink Panther' )
								),
								array( 
									'post_title' => 'Capucine'         ,
									'movies'     => array( 'The Pink Panther' )
								),
								array( 
									'post_title' => 'Anthony Hopkins'         ,
									'movies'     => array( 'Red Dragon' )
								),
								array( 
									'post_title' => 'Edward Norton'         ,
									'movies'     => array( 'Red Dragon' )
								),
								array( 
									'post_title' => 'Ralph Fiennes'         ,
									'movies'     => array( 'Red Dragon' )
								),
								array( 
									'post_title' => 'Harvey Keitel'         ,
									'movies'     => array( 'Red Dragon' )
								),
								array( 
									'post_title' => 'Charlton Heston'         ,
									'movies'     => array( 'Soylent Green' )
								),
								array( 
									'post_title' => 'Leigh Taylor-Young'          ,
									'movies'     => array( 'Soylent Green' )
								),
								array( 
									'post_title' => 'Chuck Connors'         ,
									'movies'     => array( 'Soylent Green' )
								),
								array( 
									'post_title' => 'Joseph Cotten'         ,
									'movies'     => array( 'Soylent Green' )
								),
								array( 
									'post_title' => 'Nick Nolte'         ,
									'movies'     => array( 'The Thin Red Line' )
								),
								array( 
									'post_title' => 'Jim Caviezel'         ,
									'movies'     => array( 'The Thin Red Line' )
								),
								array( 
									'post_title' => 'Sean Pean'         ,
									'movies'     => array( 'The Thin Red Line' )
								),
								array( 
									'post_title' => 'Elias Koteas'         ,
									'movies'     => array( 'The Thin Red Line' )
								),
								array( 
									'post_title' => 'Val Kilmer'         ,
									'movies'     => array( 'Red Planet' )
								),
								array( 
									'post_title' => 'Carrie-Anne Moss'         ,
									'movies'     => array( 'Red Planet' )
								),
								array( 
									'post_title' => 'Tom Sizemore'         ,
									'movies'     => array( 'Red Planet' )
								),
								array( 
									'post_title' => 'Benjamin Bratt'         ,
									'movies'     => array( 'Red Planet' )
								),
								array( 
									'post_title' => 'Brooke Shields'         ,
									'movies'     => array( 'The Blue Lagoon' )
								),
								array( 
									'post_title' => 'Christopher Atkins'          ,
									'movies'     => array( 'The Blue Lagoon' )
								),
								array( 
									'post_title' => 'Leo McKern'         ,
									'movies'     => array( 'The Blue Lagoon' )
								),
								array( 
									'post_title' => 'William Daniels'         ,
									'movies'     => array( 'The Blue Lagoon' )
								),
								array( 
									'post_title' => 'Mia Farrow'         ,
									'movies'     => array( 'The Purple Rose of Cairo' )
								),
								array( 
									'post_title' => 'Jeff Daniels'         ,
									'movies'     => array( 'The Purple Rose of Cairo' )
								),
								array( 
									'post_title' => 'Danny Aiello'         ,
									'movies'     => array( 'The Purple Rose of Cairo' )
								),
								array( 
									'post_title' => 'Nicole Kidman'         ,
									'movies'     => array( 'Moulin Rouge' )
								),
								array( 
									'post_title' => 'Ewan McGregor'         ,
									'movies'     => array( 'Moulin Rouge' )
								),
								array( 
									'post_title' => 'John Leguizamo'         ,
									'movies'     => array( 'Moulin Rouge' )
								),
								array( 
									'post_title' => 'Jim Broadbent'         ,
									'movies'     => array( 'Moulin Rouge' )
								),
								array( 
									'post_title' => 'Bruce Willis'         ,
									'movies'     => array( 'RED' )
								),
								array( 
									'post_title' => 'Mary-Louise Parker'          ,
									'movies'     => array( 'RED' )
								),
								array( 
									'post_title' => 'Karl Urban'         ,
									'movies'     => array( 'RED' )
								),
								array( 
									'post_title' => 'Morgan Freeman'         ,
									'movies'     => array( 'RED' )
								),
								array( 
									'post_title' => 'Patrick Swayze'         ,
									'movies'     => array( 'Red Dawn' )
								),
								array( 
									'post_title' => 'C. Thomas Howell'         ,
									'movies'     => array( 'Red Dawn' )
								),
								array( 
									'post_title' => 'Lea Thompson'         ,
									'movies'     => array( 'Red Dawn' )
								),
								array( 
									'post_title' => 'Charlie Sheen'         ,
									'movies'     => array( 'Red Dawn' )
								),
							);

		foreach ( $movies as $i => $movie ) {
			$movie['post_status'] = 'publish';
			$movie['post_type']   = 'movies';

			$movies[$i]['id'] = wp_insert_post( $movie );
		}

		foreach ( $actors as $i => $actor ) {
			$actor['post_status'] = 'publish';
			$actor['post_type']   = 'actors';

			$actors[$i]['id'] = wp_insert_post( $actor );

			foreach ( $actor['movies'] as $actor_movie ) {
				foreach ( $movies as $movie ) {
					if ( $movie['post_title'] == $actor_movie ) {
						p2p_type( 'movies_to_actors' )->connect( $movie['id'], $actors[$i]['id'] );
						continue;
					}
				}
			}
		}

	}

}

Prism_Movies_Data::init();