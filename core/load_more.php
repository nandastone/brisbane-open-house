<?php

add_action('wp_ajax_load_more', 'load_more');
add_action('wp_ajax_nopriv_load_more','load_more');

function load_more() {
	
	$terms = get_terms('event_type', array(
        'hide_empty' => false,
    ));

	$slugs = array();
	foreach($terms as $term){
		$slugs[] = $term->slug;
	}
	if($_POST['event_filter']!=""){
		unset($slugs[array_search($_POST['event_filter'], $slugs)]);
	}
	else{
		$slugs = array('news');
	}
	
	$taxQuery = array(
        array(
			'taxonomy' => 'event_type',
			'field' => 'slug',
			'terms' => $slugs,
			'operator' => 'NOT IN',
    	),
    );
	
	$args = array(
        'post_type' 		=> 'event',
        'post_status' 		=> 'publish',
		'tax_query' 		=> $taxQuery,
		'posts_per_page' 	=> $_POST['load_count'],
		
		'orderby' 			=> 'meta_value',
		'meta_key'			=> 'dates_0_date',
		'meta_type'			=> 'DATE',
		'order'				=> 'ASC'
    );
	
	if (isset($_POST['loaded'])) {
		$args['post__not_in'] = explode(',', $_POST['loaded']);
	}

    // Search events
	$query_loadmore = new WP_Query( $args );
	$query_loadmore->post_count = count( $query_loadmore->posts );
	$query_loadmore->post_ids = wp_list_pluck( $query_loadmore->posts, 'ID' );
    
   	if ( $query_loadmore->have_posts() ) {
   		ob_start();
   		require locate_template('json-templates/event-tile.php');
   		$results = ob_get_clean();
    } else {
        $results = '';
    }

    wp_send_json(array(
    	'slugs' => $slugs,
        'results' => $results,
		'count' => $query_loadmore->post_count,
		'ids' => $query_loadmore->post_ids
    ));
}