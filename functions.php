<?php

require_once( 'core/core.php' );
require_once( 'core/competition_modal.php' );
require_once( 'core/competition_winner_modal.php' );
require_once( 'core/load_more.php' );
require_once( 'core/load_more_news.php' );
require_once( 'core/update_fav_count.php' );
require_once( 'core/form_reload.php' );

require get_template_directory() . '/vendor/autoload.php';
$boh = new BOH\BOH();
$boh->run();

add_filter('robots_txt', 'custom_robots_txt', 10,  2, PHP_INT_MAX);
function custom_robots_txt($output, $public) {

	$robots_txt =  "User Agent: * \n";
	$robots_txt .=  "Disallow: /wp-admin/ \n";
	$robots_txt .=  "Disallow: *.pdf \n";
	$robots_txt .=  "Allow: /wp-admin/admin-ajax.php \n";

	return $robots_txt;
}
