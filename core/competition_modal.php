<?php

/* NOT LOADING FORM THROUGH AJAX

add_action('wp_ajax_competition_modal', 'competition_modal');
add_action('wp_ajax_nopriv_competition_modal','competition_modal');

function competition_modal() {

	ob_start();
	require locate_template('json-templates/competition-modal.php');
    $results = ob_get_clean(); 

    wp_send_json(array(
        'results' => $results
    ));
	
}
*/

// Pre-populate buildings in building drop down
add_filter( 'gform_pre_render_5', 'populate_building_dropdowns' );
add_filter( 'gform_pre_validation_5', 'populate_building_dropdowns' );
add_filter( 'gform_pre_submission_filter_5', 'populate_building_dropdowns' );
add_filter( 'gform_admin_pre_render_5', 'populate_building_dropdowns' );
function populate_building_dropdowns( $form ) {
 
    foreach ( $form['fields'] as &$field ) {
 
        if ( $field->type != 'select' || strpos( $field->cssClass, 'building-prepop' ) === false ) {
            continue;
        }
 
        // you can add additional parameters here to alter the posts that are retrieved
        // more info: http://codex.wordpress.org/Template_Tags/get_posts
		$args = array(
			'posts_per_page'   => -1,
			'post_type'        => 'building',
			'post_status'      => 'publish',
			'orderby'          => 'post_title',
			'order'            => 'ASC'
		);
        $posts = get_posts( $args );
        $choices = array();
        foreach ( $posts as $post ) {
            $choices[] = array( 'text' => $post->post_title, 'value' => $post->post_title );
        }
 
        // update 'Select a Post' to whatever you'd like the instructive option to be
        $field->placeholder = 'Select a Building';
        $field->choices = $choices;
    }
    return $form;
}