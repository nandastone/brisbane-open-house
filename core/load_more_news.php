<?php

add_action('wp_ajax_load_more_news', 'load_more_news');
add_action('wp_ajax_nopriv_load_more_news','load_more_news');

function load_more_news() {
	
	$args = array(
        'post_type' 		=> 'post',
        'post_status' 		=> 'publish',
		'posts_per_page' 	=> $_POST['load_count'],
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
   		require locate_template('json-templates/news-tile.php');
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