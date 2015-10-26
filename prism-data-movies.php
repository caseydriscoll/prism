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

		add_filter( 'prism_branches', array( __CLASS__, 'add_branches' ) );

	}

	public static function add_branches( $branches ) {
		$movie_branches =  array(
			array(
				'title'       => 'Movies',
				'slug'        => array(
				                   'plural' => 'movies',
				                   'single' => 'movie'
				                 ),
				'icon'        => 'fa-film',
				'connections' => array( 'actors' )
			),
			array(
				'title'       => 'Actors',
				'slug'        => array(
				                   'plural' => 'actors',
				                   'single' => 'actor'
				                 ),
				'icon'        => 'fa-group',
				'connections' => array()
			),
		);

		return array_merge( $branches, $movie_branches );
	}


	static function install() {

		P2P_Storage::install();

		$movies = array(
								array( 
									'post_title'   => 'Yellow Submarine',
									'post_content' => 'The Beatles agree to accompany Captain Fred in his Yellow Submarine and go to Pepperland to free it from the music hating Blue Meanies.'
								),
								array( 
									'post_title'   => 'The Color Purple',
									'post_content' => 'A black Southern woman struggles to find her identity after suffering years of abuse from her father and others over 40 years.'
								),
								array( 
									'post_title'   => 'The Pink Panther',
									'post_content' => 'Bumbling and conceited French police inspector Clouseau tries to catch The Phantom, a daring jewel thief whose identity and features are unknown - and is acting right under his nose.',
								),
								array( 
									'post_title'   => 'Red Dragon',
									'post_content' => 'A retired FBI agent with psychological gifts is assigned to help track down "The Tooth Fairy", a mysterious serial killer; aiding him is imprisoned criminal genius Hannibal "The Cannibal" Lecter.',
								),
								array( 
									'post_title'   => 'Soylent Green',
									'post_content' => 'With the world ravaged by the greenhouse effect and overpopulation, an NYPD detective investigates the murder of a CEO with ties to the worlds main food supply.',
								),
								array( 
									'post_title'   => 'The Thin Red Line',
									'post_content' => 'Terrence Malicks adaptation of James Jones autobiographical 1962 novel, focusing on the conflict at Guadalcanal during the second World War.',
								),
								array( 
									'post_title'   => 'Red Planet',
									'post_content' => 'Astronauts, and their robotic dog AMME, search for solutions to save a dying Earth by searching on Mars, only to have the mission go terribly awry.',
								),
								array( 
									'post_title'   => 'The Blue Lagoon',
									'post_content' => 'In the Victorian period, two children are shipwrecked on a tropical island in the South Pacific. With no adults to guide them, the two make a simple life together, unaware that sexual maturity will eventually intervene.',
								),
								array( 
									'post_title'   => 'The Purple Rose of Cario',
									'post_content' => 'In 1930s New Jersey, a movie character walks off the screen and into the real world.',
								),
								array( 
									'post_title'   => 'Moulin Rouge',
									'post_content' => 'A poet falls for a beautiful courtesan whom a jealous duke covets in this stylish musical, with music drawn from familiar 20th century sources.',
								),
								array( 
									'post_title'   => 'RED',
									'post_content' => 'When his peaceful life is threatened by a high-tech assassin, former black-ops agent Frank Moses reassembles his old team in a last ditch effort to survive and uncover his assailants.',
								),
								array( 
									'post_title'   => 'Red Dawn',
									'post_content' => 'It is the dawn of World War III. In mid-western America, a group of teenagers bands together to defend their town, and their country, from invading Soviet forces.',
								),
								array( 
									'post_title'   => 'Clock Work Orange',
									'post_content' => 'In future Britain, charismatic delinquent Alex DeLarge is jailed and volunteers for an experimental aversion therapy developed by the government in an effort to solve societys crime problem - but not all goes according to plan.',
								),
								array( 
									'post_title'   => 'The Blues Brothers',
									'post_content' => 'Jake Blues, just out from prison, puts together his old band to save the Catholic home where he and brother Elwood were raised.',
								),
								array( 
									'post_title'   => 'Black Hawk Down',
									'post_content' => '123 elite U.S. soldiers drop into Somalia to capture two top lieutenants of a renegade warlord and find themselves in a desperate battle with a large force of heavily-armed Somalis.',
								),
								array( 
									'post_title'   => 'Deep Blue Sea',
									'post_content' => 'Searching for a cure to Alzheimers disease a group of scientists on an isolated research facility become the bait as a trio of intelligent sharks fight back.',
								),
								array( 
									'post_title'   => 'Creature from the Black Lagoon',
									'post_content' => 'A strange prehistoric beast lurks in the depths of the Amazonian jungle. A group of scientists try to capture the animal and bring it back to civilization for study.',
								),
								array( 
									'post_title'   => 'The Green Lantern',
									'post_content' => 'Reckless test pilot Hal Jordan is granted an alien ring that bestows him with otherworldly powers that inducts him into an intergalactic police force, the Green Lantern Corps.',
								),
								array( 
									'post_title'   => 'She Wore a Yellow Ribbon',
									'post_content' => 'Captain Nathan Brittles, on the eve of retirement, takes out a last patrol to stop an impending massive Indian attack. Encumbered by women who must be evacuated, Brittles finds his mission imperiled.',
								),
								array( 
									'post_title'   => 'Black Sheep',
									'post_content' => 'A gubernatorial candidate hires a wormy special assistant whose only job is to make sure the candidates well-meaning but incompetent brother doesnt ruin the election.',
								),
								array( 
									'post_title'   => 'The Hunt for Red October',
									'post_content' => 'In 1984, the USSRs best submarine captain in their newest sub violates orders and heads for the USA. Is he trying to deflect, or to start a war?',
								),
								array( 
									'post_title'   => 'Meet Joe Black',
									'post_content' => 'Death, who takes the form of a young man, asks a media mogul to act as a guide to teach him about life on Earth and in the process he falls in love with his guides daughter.',
								),
								array( 
									'post_title'   => 'Reservoir Dogs',
									'post_content' => 'After a simple jewelery heist goes terribly wrong, the surviving criminals begin to suspect that one of them is a police informant.',
								),
								array( 
									'post_title'   => 'Fried Green Tomatoes',
									'post_content' => 'A housewife who is unhappy with her life befriends an old lady in a nursing home and is enthralled by the tales she tells of people she used to know.',
								),
								array( 
									'post_title'   => 'The Black Stallion',
									'post_content' => 'While traveling with his father, young Alec becomes fascinated by a mysterious Arabian stallion who is brought on board and stabled in the ship he is sailing on. When it tragically sinks both he and the horse survive only to be stranded on a desert island. He befriends it, so when finally rescued, both return to his home where they soon meet Henry Dailey, a once-successful trainer. Together they begin training the stallion to race against the fastest horses in the world.',
								),
								array( 
									'post_title'   => 'The Scarlet Letter',
									'post_content' => 'An affair between a young woman and a pastor has disastrous consequences.',
								),
								array( 
									'post_title'   => 'Goldfinger',
									'post_content' => 'Investigating a gold magnates smuggling, James Bond uncovers a plot to contaminate the Fort Knox gold reserve.',
								),
								array( 
									'post_title'   => 'The Man with the Golden Gun',
									'post_content' => 'James Bond is led to believe that he is targeted by the worlds most expensive assassin while he attempts to recover sensitive solar cell technology that is being sold to the highest bidder.',
								),
								array( 
									'post_title'   => 'Goldeneye',
									'post_content' => 'James Bond teams up with the lone survivor of a destroyed Russian research center to stop the hijacking of a nuclear space weapon by a fellow agent formerly believed to be dead.',
								),
								array( 
									'post_title'   => 'Purple Rain',
									'post_content' => 'A young musician, tormented by an abusive situation at home, must contend with a rival singer, a burgeoning romance and his own dissatisfied band as his star begins to rise.',
								),
								array( 
									'post_title'   => 'White Christmas',
									'post_content' => 'A successful song-and-dance team become romantically involved with a sister act and team up to save the failing Vermont inn of their former commanding general.',
								),
								array( 
									'post_title'   => 'Blue is the Warmest Colour',
									'post_content' => 'Adeles life is changed when she meets Emma, a young woman with blue hair, who will allow her to discover desire, to assert herself as a woman and as an adult. In front of others, Adele grows, seeks herself, loses herself and ultimately finds herself through love and loss.',
								),
								array( 
									'post_title'   => 'Fifty Shades of Grey',
									'post_content' => 'Literature student Anastasia Steeles life changes forever when she meets handsome, yet tormented, billionaire Christian Grey.',
								),
								array( 
									'post_title'   => 'Silver Streak',
									'post_content' => 'On a long-distance train trip, a man finds romance but also finds himself in danger of being killed, or at least pushed off the train.',
								),
								array( 
									'post_title'   => 'Crimson Tide',
									'post_content' => 'On a US nuclear missile sub, a young first officer stages a mutiny to prevent his trigger happy captain from launching his missiles before confirming his orders to do so.',
								)
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