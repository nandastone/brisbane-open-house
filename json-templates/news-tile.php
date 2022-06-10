<?php

$context['assets'] = $GLOBALS['assets'];
$context['news_collection'] = Timber::get_posts($query_loadmore);

foreach ($context['news_collection'] as $itemPost) {
	$terms = get_post_taxonomies( $itemPost );
	foreach ($terms as $term) {
		$itemPost->$term = wp_get_post_terms( $itemPost->id, $term );
	}
}

Timber::render('json/news-tile.twig', $context);