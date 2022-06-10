<?php

$context = Timber::get_context();
$context['post'] = new TimberPost();

$terms = get_post_taxonomies( $context['post'] );
foreach ($terms as $term) {
	$context['post']->$term = wp_get_post_terms( $context['post']->id, $term );
}

// Get related Events
$taxQuery = array(
	array(
		'taxonomy' => 'event_type',
		'field' => 'slug',
		'terms' => get_the_terms(get_the_ID(), 'event_type')[0]->slug
	),
);

$args = array(
	'post_type' 		=> 'event',
	'post_status' 		=> 'publish',
	'tax_query' 		=> $taxQuery,
	'posts_per_page' 	=> 4,
	'post__not_in'		=> array( get_the_ID() )
);

$query_related = new WP_Query( $args );
$context['event_collection'] = Timber::get_posts($query_related);

foreach ($context['event_collection'] as $itemPost) {
	$terms = get_post_taxonomies( $itemPost );
	foreach ($terms as $term) {
		$itemPost->$term = wp_get_post_terms( $itemPost->id, $term );
	}
}

Timber::render('pages/single-event-page.twig', $context);