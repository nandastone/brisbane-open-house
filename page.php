<?php

$context = Timber::get_context();
$context['post'] = new TimberPost();

$context['post']->favorite_count = strip_tags(get_favorites_count($context['post']->id, 1));

Timber::render('pages/page.twig', $context);

