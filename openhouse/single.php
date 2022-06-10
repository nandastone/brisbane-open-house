<?php

$context = Timber::get_context();
$context['post'] = new TimberPost();

$terms = get_post_taxonomies( $context['post'] );
foreach ($terms as $term) {
	$context['post']->$term = wp_get_post_terms( $context['post']->id, $term );
}

// Get related News
$taxQuery = array(
	array(
	'taxonomy' => 'category',
	'field' => 'slug',
	'terms' => get_the_category()[0]->slug
	),
);

$args = array(
	'post_type' 		=> 'post',
	'post_status' 		=> 'publish',
	'tax_query' 		=> $taxQuery,
	'posts_per_page' 	=> 4,
	'post__not_in'		=> array( get_the_ID() )
);

$query_related = new WP_Query( $args );
$context['news_collection'] = Timber::get_posts($query_related);

foreach ($context['news_collection'] as $itemPost) {
	$terms = get_post_taxonomies( $itemPost );
	foreach ($terms as $term) {
		$itemPost->$term = wp_get_post_terms( $itemPost->id, $term );
	}
}

Timber::render('pages/single-news-page.twig', $context);