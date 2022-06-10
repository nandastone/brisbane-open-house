<?php

$context['assets'] = $GLOBALS['assets'];
$context['events'] = Timber::get_posts($query_loadmore);

	foreach ($context['events'] as $itemPost) {
		$terms = get_post_taxonomies( $itemPost );
		foreach ($terms as $term) {
			$itemPost->$term = wp_get_post_terms( $itemPost->id, $term );
		}
		$images = $itemPost->images;
        if(count($images[0]) != 0){
            $event_images = array();
            foreach ($images as $image) {
                $event_images[] = new TimberImage($image);
            }
            $itemPost->images = $event_images;
        }
	}

Timber::render('json/event-tile.twig', $context);