<?php

$context = Timber::get_context();
$context['post'] = new TimberPost();

/*
$args = array(
        'post_type' 		=> array('event','post','building'),
        'post_status' 		=> 'publish',
        'orderby'           => 'created',
        'order'             => 'DESC',
		// 'tax_query' => array(
	 //        'taxonomy' => 'event_type',
	 //        'field'    => 'slug',
	 //        'terms'    => array('media'),
	 //        'operator' => 'NOT IN',
	 //    ),
	    'posts_per_page' 	=> 8,

    );


    $query_frontnews = new WP_Query( $args );
    $query_frontnews->post_count = count( $query_frontnews->posts );

    $context['events'] = Timber::get_posts($query_frontnews);

	foreach ($context['events'] as $itemPost) {
		$terms = get_post_taxonomies( $itemPost );
		foreach ($terms as $term) {
			$itemPost->$term = wp_get_post_terms( $itemPost->id, $term );
		}
		//$image = $itemPost->image;
		//$itemPost->image = new TimberImage($itemPost->image);
	}
*/

Timber::render('pages/front-page.twig', $context);