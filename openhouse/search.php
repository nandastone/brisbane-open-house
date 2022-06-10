<?php

$context = Timber::get_context();

$searchQuery = get_search_query();

$context['title'] = "Search results for \"$searchQuery\"";
$context['posts'] = Timber::get_posts();

Timber::render('pages/search.twig', $context);