<?php

//wp_redirect(home_url());
//exit();

$context = Timber::get_context();
$context['post'] = new TimberPost();

$terms = get_post_taxonomies( $context['post'] );
foreach ($terms as $term) {
	$context['post']->$term = wp_get_post_terms( $context['post']->id, $term );
}

Timber::render('pages/single-building-page.twig', $context);
