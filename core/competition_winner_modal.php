<?php

add_action('wp_ajax_competition_winner_modal', 'competition_winner_modal');
add_action('wp_ajax_nopriv_competition_winner_modal','competition_winner_modal');

function competition_winner_modal() {

	
	$data['data'] = $_POST['data'];
	$data['currentslide'] = 0;
	$typeCount = 0;
	
	//$winner_types = get_terms( 'winner_type', array(
    //    'hide_empty' => false
    //));

	$data['current_winners'] = array();
	//foreach ($winner_types as $winner_type) {
	//	$slug = $winner_type->slug;
		$slug = $data['data']['year'];
		$args = array(
			'post_type'         => 'winner',
			'post_status'       => 'publish',
			'orderby'           => 'modified',
			'tax_query' => array(
	//			array(
	//				'taxonomy'  => 'winner_type',
	//				'field'     => 'slug',
	//				'terms'     => $slug
	//			),
				array(
					'taxonomy'  => 'winner_year',
					'field'     => 'slug',
					'terms'     => $data['data']['year'],
				),
			)
		);
		$query_winners = new WP_Query( $args );
		$data['current_winners'][$slug] = Timber::get_posts($query_winners);
		foreach ($data['current_winners'][$slug] as $itemPost) {
			if ($itemPost->slug == $data['data']['photo']) { $data['currentslide'] = $typeCount; }
			$terms = get_post_taxonomies( $itemPost );
			foreach ($terms as $term) {
				$itemPost->$term = wp_get_post_terms( $itemPost->id, $term );
			}
			$typeCount++;
		}
	//}
	
	if ( count($data['current_winners']) > 0 ) {
		ob_start();
		require locate_template('json-templates/competition-winner-modal.php');
    	$results = ob_get_clean(); 
	} else {
		$results = ''; 
	}

    wp_send_json(array(
        'results' => $results,
		'modalclass' => 'photo-comp-winner'
    ));
	
}