<?php

//$context['events'] = Timber::get_posts($query_loadmore);
    $context['new_user_favorites_count'] = strip_tags(get_user_favorites_count(get_current_user_id()));

Timber::render('json/fav-count.twig', $context);