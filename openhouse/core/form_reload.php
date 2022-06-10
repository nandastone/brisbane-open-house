<?php

add_action('wp_ajax_form_reload', 'form_reload');
add_action('wp_ajax_nopriv_form_reload','form_reload');

function form_reload() {
	
	ob_start();
	require locate_template('json-templates/form-reload.php');
    $results = ob_get_clean(); 

    wp_send_json(array(
        'results' => $results
    ));
	
}