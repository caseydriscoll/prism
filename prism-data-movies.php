<?php

/**
 * Plugin Name: Prism | Movies Data
 * Description: Activate to load sample 'Movies' data
 * Author: Casey Patrick Driscoll
 * Author URI: https://caseypatrickdriscoll.com
 */

class Prism_Movies_Data {

	static function init() {
		register_activation_hook( __FILE__, array( __CLASS__, 'install' ) );

		add_filter( 'prism_branches', array( __CLASS__, 'add_branches' ), 10 );

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
									'post_title'   => 'A Clock Work Orange',
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
									'post_title'   => 'Green Lantern',
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
								),
								array(
									'post_title'   => 'Silver Linings Playbook',
									'post_content' => 'After a stint in a mental institution, former teacher Pat Solitano moves back in with his parents and tries to reconcile with his ex-wife. Things get more challenging when Pat meets Tiffany, a mysterious girl with problems of her own'
								),
								array(
									'post_title'   => 'Black Swan',
									'post_content' => 'A ballet dancer wins the lead in "Swan Lake" and is perfect for the role of the delicate White Swan - Princess Odette - but slowly loses her mind as she becomes more and more like Odile, the Black Swan.'
								),
							);

		$actors = array(
								array( 
									'post_title'   => 'George Harrison'        ,
									'post_content' => 'A master musician, a film producer and actor, best known as the lead guitarist and occasionally lead vocalist of The Beatles, George Harrison was born February 25, 1943, in Liverpool, Merseyside, England. He was also the youngest of four children, born to Harold Harrison and Louise Harrison.',
									'movies'       => array( 'Yellow Submarine' )
								),
								array( 
									'post_title'   => 'John Lennon'            ,
									'post_content' => 'John Winston (later Ono) Lennon was born on October 9, 1940, in Liverpool, England, to Julia (Stanley) and Alfred Lennon, a merchant seaman. He was of Irish, and some Welsh and English, ancestry. In the mid-1950s, he formed his first band, The Quarrymen (after Quarry Bank High School, which he attended) who, with the addition of Paul McCartney and George Harrison, later became The Beatles.',
									'movies'       => array( 'Yellow Submarine' )
								),
								array( 
									'post_title'   => 'Paul McCartney'         ,
									'post_content' => 'Sir Paul McCartney is a key figure in contemporary culture as a singer, composer, poet, writer, artist, humanitarian, entrepreneur, and holder of more than 3 thousand copyrights. He is in the "Guinness Book of World Records" for most records sold, most #1s (shared), most covered song, "Yesterday," largest paid audience for a solo concert (350,000+ people, in 1989, in Brazil). He is considered one of the most successful entertainers of all time.',
									'movies'       => array( 'Yellow Submarine' )
								),
								array( 
									'post_title'   => 'Ringo Star'         ,
									'post_content' => 'Ringo Starr is a British musician, actor, director, writer, and artist best known as the drummer of The Beatles who also coined the title "A Hard Day\'s Night" for The Beatles\' first movie.',
									'movies'       => array( 'Yellow Submarine' )
								),
								array( 
									'post_title'   => 'Danny Glover'         ,
									'post_content' => 'Actor, producer and humanitarian Danny Glover has been a commanding presence on screen, stage and television for more than 25 years.',
									'movies'       => array( 'The Color Purple' )
								),
								array( 
									'post_title'   => 'Whoopi Goldberg'         ,
									'post_content' => 'Whoopi Goldberg was born Caryn Elaine Johnson in the Chelsea section of Manhattan on November 13, 1955. Her mother, Emma (Harris), was a teacher and a nurse, and her father, Robert James Johnson, Jr., was a clergyman. Whoopi\'s recent ancestors were from Georgia, Florida, and Virginia. She worked in a funeral parlor and as a bricklayer while taking small parts on Broadway. She moved to California and worked with improv groups, including Spontaneous Combustion, and developed her skills as a stand-up comedienne. ',
									'movies'       => array( 'The Color Purple' )
								),
								array( 
									'post_title'   => 'Margaret Avery'         ,
									'post_content' => 'Slender, attractive actress Margaret Avery, spellbinding in her role of Shug in Steven Spielberg\'s The Color Purple (1985), is certainly no "one-hit wonder". Although filmgoers may be able to trace her back only to that once-in-a-lifetime part, Margaret has been a talented player on the large and small screens for well over three decades.',
									'movies'       => array( 'The Color Purple' )
								),
								array( 
									'post_title'   => 'Oprah Winfrey'         ,
									'post_content' => 'Oprah Winfrey was born Orpah Gail Winfrey in Kosciusko, Mississippi, to Vernita Lee, a former maid, and Vernon Winfrey, a coal miner, barber, and city councilman.',
									'movies'       => array( 'The Color Purple' )
								),
								array( 
									'post_title'   => 'David Niven'         ,
									'post_content' => 'David Niven was named after the Saint\'s Day on which he was born, St. David, patron Saint of Wales. He attended Stowe School and Sandhurst Military Academy and served for two years in Malta with the Highland Light Infantry. At the outbreak of World War II, although a top-line star, he re-joined the army (Rifle Brigade). He did, however, consent to play in two films during the war, both of strong propaganda value--Spitfire (1942) and The Way Ahead (1944). In spite of six years\' virtual absence from the screen, he came in second in the 1945 Popularity Poll of British film stars.',
									'movies'       => array( 'The Pink Panther' )
								),
								array( 
									'post_title'   => 'Peter Sellers'         ,
									'post_content' => 'Often credited as the greatest comedian of all time, Peter Sellers was born to a well-off English acting family in 1925. His mother and father worked in an acting company run by his grandmother. As a child, Sellers was spoiled, as his parents\' first child had died at birth. He enlisted in the Royal Air Force and served during World War II. After the war he met Spike Milligan, Harry Secombe and Michael Bentine, who would become his future workmates.',
									'movies'       => array( 'The Pink Panther' )
								),
								array( 
									'post_title'   => 'Robert Wagner'         ,
									'post_content' => 'Robert John Wagner, Jr. was born in Detroit, Michigan, to Thelma Hazel Alvera (Boe), a telephone operator, and Robert John Wagner, Sr., a traveling salesman. His paternal grandparents were German and his maternal grandparents were Norwegian. His family moved to Los Angeles when he was seven. Always wanting to be an actor, he held a variety of jobs while pursuing his goal, but it was while dining with his parents at a restaurant in Beverly Hills that he was "discovered" by a talent scout.',
									'movies'       => array( 'The Pink Panther' )
								),
								array( 
									'post_title'   => 'Capucine'         ,
									'post_content' => 'With classic patrician features and an independent, non-conformist personality, Capucine began her film debut in 1949 at the age of 21 with an appearance in the film Rendezvous in July (1949). She attended school in France and received a BA degree in foreign languages. Married for six months in her early twenties, she never remarried. In 1957, she was discovered by director Charles K. Feldman while working as a high-fashion model for Givenchy in Paris and was brought to Hollywood to study acting under Gregory Ratoff. She was put under contract by Columbia studios in 1958 and had her first leading part in the movie Song Without End (1960).',
									'movies'       => array( 'The Pink Panther' )
								),
								array( 
									'post_title'   => 'Anthony Hopkins'         ,
									'post_content' => 'Anthony Hopkins was born on December 31, 1937, in Margam, Wales, to Muriel Anne (Yeats) and Richard Arthur Hopkins, a baker. His parents were both of half Welsh and half English descent. Influenced by Richard Burton, he decided to study at College of Music and Drama and graduated in 1957. In 1965, he moved to London and joined the National Theatre, invited by Laurence Olivier, who could see the talent in Hopkins. In 1967, he made his first film for television, A Flea in Her Ear (1967).',
									'movies'       => array( 'Red Dragon', 'Meet Joe Black' )
								),
								array( 
									'post_title'   => 'Edward Norton'         ,
									'post_content' => 'Edward Harrison Norton was born on August 18, 1969, in Boston, Massachusetts, and was raised in Columbia, Maryland.',
									'movies'       => array( 'Red Dragon' )
								),
								array( 
									'post_title'   => 'Ralph Fiennes'         ,
									'post_content' => 'Ralph Twisleton Wykeham Fiennes was born on December 22, 1962 in Suffolk, England, to Jennifer Anne Mary Alleyne (Lash), a novelist, and Mark Fiennes, a photographer. He is the eldest of six children. Four of his siblings are also in the arts: Martha Fiennes, a director; Magnus Fiennes, a musician; Sophie, a producer; and Joseph Fiennes, an actor. He is of English, Irish, and Scottish origin.',
									'movies'       => array( 'Red Dragon' )
								),
								array( 
									'post_title'   => 'Harvey Keitel'         ,
									'post_content' => 'Came to prominence in the early films of Martin Scorsese after working in theatre for around a decade, particularly Mean Streets (1973) and Taxi Driver (1976). Faded into anonymity in the 1980s even though he turned in some impressive performances in films by some of America\'s leading directors. He reemergered into star status with his role as Mr. White in Quentin Tarantino\'s Reservoir Dogs (1992), Abel Ferrara\'s Bad Lieutenant (1992), The Piano (1993) 0110912.',
									'movies'       => array( 'Red Dragon', 'Reservoir Dogs' )
								),
								array( 
									'post_title'   => 'Charlton Heston'         ,
									'post_content' => 'With features chiseled in stone, and renowned for playing a long list of historical figures, particularly in Biblical epics, the tall, well built and ruggedly handsome Charlton Heston was one of Hollywood\'s greatest leading men and remained active in front of movie cameras for over sixty years.',
									'movies'       => array( 'Soylent Green' )
								),
								array( 
									'post_title'   => 'Leigh Taylor-Young'          ,
									'post_content' => 'Leigh Taylor-Young was born in Washington, DC, to a diplomat father and raised in Bloomfield Hills, Michigan, the older sister of future actress Dey Young and writer/director Lance Young. She studied classical ballet and, following high school, attended Northwestern University where she initially majored in economics. She switched gears after developing an interest in theater and apprenticed as the youngest member of the distinguished Eaglesmere Summer Repertory Theatre. Leigh eventually moved to New York with designs on a professional career and studied under acting guru Sanford Meisner at the Neighborhood Playhouse. Her major break came when she was cast in the already popular prime-time soap Peyton Place (1964).',
									'movies'       => array( 'Soylent Green' )
								),
								array( 
									'post_title'   => 'Chuck Connors'         ,
									'post_content' => 'Chuck Connors was born Kevin Joseph Connors in Brooklyn, New York, to Marcella (Londrigan) and Alban Francis "Allan" Connors. His parents were immigrants from the Dominion of Newfoundland (now part of Canada), and were of Irish descent. Chuck and his two-years-younger sister, Gloria, grew up in a working-class section of the west side of Brooklyn, where their father worked the local docks as a longshoreman.',
									'movies'       => array( 'Soylent Green' )
								),
								array( 
									'post_title'   => 'Joseph Cotten'         ,
									'post_content' => 'Joseph Cheshire Cotten, Jr. was born in Petersburg, Virginia, into a well-to-do Southern family. He was the eldest of three sons born to Sally Whitworth (Willson) and Joseph Cheshire Cotten, Sr., an assistant postmaster.',
									'movies'       => array( 'Soylent Green' )
								),
								array( 
									'post_title'   => 'Nick Nolte'         ,
									'post_content' => 'Nick Nolte was born in Omaha, Nebraska, to Helen (King) and Franklin Arthur Nolte, who worked in irrigation pump sales. He has German and British Isles ancestry. Nolte began his career on stage at the Pasadena (California) Playhouse and in regional theatre productions. His breakthrough role was in the TV mini-series Rich Man, Poor Man (1976), playing the role of "Tom/Tommy Jordache". Nick Nolte said that when he played a young man in the early scenes of the project, he weighed about 160 pounds. When he played a middle aged man in the later scenes, he weighed over 180 pounds.',
									'movies'       => array( 'The Thin Red Line' )
								),
								array( 
									'post_title'   => 'Jim Caviezel'         ,
									'post_content' => 'James Patrick Caviezel was born on September 26, 1968 in Mount Vernon, Washington. He was one of five children born to Margaret (Lavery), a former stage actress, and James Caviezel, a chiropractor. The Caviezels are a closely knit Catholic family. He is of Irish (mother) and Swiss and Slovak-Romansh (father) descent; the surname, "Caviezel", is Romansh. As a youngster, Jim was described as being "very intense." His two main interests growing up were sports and religion. He was athletically gifted on the basketball court and dreamed of someday playing in the N.B.A.',
									'movies'       => array( 'The Thin Red Line' )
								),
								array( 
									'post_title'   => 'Sean Penn'         ,
									'post_content' => 'Sean Penn is a powerhouse film performer capable of intensely moving work, who has gone from strength to strength during a colourful film career, and who has drawn much media attention for his stormy private life and political viewpoints.',
									'movies'       => array( 'The Thin Red Line' )
								),
								array( 
									'post_title'   => 'Elias Koteas'         ,
									'post_content' => 'Elias Koteas was born on March 11, 1961, in Montreal, Canada. Both his parents are of Greek descent. Elias attended Vanier College in Montreal before leaving to attend the American Academy of Dramatic Arts in New York City in 1981, of which he is a graduate. He also attended the Actors Studio in New York City, where he studied acting under Ellen Burstyn and Peter Masterson. His film debut was in One Magic Christmas (1985).',
									'movies'       => array( 'The Thin Red Line' )
								),
								array( 
									'post_title'   => 'Val Kilmer'         ,
									'post_content' => 'Val Kilmer was born in Los Angeles, to Gladys (Ekstadt) and Eugene Kilmer, a real estate developer and aerospace equipment distributor. His mother, born in Indiana, was from a Swedish family, and his father was from Texas. Val studied at Hollywood\'s Professional\'s School and, in his teens, entered Juilliard\'s drama program.',
									'movies'       => array( 'Red Planet' )
								),
								array( 
									'post_title'   => 'Carrie-Anne Moss'         ,
									'post_content' => 'Carrie-Anne Moss was born on August 21, 1967, in Vancouver, British Columbia, as youngest of two children of Barbara and Melvyn Moss. At age 20, she moved to Europe to pursue a career in modeling; in Spain she was cast in a regular role in the TV show Dark Justice (1991), which was produced in Barcelona for its first season, and she followed it to the shooting locations in Los Angeles the next year. Later she appeared in numerous commercials and TV series, including Matrix (1993), which coincidentally presaged the movie that would make her famous, as well as Models Inc. (1994) and F/X: The Series (1996).',
									'movies'       => array( 'Red Planet' )
								),
								array( 
									'post_title'   => 'Tom Sizemore'         ,
									'post_content' => 'Tom Sizemore rose in prominence throughout the 1990s, establishing himself as a memorable tough-guy actor, sought by the most respected directors in the business.',
									'movies'       => array( 'Red Planet', 'Black Hawk Down' )
								),
								array( 
									'post_title'   => 'Benjamin Bratt'         ,
									'post_content' => 'The middle of five children, Bratt hails from a close-knit family. His mother, a Peruvian Indian from Lima, moved to the U.S. at age 14. He grew up in San Francisco. ',
									'movies'       => array( 'Red Planet' )
								),
								array( 
									'post_title'   => 'Brooke Shields'         ,
									'post_content' => '"Want to know what comes between me and my Calvins? Nothing". If you have not heard of Brooke Shields before, this tagline from her Calvin Klein Jeans ad had to grab your attention. Not that she has not had a previously noteworthy resume. She was born on May 31, 1965 in New York City and, at age 12, she starred as a child prostitute in Pretty Baby (1978). Could this movie even be made today? It was considered risky and controversial in 1978. It was followed by another blockbuster, the romance adventure drama The Blue Lagoon (1980). Brooke has proved herself to be so much more than her early films. Her broad range of work as an adult would be quite an achievement for anyone, especially given how difficult transitioning from child actor to adult often is.',
									'movies'       => array( 'The Blue Lagoon' )
								),
								array( 
									'post_title'   => 'Christopher Atkins'          ,
									'post_content' => 'Christopher Atkins was born on February 21, 1961 in Rye, New York, USA as Christopher Atkins Bomann. He is an actor and writer, known for The Blue Lagoon (1980), The Pirate Movie (1982) and A Night in Heaven (1983). He was previously married to Lyn Barron.',
									'movies'       => array( 'The Blue Lagoon' )
								),
								array( 
									'post_title'   => 'Leo McKern'         ,
									'post_content' => 'Although he sounded very British, Leo McKern was an Australian. By the time he was 15 years old, he had endured an accident that left him without his left eye. A glass eye replaced it - one might conjecture for the better, as far as making McKern a one-day actor of singular focus (no pun intended; his face had that extremely focused look).',
									'movies'       => array( 'The Blue Lagoon' )
								),
								array( 
									'post_title'   => 'William Daniels'         ,
									'post_content' => 'William Daniels was born on March 31, 1927 in Brooklyn, New York, USA. He is an actor and director, known for Boy Meets World (1993), The Graduate (1967) and St. Elsewhere (1982). He has been married to Bonnie Bartlett since June 30, 1951. They have two children.',
									'movies'       => array( 'The Blue Lagoon' )
								),
								array( 
									'post_title'   => 'Mia Farrow'         ,
									'post_content' => 'Mia Farrow was born in Los Angeles, California, to director John Farrow and actress and Tarzan-girl Maureen O\'Sullivan. Her father was Australian-born (of English descent) and her mother was Irish-born (of Irish, Scottish, and English ancestry). Farrow debuted at the movies in 1959 in very small roles.',
									'movies'       => array( 'The Purple Rose of Cairo' )
								),
								array( 
									'post_title'   => 'Jeff Daniels'         ,
									'post_content' => 'Actor Jeff Daniels was born in Athens, Georgia but raised in Chelsea, Michigan. He is the son of Marjorie J. (Ferguson) and Robert Lee Daniels, who owned The Chelsea Lumber Company and was also mayor of Chelsea. Jeff attended Central Michigan University, but became involved in acting and dropped out to pursue a career as an actor.',
									'movies'       => array( 'The Purple Rose of Cairo' )
								),
								array( 
									'post_title'   => 'Danny Aiello'         ,
									'post_content' => 'Danny Aiello was born on June 20, 1933 in New York City, New York, USA as Daniel Louis Aiello Jr. He is an actor and producer, known for Léon: The Professional (1994), Do the Right Thing (1989) and Once Upon a Time in America (1984). He has been married to Sandy Cohen since January 8, 1955. They have four children.',
									'movies'       => array( 'The Purple Rose of Cairo' )
								),
								array( 
									'post_title'   => 'Nicole Kidman'         ,
									'post_content' => 'Elegant redhead Nicole Kidman, known as one of Hollywood\'s top Australian imports, was actually born in Honolulu, Hawaii. Kidman is the daughter of Australian parents, Janelle Ann (Glenny), a nursing instructor, and Antony David Kidman, a biochemist and clinical psychologist. She is of English, Irish, and Scottish descent.',
									'movies'       => array( 'Moulin Rouge' )
								),
								array( 
									'post_title'   => 'Ewan McGregor'         ,
									'post_content' => 'Ewan Gordon McGregor was born on March 31, 1971 in Crieff, Scotland, to Carol Diane (Lawson) and James Charles McGregor, both teachers. His uncle is actor Denis Lawson. At age 16, he left Crieff and Morrison Academy to join the Perth Repertory Theatre. His parents encouraged him to leave school and pursue his acting goals rather than be unhappy.',
									'movies'       => array( 'Moulin Rouge', 'Black Hawk Down' )
								),
								array( 
									'post_title'   => 'John Leguizamo'         ,
									'post_content' => 'Fast-talking and feisty-looking John Leguizamo has continued to impress movie audiences with his versatility: he can play sensitive and naïve young men, such as Johnny in Hangin\' with the Homeboys (1991); cold-blooded killers like Benny Blanco in Carlito\'s Way (1993); a heroic Navy SEAL, stopping aerial terrorists in Executive Decision (1996); and drag queen Chi-Chi Rodriguez in To Wong Foo Thanks for Everything, Julie Newmar (1995). Arguably, not since ill-fated actor and comedian Freddie Prinze starred in the smash TV series Chico and the Man (1974) has a youthful Latino personality had such a powerful impact on critics and fans alike.',
									'movies'       => array( 'Moulin Rouge' )
								),
								array( 
									'post_title'   => 'Jim Broadbent'         ,
									'post_content' => 'One of England\'s most versatile character actors, Jim Broadbent was born on May 24, 1949, in Lincolnshire, the youngest son of furniture maker Roy Laverick Broadbent and sculptress Doreen "Dee" (Findlay) Broadbent. Jim attended a Quaker boarding school in Reading before successfully applying for a place at an art school.',
									'movies'       => array( 'Moulin Rouge' )
								),
								array( 
									'post_title'   => 'Bruce Willis'         ,
									'post_content' => 'Actor and musician Bruce Willis is well known for playing wisecracking or hard-edged characters, often in spectacular action films. Collectively, he has appeared in films that have grossed in excess of $2.5 billion USD, placing him in the top ten stars in terms of box office receipts.',
									'movies'       => array( 'RED' )
								),
								array( 
									'post_title'   => 'Mary-Louise Parker'          ,
									'post_content' => 'Southern-bred Mary-Louise Parker, from Fort Jackson, South Carolina, was born on August 2, 1964, the youngest of the family\'s brood. Her parents were Caroline Louise (Morell) and John Morgan Parker, a judge who served in the U.S. army. She has Swedish (from her maternal grandfather), English, Scottish, Scotch-Irish, German, and Dutch ancestry.',
									'movies'       => array( 'RED', 'Fried Green Tomatoes' )
								),
								array( 
									'post_title'   => 'Karl Urban'         ,
									'post_content' => 'Originally from Wellington, New Zealand, Karl Urban now lives in Auckland. Born on June 7, 1972, he is the son of a leather-goods manufacturer (who had hoped that Karl would follow in his footsteps). His first acting role was when he was 8 -- he had a line on a television series. However, he did not act again until after high school.',
									'movies'       => array( 'RED' )
								),
								array( 
									'post_title'   => 'Morgan Freeman'         ,
									'post_content' => 'With an authoritative voice and calm demeanor, this ever popular American actor has grown into one of the most respected figures in modern US cinema. Morgan was born in June 1937 in Memphis, Tennessee, to Mayme Edna (Revere), a teacher, and Morgan Porterfield Freeman, a barber.',
									'movies'       => array( 'RED' )
								),
								array( 
									'post_title'   => 'Patrick Swayze'         ,
									'post_content' => 'Patrick Wayne Swayze was born on August 18, 1952 in Houston, Texas, to Patsy Yvonne Helen (Karnes) and Jesse Wayne Swayze, a chemical plant engineer draftsman. His mother, choreographer Patsy Swayze, owned a dance school in Houston, where Patrick was also a student. His father passed away in 1982.',
									'movies'       => array( 'Red Dawn' )
								),
								array( 
									'post_title'   => 'C. Thomas Howell'         ,
									'post_content' => 'After an eye-catching performance in the teen coming-of-age epic The Outsiders (1983), ex-child rodeo star C. Thomas Howell was one of the most promising young actors in the mid 1980s. Christopher Thomas Howell was born in Los Angeles, California, to Candice (Webb) and Chris Howell, a professional bull rider turned stuntman.',
									'movies'       => array( 'Red Dawn' )
								),
								array( 
									'post_title'   => 'Lea Thompson'         ,
									'post_content' => 'Lea Katherine Thompson was born on May 31, 1961, in Rochester, Minnesota. She is the youngest of five children. Her parents are Barbara Anne (Barry) and Clifford Elwin "Cliff" Thompson. Since all her siblings were much older than she, Lea says it seemed like she had more than two parents.',
									'movies'       => array( 'Red Dawn' )
								),
								array( 
									'post_title'   => 'Charlie Sheen'         ,
									'post_content' => 'Charlie Sheen was born Carlos Irwin Estévez on September 3, 1965, in New York City. His father, Martin Sheen, at the time was an actor just breaking into the business with performances on Broadway.',
									'movies'       => array( 'Red Dawn' )
								),
								array( 
									'post_title'   => 'Malcolm McDowell',
									'post_content' => 'Malcolm John Taylor was born on June 13, 1943 in Leeds, England, to working-class parents Edna (McDowell), a hotelier, and Charles Taylor, a publican. His father was an alcoholic. Malcolm hated his parents\' ways. His father was keen to send his son to private school to give him a good start in life, so Malcolm was packed off to boarding school at age 11. He attended the Tunbridge Boarding School and the Cannock House School in Eltham, Kent. At school, he was beaten with the slipper or cane every Monday for his waywardness. Whilst at school, he decided that he wanted to become an actor; it was also around this time that his love for race cars began. He attended the London Academy of Music and Art to study acting. Meanwhile, he worked at his parents\' pub but lost his job when the pub went bankrupt, his father drinking all the profits. He then had a variety of jobs, from coffee salesman to messenger.',
									'movies'       => array( 'A Clock Work Orange' )
								),
								array( 
									'post_title'   => 'Patrick Magee',
									'post_content' => 'Born in Armagh, Northern Ireland, Patrick Magee is a classic example of how certain actors rate the stage far more highly than the screen. Magee was well aware that the vast majority of the films that he appeared in were dreadful (he mostly played sinister villains in horror films), but the money came in very handy in financing his distinguished stage work (he was a favorite actor of Samuel Beckett one of whose greatest plays, \'Krapp\'s Last Tape\', was written specifically for him). However, he did do some outstanding work on film, most notably in Stanley Kubrick\'s A Clockwork Orange (1971) as the crippled writer Mr.Alexander, and in Kubrick\'s Barry Lyndon (1975), as the chevalier. He also appeared in Joseph Losey\'s The Servant (1963), Peter Brook\'s Marat/Sade (1967) and William Friedkin\'s The Birthday Party (1968). He also appeared in films by such cult directors as Roger Corman, Lucio Fulci and Walerian Borowczyk.',
									'movies'       => array( 'A Clock Work Orange' )
								),
								array( 
									'post_title'   => 'Michael Bates',
									'post_content' => 'Michael Bates was born on December 4, 1920 in Jhansi, Uttar Pradesh, British India. He was an actor, known for A Clockwork Orange (1971), Patton (1970) and It Ain\'t Half Hot Mum (1974). He died on January 11, 1978 in Cambridge, Cambridgeshire, England.',
									'movies'       => array( 'A Clock Work Orange' )
								),
								array( 
									'post_title'   => 'Warren Clarke',
									'post_content' => 'Lancashire-born Warren Clarke was an actor of immense presence and considerable versatility who turned his wide-shouldered, robust appearance and lived-in, hangdog facial features into an asset. For more than two and a half decades he had toiled in a wide variety of supporting roles before finding international success as the often crude, irascible, heavy-drinking Superintendant Andy Dalziel in TV\'s Dalziel and Pascoe (1996). When the series began, Clarke had summed up Dalziel as \'a beer-swilling chauvinist pig\', but the character evolved and became more complex and endearing (in a curmudgeonly sort of way) over the show\'s eleven-year duration. There were also commonalities between the actor and his creation: impatience, a reputation for not tolerating fools gladly; a humorous, irreverent nature and a shared dislike for political correctness. In private life, Clarke was passionate about football (a lifelong Manchester City supporter) and golf.',
									'movies'       => array( 'A Clock Work Orange' )
								),
								array( 
									'post_title'   => 'John Belushi',
									'post_content' => 'John Belushi was born in Chicago, Illinois, USA, on January 24, 1949, to Agnes Demetri (Samaras) and Adam Anastos Belushi, a restaurant owner. His father was an Albanian immigrant, from Qytezë, and his mother was also of Albanian descent. He grew up in Wheaton, where the family moved when he was six.',
									'movies'       => array( 'The Blues Brothers' )
								),
								array( 
									'post_title'   => 'Dan Aykroyd',
									'post_content' => 'Daniel Edward Aykroyd was born on July 1, 1952 in Ottawa, Ontario, Canada, to Lorraine Hélène (Gougeon), a secretary from a French-Canadian family, and Samuel Cuthbert Peter Hugh Aykroyd, a civil engineer who advised prime minister Pierre Trudeau. Aykroyd attended Carleton University in 1969, where he majored in Criminology and Sociology, but he dropped out before completing his degree. He worked as a comedian in various Canadian nightclubs and managed an after-hours speakeasy, Club 505, in Toronto for several years. He worked with Second City Stage Troupe in Toronto and started his acting career at Carleton University with Sock\'n\'Buskin, the campus theater/drama club. Married to Donna Dixon since 1983, he has two daughters. His parents are named Peter and Lorraine and his brother Peter Aykroyd is a psychic researcher. Dan received an honorary Doctorate from Carleton University in 1994 and was made a Member of the Order of Canada in 1998.',
									'movies'       => array( 'The Blues Brothers' )
								),
								array( 
									'post_title'   => 'James Brown',
									'post_content' => 'James Brown was born on May 3, 1933 in Barnwell, South Carolina, USA as James Joseph Brown. He was married to Tomirae Brown, Adrienne Rodriguez, Deidre Jenkins and Velma Warren. He died on December 25, 2006 in Atlanta, Georgia, USA.',
									'movies'       => array( 'The Blues Brothers' )
								),
								array( 
									'post_title'   => 'Cab Calloway',
									'post_content' => 'Bandleader, songwriter ("Minnie the Moocher", "Are You Hep to That Jive?"), composer, singer, actor and author, educated at Crane College. While studying law, he sang with the band The Alabamians, and took over the group in 1928. He led The Missourians orchestra, then organized and led his own orchestra, playing at hotels, theaters and nightclubs throughout the US, and making many records. He joined the cast of the touring company of "Porgy and Bess", which performed across the USA and Europe between 1952 and 1954.',
									'movies'       => array( 'The Blues Brothers' )
								),
								// Black Hawk Down: Ewan McGregor and Tom Sizemore in other movies
								array( 
									'post_title'   => 'Josh Hartnett',
									'post_content' => 'Josh Hartnett was born in Saint Paul, Minnesota, to Wendy Anne (Kronstedt) and Daniel Thomas Hartnett, a building manager. His father is of Irish and German descent, and his mother is of Swedish and Norwegian ancestry. Hartnett graduated from South High School in Minneapolis in June of 1996, then attended SUNY Purchase in New York.',
									'movies'       => array( 'Black Hawk Down' )
								),
								array( 
									'post_title'   => 'Eric Bana',
									'post_content' => 'Eric Bana was born Eric Banadinovic on August 9, 1968, in Melbourne, Victoria, Australia. He is the younger of two brothers. His father, named Ivan Banadinovic, came from Zagreb, Croatia, and worked as a manager for Caterpillar Inc. His mother, named Eleanor Banadinovic, came from a German family and was a hairdresser.',
									'movies'       => array( 'Black Hawk Down' )
								),
								array( 
									'post_title'   => 'Thomas Jane',
									'post_content' => 'Thomas Jane was born on February 22, 1969 in Baltimore, Maryland, USA as Thomas Elliott. He is an actor and producer, known for The Mist (2007), Deep Blue Sea (1999) and Dreamcatcher (2003). He was previously married to Patricia Arquette and Ayesha Hauer.',
									'movies'       => array( 'Deep Blue Sea' )
								),
								array( 
									'post_title'   => 'Saffron Burrows',
									'post_content' => 'Saffron Burrows was born on October 22, 1972 in London, England as Saffron Domini Burrows. She is an actress, known for The Bank Job (2008), Deep Blue Sea (1999) and Troy (2004). She has been married to Alison Balian since August 2013. They have one child.',
									'movies'       => array( 'Deep Blue Sea' )
								),
								array( 
									'post_title'   => 'Samuel L. Jackson',
									'post_content' => 'Samuel L. Jackson was born in Washington, D.C., to Elizabeth (Montgomery) and Roy Henry Jackson. He was raised by his mother, a factory worker. Jackson was active in the black student movement. In the seventies, he joined the Negro Ensemble Company (together with Morgan Freeman). ',
									'movies'       => array( 'Deep Blue Sea' )
								),
								array( 
									'post_title'   => 'Jacqueline McKenzie',
									'post_content' => 'Jacqueline McKenzie was born on October 24, 1967 in Sydney, New South Wales, Australia as Jacqueline Susan McKenzie. She is an actress and director, known for Deep Blue Sea (1999), The 4400 (2004) and Romper Stomper (1992).',
									'movies'       => array( 'Deep Blue Sea' )
								),
								array( 
									'post_title'   => 'Richard Carlson',
									'post_content' => 'The son of an attorney, Richard Carlson had an introspective quality to his performances and looked every inch the academic he first aspired to be. Following his graduation from the University of Minnesota with a Master\'s Degree in English, the tall, dark-haired youth had a brief stint as a drama teacher at his alma mater.',
									'movies'       => array( 'Creature from the Black Lagoon' )
								),
								array( 
									'post_title'   => 'Julie Adams',
									'post_content' => 'Born in Iowa, Betty May Adams grew up in Arkansas and made her acting debut in a third grade play, "Hansel and Gretel". When she grew up and decided to become an actress, she moved to California, where she worked three days a week as a secretary (to support herself) and spent the remainder of her time taking speech lessons and making the rounds at the various studios\' casting departments. Her first movie role was playing a starlet, appropriately enough, in Paramount\'s Red, Hot and Blue (1949), followed by a leading role in the Lippert Western The Dalton Gang (1949). Over a period of five weeks, she appeared in six more quickie Lippert Westerns. Adams\' first big show biz break was at Universal, when she appeared in a screen test opposite All-American footballer Leon Hart, a Detroit Lions end. It was Hart who was being considered by the studio, but the gridiron star flopped while Universal execs flipped over Adams. The studio changed her first name from Betty to Julia (and later to Julie).',
									'movies'       => array( 'Creature from the Black Lagoon' )
								),
								array( 
									'post_title'   => 'Richard Denning',
									'post_content' => 'Born in Poughkeepsie, New York, Louis Albert Denninger Jr. was the son of a garment manufacturer who relocated and set up shop in Los Angeles when Louis Jr. was 18 months old. After finishing school, Denninger enrolled at Woodbury Business College and majored in business and accounting, graduating cum laude with a master\'s in business',
									'movies'       => array( 'Creature from the Black Lagoon' )
								),
								array( 
									'post_title'   => 'Antonio Moreno',
									'post_content' => 'A serious rival to Rudolph Valentino as the smouldering \'Latin Lover\' type was black-haired Spanish-born Antonio Moreno. One of the most prominent screen stars of the 1920\'s, he was equally adept at romance, melodrama or comedy and appeared opposite most of the legendary movie queens of the era, from the Gish sisters to Greta Garbo, to Gloria Swanson and Mary Pickford.',
									'movies'       => array( 'Creature from the Black Lagoon' )
								),
								array( 
									'post_title'   => 'Ryan Reynolds',
									'post_content' => 'Ryan Rodney Reynolds was born on October 23, 1976 in Vancouver, British Columbia, Canada, the youngest of four children. His father, Jim, was a food wholesaler and his mother, Tammy, was a retail-store saleswoman. Between 1991-93, Ryan appeared in Fifteen (1990), a Nickleodeon series taped in Florida with many other Canadian actors. After the series ended, he returned to Vancouver where he played in a series of forgettable television movies. He did small roles in Glenn Close\'s Serving in Silence: The Margarethe Cammermeyer Story (1995) and CBS\'s update of In Cold Blood (1996). However, his run of luck had led him to decide to quit acting.',
									'movies'       => array( 'Green Lantern' )
								),
								array( 
									'post_title'   => 'Blake Lively',
									'post_content' => 'Blake Lively was born Blake Ellender Brown in Tarzana, California, to a show business family. Her mother, Elaine Lively (née McAlpin), is an acting coach and talent manager, and her father, Ernie Lively (born Ernest Wilson Brown, Jr.), is an actor and teacher. Her brother is actor Eric Lively, and her half-siblings are actors Lori Lively, Robyn Lively and Jason Lively. She followed her parents\' and siblings\' steps. Her first role was Trixie, the Tooth Fairy in the musical movie Sandman (1998), directed by her father. Her big break came along a few years later, though. Blake was up to finish high school when she got the co-starring role of Bridget in The Sisterhood of the Traveling Pants (2005).',
									'movies'       => array( 'Green Lantern' )
								),
								array( 
									'post_title'   => 'Peter Sarsgaard',
									'post_content' => 'Peter Sarsgaard was born at Scott Air Force Base, Illinois, to Judy Lea (Reinhardt) and John Dale Sarsgaard, an engineer who worked for the Air Force and later Monsanto and IBM. He is a graduate of St. Louis\' Washington University, where he majored in history and literature. He was a co-founder of the comedy improvisational group Mama\'s Pot Roast and trained initially with the Actors\' Studio in New York. Such off-Broadway productions included Horton Foote\'s "Laura Dennis" and John Cameron Mitchell\'s "Kingdom of Earth."',
									'movies'       => array( 'Green Lantern' )
								),
								array( 
									'post_title'   => 'Mark Strong',
									'post_content' => 'British actor Mark Strong, who played Jim Prideaux in the 2011 remake of Tinker Tailor Soldier Spy (2011), is often cast as cold, calculating villains. But before he became a famous actor, he intended to pursue a career in law.',
									'movies'       => array( 'Green Lantern' )
								),
								array( 
									'post_title'   => 'John Wayne',
									'post_content' => 'John Wayne was born Marion Robert Morrison in Iowa, to Mary Alberta (Brown) and Clyde Leonard Morrison, a pharmacist. He was of English, Scots-Irish, and Irish ancestry.',
									'movies'       => array( 'She Wore a Yellow Ribbon' )
								),
								array( 
									'post_title'   => 'Joanne Dru',
									'post_content' => 'The daughter of a West Virginia druggist, Joanne Dru came to New York in 1940. In New York she worked as a model and was cast by Al Jolson as one of the showgirls in his Broadway play "Hold Onto Your Hats." When the show closed in 1941, she married popular singer Dick Haymes and went with him to Hollywood. Discovered by a talent scout while working in the theater, Joanne made her screen debut in Abie\'s Irish Rose (1946), and that picture almost ended her career. Two years later she "redeemed" herself with her role in the classic Howard Hawks western Red River (1948). She followed that with another western, John Ford\'s She Wore a Yellow Ribbon (1949), again playing opposite John Wayne. Unfortunately, her success in those two classics resulted in the scripts being submitted to her consisting of mostly westerns, and she got typecast (this from a woman who said, "I simply hated horses...").',
									'movies'       => array( 'She Wore a Yellow Ribbon' )
								),
								array( 
									'post_title'   => 'John Agar',
									'post_content' => 'John Agar was born in Chicago, the eldest of four children. In World War II, Sgt. John Agar was a United States Army Air Force physical instructor. His 1945 marriage at the Wilshire Memorial Church to "America\'s Sweetheart" Shirley Temple put him in the public eye for the first time, and a movie contract with independent producer David O. Selznick quickly ensued.',
									'movies'       => array( 'She Wore a Yellow Ribbon' )
								),
								array( 
									'post_title'   => 'Ben Johnson',
									'post_content' => 'Born in Oklahoma, Ben Johnson was a ranch hand and rodeo performer when, in 1940, Howard Hughes hired him to take a load of horses to California. He decided to stick around (the pay was good), and for some years was a stunt man, horse wrangler, and double for such stars as John Wayne, Gary Cooper and James Stewart. His break came when John Ford noticed him and gave him a part in an upcoming film, and eventually a star part in Wagon Master (1950). He left Hollywood in 1953 to return to rodeo, where he won a world roping championship, but at the end of the year he had barely cleared expenses. The movies paid better, and were less risky, so he returned to the west coast and a career that saw him in over 300 movies.',
									'movies'       => array( 'She Wore a Yellow Ribbon' )
								),
								array( 
									'post_title'   => 'Chris Farley',
									'post_content' => 'Christopher Crosby Farley was born on February 15, 1964, in Madison, Wisconsin, to Mary Anne (Crosby) and Thomas Farley, who owned an oil company. Among his siblings are actors Kevin P. Farley and John Farley. He was of Irish heritage. Farley studied theatre and communications on Marquette University. After finishing University Chris was in the cast of the Second City Theatre, where he was discovered by the producer of the great comedy-show Saturday Night Live (1975), Lorne Michaels. Chris worked on Saturday Night Live (1975) for five years during which he appeared in movies like Wayne\'s World (1992), Coneheads (1993), Billy Madison (1995) and finally Tommy Boy (1995), with his comic partner and SNL cast member David Spade. The duo later made one more movie called Black Sheep (1996). From that time on, Chris was one of the big comedy stars, and his fame was growing and growing.',
									'movies'       => array( 'Black Sheep' )
								),
								array( 
									'post_title'   => 'David Spade',
									'post_content' => 'Comic brat extraordinaire David Spade was born on July 22, 1964, in Birmingham, Michigan, the youngest of three brothers. He is the son of Judith J. (Meek), a writer and editor, and Wayne M. Spade, a sales rep, and is of German, English, Irish, and Scottish descent. Raised in both Scottsdale (from age four) and Casa Grande, Arizona, he graduated with a degree in business from Arizona State University in 1986. A natural prankster most of his life, Spade was pushed immediately into stand-up comedy by friends and appeared in nightclubs and college campuses all over the country.',
									'movies'       => array( 'Black Sheep' )
								),
								array( 
									'post_title'   => 'Tim Matheson',
									'post_content' => 'Tim Matheson is an American actor, director and producer perhaps best known for his portrayal of the smooth talking \'Eric "Otter" Stratton\' in the 1978 comedy "Animal House," but has had a variety of other well-known roles both before and since including critical accolades for his playing \'Vice President John Hoynes\' on the television series, "The West Wing," which garnered him two Primetime Emmy award nominations for Best Guest Star in a Drama Series. From 2011 0 2015, Matheson starred as \'Dr. Brick Breeland\' in The CW series, "Hart of Dixie," opposite Rachel Bilson.',
									'movies'       => array( 'Black Sheep' )
								),
								array( 
									'post_title'   => 'Christine Ebersole',
									'post_content' => 'Christine Ebersole was born in Chicago, Illinois, to Marian Esther (Goodley) and Robert Amos Ebersole, a steel company president. She won the 2007 Tony Award for Best Actress in a Musical for her work in "Grey Gardens". Previously, she was awarded the Drama Desk Award, the Outer Critics Circle Award, the Drama League awarded her both a citation and the Outstanding Performance of the Year, and she was named to its dais for 2007. She also received a special citation from the New York Drama Critics\' Circle and the Obie for her off-Broadway turn in "Grey Gardens".',
									'movies'       => array( 'Black Sheep' )
								),
								array( 
									'post_title'   => 'Sean Connery',
									'post_content' => 'Thomas Sean Connery was born on August 25, 1930 in Fountainbridge, Edinburgh. His mother, Euphamia McBain (Maclean), was a cleaning lady, and his father, Joseph Connery, was a factory worker and truck driver. He also has a brother named Neil Connery, who works as a plasterer in Edinburgh. He is of Irish and Scottish descent. Before going into acting, Sean had many different jobs, such as a Milkman, lorry driver, a laborer, artist\'s model for the Edinburgh College of Art, coffin polisher and bodybuilder. He also joined the Royal Navy, but was later discharged because of medical problems. At the age of 23, he had a choice between becoming a professional footballer or an actor, and even though he showed much promise in the sport, he chose acting and said it was one of his more intelligent moves.',
									'movies'       => array( 'The Hunt for Red October', 'Goldfinger' )
								),
								array( 
									'post_title'   => 'Alec Baldwin',
									'post_content' => 'Raven-haired, suavely handsome and prolific actor Alec Baldwin was born on April 3, 1958 in Massapequa, New York, and is the oldest, and easily the best-known, of the four Baldwin brothers in the acting business (the others are Stephen Baldwin, William Baldwin and Daniel Baldwin).',
									'movies'       => array( 'The Hunt for Red October' )
								),
								array( 
									'post_title'   => 'Scott Glenn',
									'post_content' => 'Scott Glenn was born January 26, 1941, in Pittsburgh, Pennsylvania, to Elizabeth and Theodore Glenn, a salesman. As he grew up in Appalachia, his health was poor; he was bedridden for a year and doctors predicted he would limp for the rest of his life. During long periods of illness, Glenn was reading a lot and "dreaming of becoming Lord Byron". He challenged his illness by intense training programs and eventually got rid of his limp.',
									'movies'       => array( 'The Hunt for Red October' )
								),
								array( 
									'post_title'   => 'Sam Neill',
									'post_content' => 'Sam Neill was born in Northern Ireland, to army parents, an English-born mother, Priscilla Beatrice (Ingham), and a New Zealand-born father, Dermot Neill. His family returned to the South Island of New Zealand in 1954. He went to boarding schools and then attended the universities at Canterbury and Victoria. He has a BA in English Literature. Following his graduation, he worked with the New Zealand Players and other theater groups. He also was a film director, editor and scriptwriter for the New Zealand National Film Unit for 6 years.',
									'movies'       => array( 'The Hunt for Red October' )
								),
								// Meet Joe Black: Anthony Hopkins in other movies
								array( 
									'post_title'   => 'Brad Pitt',
									'post_content' => 'An actor and producer known as much for his versatility as he is for his handsome face, Golden Globe-winning actor Brad Pitt\'s most widely recognized role may be Tyler Durden in Fight Club (1999). But his portrayals of Billy Beane in Moneyball (2011), and Rusty Ryan in the remake of Ocean\'s Eleven (2001) and its sequels, also loom large in his filmography.',
									'movies'       => array( 'Meet Joe Black' )
								),
								array( 
									'post_title'   => 'Claire Forlani',
									'post_content' => 'Claire Forlani was born in the United Kingdom and grew up in London. Educated at Arts Educational School, she moved to the United States with her parents Pier Luigi and Barbara Forlani when she was 19 and began starring in films.',
									'movies'       => array( 'Meet Joe Black' )
								),
								array( 
									'post_title'   => 'Jake Weber',
									'post_content' => 'Jake Weber was born on March 19, 1964 in London, England as Jake T. Weber. He is an actor, known for Dawn of the Dead (2004), Medium (2005) and Meet Joe Black (1998). He was previously married to Diane Weber.',
									'movies'       => array( 'Meet Joe Black' )
								),
								// Reservoir Dogs: Harvey Keitel
								// TODO: I want to get all the character color names in here
								array( 
									'post_title'   => 'Tim Roth',
									'post_content' => 'Often mistaken for an American because of his skill at imitating accents, actor Tim Roth was born Timothy Simon Smith in London, England on May 14, 1961. His mother, Ann, was a teacher and landscape painter. His father, Ernie, was a journalist who changed the family name to "Roth"; Ernie had been in Brooklyn, New York, to an immigrant family of Irish ancestry.',
									'movies'       => array( 'Reservoir Dogs' )
								),
								array( 
									'post_title'   => 'Michael Madsen',
									'post_content' => 'Michael Madsen\'s long career spans 25 years and more than 170 films in which he has played memorable characters in myriad box office hits, including: Kill Bill: Vol. 1 (2003), Kill Bill: Vol. 2 (2004) Sin City (2005), Hell Ride (2008), Die Another Day (2002), Donnie Brasco (1997), Species (1995), The Getaway (1994), Thelma & Louise (1991), and Free Willy (1993). Michael is notably recognized for his role as Mr. Blonde, in Quentin Tarantino\'s Reservoir Dogs (1992).',
									'movies'       => array( 'Reservoir Dogs' )
								),
								array( 
									'post_title'   => 'Chris Penn',
									'post_content' => 'Born on October 10, 1965 in Los Angeles, California, Penn\'s parents both worked in film. His father Leo Penn was an actor-turned-director, and his mother Eileen Ryan was an actress. The youngest of three brothers, (the other two being Michael Penn and Sean Penn) Penn set out to follow in his parents\' footsteps. He started acting at age 12 in the Loft Studio. While in high school he and his brother Sean made several shorts with their classmates, which included such would-be stars as Emilio Estevez and Rob Lowe. Penn made his onscreen debut in the Christopher Cain movie, Charlie and the Talking Buzzard (1979). After a few years Penn caught the eye of acclaimed director Francis Ford Coppola, who cast him in a supporting role in the teen drama Rumble Fish (1983). Although the film was a flop critically and commercially, Penn\'s career was well under way.',
									'movies'       => array( 'Reservoir Dogs' )
								),
								array( 
									'post_title'   => 'Steve Buscemi',
									'post_content' => 'Steve Buscemi was born in Brooklyn, New York, to Dorothy (Wilson), a restaurant hostess, and John Buscemi, a sanitation worker. He is of Italian (father) and English, Dutch, and Irish (mother) descent. He became interested in acting during his last year of high school. After graduating, he moved to Manhattan to study acting with John Strasberg. He began writing and performing original theatre pieces with fellow actor/writer Mark Boone Junior. This led to his being cast in his first lead role in Parting Glances (1986). Since then, he has worked with many of the top filmmakers in Hollywood, including Quentin Tarantino, Jerry Bruckheimer, and The Coen Brothers. He is a highly respected actor.',
									'movies'       => array( 'Reservoir Dogs' )
								),
								array( 
									'post_title'   => 'Edward Bunker',
									'post_content' => '',
									'movies'       => array( 'Reservoir Dogs' )
								),
								array( 
									'post_title'   => 'Quentin Tarantino',
									'post_content' => 'Edward Bunker was born on December 31, 1933 in Hollywood, Los Angeles, California, USA as Edward Heward Bunker. He was an actor and writer, known for Reservoir Dogs (1992), Runaway Train (1985) and Animal Factory (2000). He was married to Jennifer Steele. He died on July 19, 2005 in Burbank, California',
									'movies'       => array( 'Reservoir Dogs' )
								),
								// Fried Green Tomatoes: Mary-Louise Parker in other movies
								array( 
									'post_title'   => 'Kathy Bates',
									'post_content' => 'Multi-talented Kathleen Doyle Bates was born on June 28, 1948, and raised in Memphis, Tennessee. The youngest of three girls, her father was Langdon Doyle Bates, a mechanical engineer, and her mother, Bertye Kathleen (Talbot), a homemaker. Kathy has English, as well as Irish, Scottish, and German, ancestry, and one of her ancestors, an Irish emigrant to New Orleans, once served as President Andrew Jackson\'s doctor.',
									'movies'       => array( 'Fried Green Tomatoes' )
								),
								array( 
									'post_title'   => 'Mary Stuart Masterson',
									'post_content' => 'Mary Stuart Masterson started acting before the age of ten, when she appeared in The Stepford Wives (1975) in 1975 with her father. Afterwards, at the direction of her parents, Mary Stuart led a life outside of the limelight, attending school in New York. She appeared in a few productions at New York\'s Dalton School.',
									'movies'       => array( 'Fried Green Tomatoes' )
								),
								array( 
									'post_title'   => 'Jessica Tandy',
									'post_content' => 'A beloved, twinkly blue-eyed doyenne of stage and screen, actress Jessica Tandy\'s career spanned nearly six and a half decades. In that course of time, she enjoyed an amazing film renaissance at age 80, something unheard of in a town that worships youth and nubile beauty. She was born Jessie Alice Tandy in London in 1909, the daughter of Jessie Helen (Horspool), the head of a school for mentally handicapped children, and Harry Tandy, a traveling salesman. Her parents enrolled her as a teenager at the Ben Greet Academy of Acting where she showed immediate promise. She was 16 when she made her professional bow as Sara Manderson in the play "The Manderson Girls", and was subsequently invited to join the Birmingham Repertory Theatre. Within a couple of years, Jessica was making a number of other debuts as well.',
									'movies'       => array( 'Fried Green Tomatoes' )
								),
								array( 
									'post_title'   => 'Kelly Reno',
									'post_content' => 'The son of cattle ranchers Bud and Ruth, Reno had been riding horses since he could walk. This experience qualified him for his role in The Black Stallion (1979), which he tried out for when his mother learned of the open audition. Both of his parents accompanied him to the filming location, and enjoyed the experience, but it was also disruptive to the family life. Kelly only appeared in three films before high school graduation in 1984. After graduation, he planned on acting more, and acquired a new agent. His plans were put on hold when his pickup truck was hit by an 18-wheeler and he suffered severe injuries. After a long recovery period he had lost most of his film connections. Reno is now a certified truck driver, and drives an 18-wheeler like the one that ended his acting career. He has three children from his first marriage.',
									'movies'       => array( 'The Black Stallion' )
								),
								array( 
									'post_title'   => 'Mickey Rooney',
									'post_content' => 'Mickey Rooney was born Joe Yule Jr. on September 23, 1920 in Brooklyn, New York. He first took the stage as a toddler in his parents vaudeville act at 17 months old. He made his first film appearance in 1926. The following year, he played the lead character in the first Mickey McGuire short film. It was in this popular film series that he took the stage name Mickey Rooney. Rooney reached new heights in 1937 with A Family Affair, the film that introduced the country to Andy Hardy, the popular all-American teenager. This beloved character appeared in nearly 20 films and helped make Rooney the top star at the box office in 1939, 1940 and 1941. Rooney also proved himself an excellent dramatic actor as a delinquent in Boys Town (1938) starring Spencer Tracy. In 1938, he was awarded a Juvenile Academy Award.',
									'movies'       => array( 'The Black Stallion' )
								),
								array( 
									'post_title'   => 'Teri Garr',
									'post_content' => 'Teri Garr can claim a career in show business by birthright. She was born in Lakewood, Ohio, the daughter of Eddie Garr (born Edward Leo Gonnoud), a Broadway stage and film actor, and Phyllis Garr (née Emma Schmotzer), a dancer. Her maternal grandparents were Austrian, and her father was of Irish descent.',
									'movies'       => array( 'The Black Stallion' )
								),
								array( 
									'post_title'   => 'Clarence Muse',
									'post_content' => 'Clarence Muse was born on October 14, 1889 in Baltimore, Maryland, USA. He was an actor, known for Shadow of a Doubt (1943), The Black Stallion (1979) and Car Wash (1976). He was married to Irene Ena Kellman, Willabelle Burch West and Ophelia Belle Labertier. He died on October 13, 1979 in Perris, California, USA.',
									'movies'       => array( 'The Black Stallion' )
								),
								array( 
									'post_title'   => 'Demi Moore',
									'post_content' => 'Demi Moore was born 1962 in Roswell, New Mexico. Her father, Charles Foster Harmon, Sr., left her mother, Virginia Beverly (King), before Demi was born. Her stepfather, Danny Guynes, did not add much stability to her life, either. He frequently changed jobs and made the family move a total of 40 times.',
									'movies'       => array( 'The Scarlet Letter' )
								),
								array( 
									'post_title'   => 'Gary Oldman',
									'post_content' => 'Gary Oldman was born on March 21, 1958 in London, England, the son of Kathleen (Cheriton), a homemaker, and Leonard Bertram Oldman, a welder. For most of his career he was best-known for playing over-the-top antagonists, though he has recently reached a new audience with heroic roles in the Harry Potter and Dark Knight franchises.',
									'movies'       => array( 'The Scarlet Letter' )
								),
								array( 
									'post_title'   => 'Robert Duvall',
									'post_content' => 'Veteran actor and director Robert Selden Duvall was born on January 5, 1931, in San Diego, CA, to Mildred Virginia (Hart), an amateur actress, and William Howard Duvall, a career military officer who later became an admiral. Duvall majored in drama at Principia College (Elsah, IL), then served a two-year hitch in the army after graduating in 1953. He began attending The Neighborhood Playhouse School of the Theatre In New York City on the G.I. Bill in 1955, studying under Sanford Meisner along with Dustin Hoffman, with whom Duvall shared an apartment. Both were close to another struggling young actor named Gene Hackman.',
									'movies'       => array( 'The Scarlet Letter' )
								),
								array( 
									'post_title'   => 'Lisa Andoh',
									'post_content' => 'Lisa Andoh is known for her work on Drive (2011), Rabbit Hole (2010) and Lonelygirl15 (2006).',
									'movies'       => array( 'The Scarlet Letter' )
								),
								// Goldfinger: Sean Connery in other movies
								array( 
									'post_title'   => 'Honor Blackman',
									'post_content' => 'Comparing this sultry-eyed blonde to Greta Garbo and Marlene Dietrich may seem a bit overzealous, but Honor Blackman\'s stylish allure over the years cannot be denied. One of four children, Blackman was born in London\'s East End to a statistician father employed with the civil service and a homemaker mother.',
									'movies'       => array( 'Goldfinger' )
								),
								array( 
									'post_title'   => 'Gert Fröbe',
									'post_content' => 'Tall, portly built German born actor (and talented violinist) who notched up over 100 film appearances, predominantly in German-language productions. He will forever be remembered by Western audiences as the bombastic megalomaniac "Auric Goldfinger" trying to kill Sean Connery and irradiate the vast US gold reserves within Fort Knox in the spectacular "James Bond" film Goldfinger (1964). However, due to Fröbe\'s thick German accent, his voice was actually dubbed by English actor, Michael Collins.',
									'movies'       => array( 'Goldfinger' )
								),
								array( 
									'post_title'   => 'Shirley Eaton',
									'post_content' => 'Long before Bea Arthur, Estelle Getty and company showed up in 80s TV households, Hollywood had, in effect, its own original "Golden Girl"...literally...in the form of stunning British actress Shirley Eaton. Although she found definitive cult stardom in 1964 with her final golden moment in a certain "007" film, Shirley was hardly considered an "overnight success". For nearly a decade, she had been out and about uplifting a number of 1950s and early 1960s British dramatic films and slapstick farce. Shirley became quite a sought-after actress internationally but, by the end of the decade, the dark-browed blonde beauty intentionally bade Hollywood and her acting career a fond and permanent farewell. She has never looked back.',
									'movies'       => array( 'Goldfinger' )
								),
								array( 
									'post_title'   => 'Roger Moore',
									'post_content' => 'Roger Moore will perhaps always be remembered as the man who replaced Sean Connery in the James Bond series, arguably something he never lived down. Roger George Moore was born on October 14, 1927 in Stockwell, London, England, the son of Lillian (Pope) and George Alfred Moore, a policeman. He first wanted to be an artist, but got into films full time after becoming an extra in the late 1940s. Moore also served in the British military during the Second World War. He came to America in 1953. Suave, extremely handsome, and an excellent actor, he got a contract with MGM . His initial foray met with mixed success, with movies like Diane (1956) and Interrupted Melody (1955), as well as The Last Time I Saw Paris (1954).',
									'movies'       => array( 'The Man with the Golden Gun' )
								),
								array( 
									'post_title'   => 'Christopher Lee',
									'post_content' => 'Sir Christopher Frank Carandini Lee was perhaps the only actor of his generation to have starred in so many films. Although most notable for personifying bloodsucking vampire, Dracula, on screen, he portrayed other varied characters on screen, most of which were villains, whether it be Francisco Scaramanga in the James Bond film, The Man with the Golden Gun (1974), or Count Dooku in Star Wars: Episode II - Attack of the Clones (2002), or as the title monster in the Hammer Horror film, The Mummy (1959).',
									'movies'       => array( 'The Man with the Golden Gun' )
								),
								array( 
									'post_title'   => 'Britt Ekland',
									'post_content' => 'Britt Ekland was born in Sweden and grew up to be the poster girl for beautiful, big-eyed Scandinavian blondes. She attended a drama school and then joined a traveling theater group. With her looks as her passport, Britt entered films and became a star in Italy. When Peter Sellers met her in a hotel, he fell hard for her and they soon married. The combination of Sellers\' stardom and her stunning beauty contributed to her fame (the fact that Sellers suffered a heart attack in bed on their wedding night did not hurt, either). She appeared in two films with her husband: After the Fox (1966), written by Neil Simon, and the forgettable The Bobo (1967).',
									'movies'       => array( 'The Man with the Golden Gun' )
								),
								array( 
									'post_title'   => 'Maud Adams',
									'post_content' => 'Stunning Swedish born ex-model who broke into film in 1970, and quickly appeared in several high profile films including playing the ex-wife of James Caan in the futuristic Rollerball (1975) and the ill-fated lover of super-assassin Francisco Scaramanga played by Christopher Lee in The Man with the Golden Gun (1974). To date, the beautiful Maud Adams has appeared in three James Bond films... the other two performances were as one of the lead villains in Octopussy (1983) and as an extra in A View to a Kill (1985). She has appeared in numerous television specials on the Bond series of films, and also played the love interest of crazy Bruce Dern in Tattoo (1981). In the late 1990s, Adams had a regular role on a Swedish soap opera; however, she has not been seen on cinema screens since late 1996.',
									'movies'       => array( 'The Man with the Golden Gun' )
								),
								array( 
									'post_title'   => 'Pierce Brosnan',
									'post_content' => 'Pierce Brendan Brosnan was born in Drogheda, County Louth, Ireland, to May (Smith), a nurse, and Thomas Brosnan, a carpenter. He lived in Navan, County Meath, until he moved to England, UK, at an early age (thus explaining his ability to play men from both backgrounds convincingly). His father left the household when Pierce was a child and although reunited later in life, the two have never had a close relationship. His most popular role is that of British secret agent James Bond. The death, in 1991, of Cassandra Harris, his wife of eleven years, left him with three children - Christopher and Charlotte from Cassandra\'s first marriage and Sean from their marriage. Since her death, he has had two children with his second wife, Keely Shaye Smith.',
									'movies'       => array( 'Goldeneye' )
								),
								array( 
									'post_title'   => 'Sean Bean',
									'post_content' => 'Sean Bean, England\'s most versatile actor, holds a stellar career spanning every medium for approximately 20 years, in theater, radio, television and movies.',
									'movies'       => array( 'Goldeneye' )
								),
								array( 
									'post_title'   => 'Izabella Scorupco',
									'post_content' => 'Born in the northern Polish town of Bialystok, Izabella Scorupco moved to Sweden with her mother as a young child. She studied drama and music and, at 17, was discovered by a Swedish film director who cast her in the movie Ingen kan älska som vi (1988), which made her a local teenage idol.',
									'movies'       => array( 'Goldeneye' )
								),
								array( 
									'post_title'   => 'Famke Janssen',
									'post_content' => 'Famke Beumer Janssen was born on November 5, 1964 in Amstelveen, Netherlands, and has two siblings, director Antoinette Beumer and actress Marjolein Beumer. She studied economics for a year at the University of Amsterdam. Moving to America in 1984, Famke modeled for Chanel in New York City. Later, taking a break from modeling, she majored in writing and literature at Columbia University and studied acting with Harold Guskin. She then went to Los Angeles, California, where she continued to study acting under Roy London. Her first film was the crime drama Fathers & Sons (1992), where she played the love interest of Jeff Goldblum. Later, she became James Bond\'s enemy in GoldenEye (1995) opposite Pierce Brosnan.',
									'movies'       => array( 'Goldeneye' )
								),
								array( 
									'post_title'   => 'Prince',
									'post_content' => 'Prince Rogers Nelson was born in Minneapolis, Minnesota, to Mattie Della (Shaw), a jazz singer, and John L. Nelson, a lyricist and pianist. His parents were both from African-American families from the U.S. south. They separated during his youth, which lead him to move back and forth. Prince had a troubled relationship with his step-father which lead him to run away from home. Prince was adopted by a family called the Andersons. Prince soon after became friends with the Anderson\'s son, Andre Anderson (Cymone) together along with Charles Smith they joined a band called Grand Central. The band later renamed themselves Champagne and were a fairly successful live band, however soon diminished.',
									'movies'       => array( 'Purple Rain' )
								),
								array( 
									'post_title'   => 'Apollonia Kotero',
									'post_content' => 'Apollonia Kotero started her career in Prince\'s huge movie success Purple Rain (1984) and then moved on to appear in the night-time soap Falcon Crest (1981) for a ten-week guest stint. In 1988 she released her debut album as a singer and continued to star in other movies, such as Back to Back (1989) with Bill Paxton and Black Magic Woman (1991) with Mark Hamill. In the early 1990s she went "off the market" because of her marriage to actor Kevin Bernhardt (from General Hospital (1963)). Since 1996 she\'s been working on her singing and acting career again.',
									'movies'       => array( 'Purple Rain' )
								),
								array( 
									'post_title'   => 'Morris Day',
									'post_content' => 'Morris Day was born on December 13, 1957 in Minneapolis, Minnesota, USA as Morris Eugene Day. He is an actor, known for Purple Rain (1984), Jay and Silent Bob Strike Back (2001) and Forgetting Sarah Marshall (2008).',
									'movies'       => array( 'Purple Rain' )
								),
								array( 
									'post_title'   => 'Olga Karlatos',
									'post_content' => 'Olga Karlatos was born on April 20, 1947 in Athens, Greece as Olga Vlassopulos. She is known for her work on Once Upon a Time in America (1984), Purple Rain (1984) and Zombie (1979). She was previously married to Arthur Rankin Jr. and Nikos Papatakis.',
									'movies'       => array( 'Purple Rain' )
								),
								array( 
									'post_title'   => 'Bing Crosby',
									'post_content' => 'Bing Crosby was born Harry Lillis Crosby, Jr. in Tacoma, Washington, the fourth of seven children of Catherine Helen "Kate" (Harrigan) and Harry Lowe Crosby, a brewery bookkeeper. He was of English and Irish descent. Crosby studied law at Gonzaga University in Spokane but was more interested in playing the drums and singing with a local band.',
									'movies'       => array( 'White Christmas' )
								),
								array( 
									'post_title'   => 'Danny Kaye',
									'post_content' => 'Danny Kaye left school at the age of 13 to work in the so-called Borscht Belt of Jewish resorts in the Catskill Mountains. It was there he learned the basics of show biz. From there he went through a series of jobs in and out of the business. In 1939, he made his Broadway debut in "Straw Hat Revue," but it was the stage production of the musical "Lady in the Dark" in 1940 that brought him acclaim and notice from agents. Also in 1940, he married Sylvia Fine, who went on to manage his career. She helped create the routines and gags, and wrote most of the songs that he performed. Danny could sing and dance like many others, but his specialty was reciting those tongue-twisting songs and monologues.',
									'movies'       => array( 'White Christmas' )
								),
								array( 
									'post_title'   => 'Rosemary Clooney',
									'post_content' => 'Rosemary Clooney was born in Maysville, Kentucky, to Marie Frances (Guilfoyle) and Andrew Joseph Clooney. She was one of five children. Her father was of Irish and German descent, and her mother was of Irish and English ancestry. She grew up in Maysville, where she and her sister Betty Clooney used to sing in her grandfather\'s mayoral election campaigns, which he won three times. She made her singing debut on Cincinnati radio station WLW in 1941 at 13. On WLW she worked with band leader Barney Rapp, who had also worked with Doris Day and Andy Williams at the same station. She attended high school at Our Lady of Mercy in Cincinnati.',
									'movies'       => array( 'White Christmas' )
								),
								array( 
									'post_title'   => 'Vera-Ellen',
									'post_content' => 'Vera-Ellen began dancing at the age of 10, and a few years later became one of the youngest Rockettes. She appeared in several Broadway musicals until she was spotted by film producer Samuel Goldwyn in 1945. She was only 24 years old when Goldwyn cast her opposite Danny Kaye in Wonder Man (1945). She danced with Fred Astaire in Three Little Words (1950) and with Gene Kelly in On the Town (1949). Blonde, slim of build, and a dancing sensation, she appeared in a string of light-hearted but successful films. Vera-Ellen retired from acting in the late 1950s.',
									'movies'       => array( 'White Christmas' )
								),
								array( 
									'post_title'   => 'Léa Seydoux',
									'post_content' => 'Léa Seydoux was born in Paris, France in 1985, to Valérie (Schlumberger), a philanthropist, and Henri Seydoux, a businessman. Her grandfather, Jérôme Seydoux, is chairman of Pathé, and her father is a great-grandson of businessman and inventor Marcel Schlumberger (her mother also descends from the Schlumberger family). Her parents are both of mixed French and Alsatian German descent, with more distant Spanish-Venezuelan roots on her father\'s side.',
									'movies'       => array( 'Blue is the Warmest Colour' )
								),
								array( 
									'post_title'   => 'Adèle Exarchopoulos',
									'post_content' => 'Adèle Exarchopoulos is a French actress with partially Greek roots (her grandfather was Greek). She was born in Paris, France. Her mother, Marina (Niquet), is a nurse, and her father, Didier Exarchopoulos, is a guitarist. At the age of 9 she started acting and watching movies. As she said on the French newspaper L\'Express, she started taking acting lessons because she likes disguising. At the age of 12 she made her first role on the movie Boxes, and a year after she had a role in the movie Les Enfants de Timpelbach acting as Marianne. She then starred in the movie La Rafle (2010).',
									'movies'       => array( 'Blue is the Warmest Colour' )
								),
								array( 
									'post_title'   => 'Salim Kechiouche',
									'post_content' => 'Actor Salim Kechiouche was born in Lyon, France to Algerian parents. At first a kickboxing champion in France (1998), his film carreer started when actor/director Gaël Morel discovered Salim and so he made his first appearance in the movie À Toute Vitesse. ',
									'movies'       => array( 'Blue is the Warmest Colour' )
								),
								array( 
									'post_title'   => 'Aurélien Recoing',
									'post_content' => 'Aurélien Recoing was born on May 5, 1958 in Paris, France. He is an actor, known for Blue Is the Warmest Color (2013), 13 Tzameti (2005) and Time Out (2001).',
									'movies'       => array( 'Blue is the Warmest Colour' )
								),
								array( 
									'post_title'   => 'Dakota Johnson',
									'post_content' => 'Dakota Mayi Johnson is an American fashion model and actress. She was born in Austin, Texas, and is the daughter of actors Don Johnson and Melanie Griffith. Her maternal grandmother is actress Tippi Hedren.',
									'movies'       => array( 'Fifty Shades of Grey' )
								),
								array( 
									'post_title'   => 'Jamie Dornan',
									'post_content' => 'Jamie Dornan was born on May 1, 1982 in Belfast, Northern Ireland as James Dornan. He is an actor, known for Fifty Shades of Grey (2015), Marie Antoinette (2006) and The Fall (2013). He has been married to Amelia Warner since April 27, 2013. They have one child.',
									'movies'       => array( 'Fifty Shades of Grey' )
								),
								array( 
									'post_title'   => 'Jennifer Ehle',
									'post_content' => 'Jennifer Ehle was born on December 29, 1969 in Winston-Salem, North Carolina, USA as Jennifer Anne Ehle. She is an actress, known for Zero Dark Thirty (2012), The King\'s Speech (2010) and Fifty Shades of Grey (2015). She has been married to Michael Scott Ryan since November 29, 2001. They have two children.',
									'movies'       => array( 'Fifty Shades of Grey' )
								),
								array( 
									'post_title'   => 'Eloise Mumford',
									'post_content' => 'Eloise Mumford was born on September 24, 1986 in Washington, USA. She is an actress, known for Fifty Shades of Grey (2015), Some Boys Don\'t Leave (2009) and So Undercover (2012).',
									'movies'       => array( 'Fifty Shades of Grey' )
								),
								array( 
									'post_title'   => 'Gene Wilder',
									'post_content' => 'Gene Wilder was born Jerome Silberman in Milwaukee, Wisconsin, to Jeanne (Baer) and William J. Silberman, who manufactured miniature whiskey and beer bottles. His father was a Russian Jewish immigrant, while his Illinois-born mother was of Russian Jewish descent.',
									'movies'       => array( 'Silver Streak' )
								),
								array( 
									'post_title'   => 'Jill Clayburgh',
									'post_content' => 'It came as no surprise to film aficionados when, in 1999, Entertainment Weekly named Jill Clayburgh on its list of Hollywood\'s 25 Greatest Actresses. For decades, she delivered stellar performances in a wide variety of roles.',
									'movies'       => array( 'Silver Streak' )
								),
								array( 
									'post_title'   => 'Richard Pryor',
									'post_content' => 'Highly influential, and always controversial, African-American actor/comedian who was equally well known for his colorful language during his live comedy shows, as for his fast paced life, multiple marriages and battles with drug addiction. He has been acknowledged by many modern comic artist\'s as a key influence on their careers, and Pryor\'s observational humor on African-American life in the USA during the 1970s was razor sharp brilliance.',
									'movies'       => array( 'Silver Streak' )
								),
								array( 
									'post_title'   => 'Patrick McGoohan',
									'post_content' => 'Though born in America, Irish actor Patrick McGoohan rose to become the number-one British TV star in the 1950s to 1960s era. His parents moved to Ireland when he was very young and McGoohan acquired a neutral accent that sounds at home in British or American dialogue. He was an avid stage actor and performed hundreds of times in small and large productions before landing his first TV and film roles. McGoohan is one of few actors who has successfully switched between theater, TV, and films many times during his career. He was often cast in the role of Angry Young Man.',
									'movies'       => array( 'Silver Streak' )
								),
								array( 
									'post_title'   => 'Denzel Washington',
									'post_content' => 'Denzel Hayes Washington, Jr. was born on December 28, 1954 in Mount Vernon, New York. He is the middle of three children of a beautician mother, Lennis (Lowe), from Georgia, and a Pentecostal minister father, Denzel Washington, Sr., from Virginia. After graduating from high school, Denzel enrolled at Fordham University, intent on a career in journalism. However, he caught the acting bug while appearing in student drama productions and, upon graduation, he moved to San Francisco and enrolled at the American Conservatory Theater. He left A.C.T. after only one year to seek work as an actor. His first paid acting role was in a summer stock theater stage production in St. Mary\'s City, Maryland.',
									'movies'       => array( 'Crimson Tide' )
								),
								array( 
									'post_title'   => 'Gene Hackman',
									'post_content' => 'Eugene Allen Hackman was born in San Bernardino, California, the son of Anna Lyda Elizabeth (Gray) and Eugene Ezra Hackman, who operated a newspaper printing press. He is of Pennsylvania Dutch (German), English, and Scottish ancestry, partly by way of Canada, where his mother was born. Gene grew up in a broken home, which he left at the age of sixteen for a hitch with the US Marines. Moving to New York after being discharged, he worked in a number of menial jobs before studying journalism and television production on the G.I. Bill at the University of Illinois. Hackman would be over 30 years old when he finally decided to take his chance at acting by enrolling at the Pasadena Playhouse in California. Legend says that Hackman and friend Dustin Hoffman were voted "least likely to succeed."',
									'movies'       => array( 'Crimson Tide' )
								),
								array( 
									'post_title'   => 'Matt Craven',
									'post_content' => 'Canadian-born actor Matt Craven is among the most sought after character actors of film and television today, starring in such blockbuster critically acclaimed films as the Academy-Award-nominated "Crimson Tide" and "A Few Good Men" and SAG Award nominated "X-Men: First Class." Craven has starred opposite great Hollywood actors such as Denzel Washington, Gene Hackman, Helen Mirren, Maggie Gyllenhaal, Ethan Hawke, James Gandolfini, and Michael Caine, to name a few, and was recently seen starring in the hit ABC science fiction drama series "Resurrection" as Fred Langston, sheriff of Arcadia, Missouri, a town that\'s turned upside down as deceased loved ones return after death. ',
									'movies'       => array( 'Crimson Tide' )
								),
								array( 
									'post_title'   => 'George Dzundza',
									'post_content' => 'George Dzundza was born on July 19, 1945 in Rosenheim, Bavaria, Germany as George F. Dzundza. He is an actor and assistant director, known for Basic Instinct (1992), The Deer Hunter (1978) and Crimson Tide (1995). He has been married to Mary Jo Vermeulen since 1980. They have three children.',
									'movies'       => array( 'Crimson Tide' )
								),
								array( 
									'post_title'   => 'Bradley Cooper',
									'post_content' => 'Bradley Charles Cooper was born in Philadelphia, Pennsylvania. His mother, Gloria (Campano), is of Italian descent, and worked for a local NBC station. His father, Charles John "Charlie" Cooper, who was of Irish descent, was a stockbroker. He has a sister, Holly. Immediately after Bradley graduated from the Honors English program at Georgetown University in 1997, he moved to New York City to enroll in the Masters of Fine Arts program at the Actors Studio Drama School at New School University. There, he developed his stage work, culminating with his thesis performance as "John Merrick" in Bernard Pomerance\'s "The Elephant Man", performed in New York\'s Circle in the Square. ',
									'movies'       => array( 'Silver Linings Playbook' )
								),
								array( 
									'post_title'   => 'Jennifer Lawrence',
									'post_content' => 'Academy Award-winning actress Jennifer Lawrence is best known for playing Katniss Everdeen in The Hunger Games (2012), Tiffany Maxwell in Silver Linings Playbook (2012), and Rosalyn Rosenfeld in American Hustle (2013).',
									'movies'       => array( 'Silver Linings Playbook' )
								),
								array( 
									'post_title'   => 'Robert De Niro',
									'post_content' => 'Robert De Niro, thought of as one of the greatest American actors of all time, was born in Greenwich Village, Manhattan, New York City, to artists Virginia (Admiral) and Robert De Niro Sr. His paternal grandfather was of Italian descent, and his other ancestry is Irish, German, Dutch, English, and French. He was trained at the Stella Adler Conservatory and the American Workshop. He first gained fame for his role in Bang the Drum Slowly (1973), but he gained his reputation as a volatile actor in Mean Streets (1973), which was his first film with director Martin Scorsese. In 1974 De Niro received an Academy Award for best supporting actor for his role in The Godfather: Part II (1974) and received Academy Award nominations for best actor in Taxi Driver (1976), The Deer Hunter (1978), and Cape Fear (1991). He won the best actor award in 1980 for Raging Bull (1980). De Niro heads his own production company, Tribeca Film Center, and made his directorial debut in 1993 with A Bronx Tale (1993).',
									'movies'       => array( 'Silver Linings Playbook' )
								),
								array( 
									'post_title'   => 'Jacki Weaver',
									'post_content' => 'Jacki Weaver was born on May 25, 1947 in Sydney, New South Wales, Australia as Jacqueline Ruth Weaver. She is an actress, known for Silver Linings Playbook (2012), Animal Kingdom (2010) and Stoker (2013). She has been married to Sean Taylor since 2003. She was previously married to Derryn Hinch, Max Hensser and David Price.',
									'movies'       => array( 'Silver Linings Playbook' )
								),
								array( 
									'post_title'   => 'Natalie Portman',
									'post_content' => 'Natalie Portman was born Natalie Hershlag on June 9, 1981, in Jerusalem, Israel, to a Jewish family. She is the only child of Avner Hershlag, an Israeli-born doctor, and Shelley Stevens, an American-born artist (from Cincinnati, Ohio), who also acts as Natalie\'s agent. She left Israel for Washington, D.C., when she was still very young.',
									'movies'       => array( 'Black Swan' )
								),
								array( 
									'post_title'   => 'Mila Kunis',
									'post_content' => 'The talented Milena "Mila" Markovna Kunis was born to a Jewish family in Chernivtsi, Ukraine, USSR (now independent Ukraine). Her mother, Elvira, is a physics teacher, her father, Mark Kunis, is a mechanical engineer, and she has an older brother named Michael. After attending one semester of college between gigs, she realized that she wanted to act for the rest of her life. She started acting when she was just 9 years old, when her father heard about an acting class on the radio and decided to enroll Mila in it. There, she met her future agent. Her first gig was in 1995, in which she played a character named Melinda in Make a Wish, Molly (1995). From there, her career skyrocketed into big-budget films. Although she is mostly known for playing Jackie Burkhart in That \'70s Show (1998), she has shown the world that she can do so much more. Her breakthrough film was Forgetting Sarah Marshall (2008), in which she played a free-spirited character named Rachel Jensen.',
									'movies'       => array( 'Black Swan' )
								),
								array( 
									'post_title'   => 'Vincent Cassel',
									'post_content' => 'Blue-eyed Vincent Cassel was born in Paris to a leading actor father, Jean-Pierre Cassel, and a journalist mother, Sabine Litique. Often labeled as a tough guy because of his roles, eclectic choices and talent have made of him a star of European cinema. First in La Haine (1995), the young actor, actually coming from upper classes, succeeded to express the despair of a social class living in the suburbs of towns. This veracity in his play comes from the fact that he was in fact since years in connection with many hip-hop artists from the rising generation, (his own brother was leader of a legendary french rap group). Then the success of The crimson rivers, where he plays a young French cop alongside Jean Reno, made of him "the man to count on." ',
									'movies'       => array( 'Black Swan' )
								),
								array( 
									'post_title'   => 'Barbara Hershey',
									'post_content' => 'Barbara Hershey was born Barbara Lynn Herzstein in Hollywood, California, to Melrose (Moore) and Arnold Nathan Herzstein, a horse racing columnist. Her father, born in Manhattan, was from a Jewish family (from Hungary and Russia), and her mother, originally from Arkansas, had English and Scots-Irish ancestry. Hershey was raised in a small bungalow, and had aspirations of being an actress from her earliest memories.',
									'movies'       => array( 'Black Swan' )
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