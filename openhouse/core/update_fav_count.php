<?php

add_action('wp_ajax_update_fav_count', 'update_fav_count');
add_action('wp_ajax_nopriv_update_fav_count','update_fav_count');

function update_fav_count() {

	ob_start();
	require locate_template('json-templates/update-fav-count.php');
    $results = ob_get_clean(); 

    wp_send_json(array(
        'results' => $results
    ));
	
}