<?php
$timber = new \Timber\Timber();

$GLOBALS['home'] = home_url() . '/';
$GLOBALS['assets'] = get_template_directory_uri() . '/assets';
$GLOBALS['production'] = strtoupper(WPLT_SERVER) == 'LIVE' || strtoupper(WPLT_SERVER) == 'PRODUCTION' ? true : false;

Timber::$dirname = array('templates', 'fewbricks/brick-layouts', 'fewbricks/bricks');

/**
 * twig
 */

add_filter('get_twig', 'add_to_twig');

function add_to_twig($twig) {
	$twig->addFilter(new Twig_SimpleFilter('js_global', 'js_global'));
	$twig->addFilter(new Twig_SimpleFilter('js_tag', 'js_tag'));
	$twig->addFilter(new Twig_SimpleFilter('css_tag', 'css_tag'));
	$twig->addFilter(new Twig_SimpleFilter('pre_tag', 'pre_tag'));
	$twig->addFilter(new Twig_SimpleFilter('building_get_button', 'boh_building_get_button'));
	return $twig;
}

/**
 * timber
 */

add_filter('timber_context', 'add_to_context');

function add_to_context($data) {
	$user = new TimberUser();

	$data['home'] = $GLOBALS['home'];
	$data['assets'] = $GLOBALS['assets'];
	$data['production'] = $GLOBALS['production'];
	$data['header_nav'] = new TimberMenu('header_nav');
	$data['wp_title'] = new Timber\FunctionWrapper( 'wp_title', array( '|', true, 'right' ) );
	$data['fewbricks_brick'] = new Timber\FunctionWrapper( 'fewbricks_brick', array( false, false, false ) );
	$data['user'] = (!empty($user->id)) ? $user : false;
	$data['logout_url'] = new Timber\FunctionWrapper( 'wp_logout_url', $_SERVER['REQUEST_URI'] );

	$data['site_options'] = get_fields('options');
	$data['google_maps_api_key'] = get_field('google_maps_api_key', 'option');

	$data['define_when_eventbrite_booking_starts'] = get_field('define_when_eventbrite_booking_starts', 'option');
	$data['eventbrite_booking_button_starts_at'] = (strlen(get_field('eventbrite_booking_button_starts_at', 'option'))) ? \DateTime::createFromFormat('Ymd', get_field('eventbrite_booking_button_starts_at', 'option')) : null;


	$data['event_filters']  = get_terms( 'event_type', array(
		'hide_empty' => false,
	));

	$args = array(
		'posts_per_page'   => -1,
		'post_type'         => 'building',
		'post_status'       => 'publish',
		'order_by'			=> 'meta_value_num',
		'meta_key'			=> '_building_no'
	);
	$query_buildings = new WP_Query( $args );
	$data['buildings'] = Timber::get_posts($query_buildings);
	foreach ($data['buildings'] as $itemPost) {
		$terms = get_post_taxonomies( $itemPost );
		foreach ($terms as $term) {
			$itemPost->$term = wp_get_post_terms( $itemPost->id, $term );
		}
		$itemPost->favorite_count = strip_tags(get_favorites_count($itemPost->id, 1));
	}


	$data['building_precincts']  = get_terms( 'building_precinct', array(
		'hide_empty' => true
	));


	$data['building_types']  = get_terms( 'building_type', array(
		'hide_empty' => true
	));


	$sponsor_types = get_terms( 'sponsor_type', array(
		'hide_empty' => false
	));
	$data['sponsor_types'] = $sponsor_types;


	$args = array(
		'post_type'         => 'faq',
		'post_status'       => 'publish'
	);
	$query_faqs = new WP_Query( $args );
	$data['faqs'] = Timber::get_posts($query_faqs);

	$data['sponsors'] = array();
	foreach ($sponsor_types as $sponsor_type) {
		$slug = $sponsor_type->slug;
		$args = array(
			'posts_per_page'    => -1,
			'post_type'         => 'sponsor',
			'post_status'       => 'publish',
			'tax_query' => array(
				array(
					'taxonomy'  => 'sponsor_type',
					'field'     => 'slug',
					'terms'     => $slug
				)
			)
		);
		$query_sponsors = new WP_Query( $args );
		$data['sponsors'][$slug] = Timber::get_posts($query_sponsors);
	}


	// Favourites list

	$data['shortlist'] = array();
	$fav_ids = get_user_favorites(get_current_user_id());
	if(count($fav_ids) != 0){
		$query = new WP_Query( array( 'post_type' => 'building', 'post__in' => $fav_ids, 'posts_per_page' => -1 ) );
		$data['shortlist'] = Timber::get_posts($query);
		foreach ($data['shortlist'] as $itemPost) {
			$terms = get_post_taxonomies( $itemPost );
			foreach ($terms as $term) {
				$itemPost->$term = wp_get_post_terms( $itemPost->id, $term );
			}
			if ( ! empty($itemPost->images) ) {
				foreach ($itemPost->images as $key=>$image) {
					$itemPost->images[$key] = new Timber\Image( $image );
				}
			}
			$itemPost->favorite_count = strip_tags(get_favorites_count($itemPost->id, 1));
		}
	}
	$data['user_favorites_count'] = strip_tags(get_user_favorites_count(get_current_user_id()));


	// Photo comp winners
	$winner_years = get_terms( 'winner_year', array(
		'hide_empty' => true
	));
	$data['winner_years'] = $winner_years;

	$winner_types = get_terms( 'winner_type', array(
		'hide_empty' => false
	));
	$data['winner_types'] = $winner_types;

	$data['prev_winners'] = array();
	foreach ($winner_years as $winner_year) {
		$slug = $winner_year->slug;
		$args = array(
			'post_type'         => 'winner',
			'post_status'       => 'publish',
			'orderby'           => 'modified',
			'tax_query' => array(
				array(
					'taxonomy'  => 'winner_year',
					'field'     => 'slug',
					'terms'     => $slug
				),
			)
		);
		$query_loadmore = new WP_Query( $args );
		$data['prev_winners'][$slug] = Timber::get_posts($query_loadmore);

		foreach ($data['prev_winners'][$slug] as $itemPost) {
			$terms = get_post_taxonomies( $itemPost );
			foreach ($terms as $term) {
				$itemPost->$term = wp_get_post_terms( $itemPost->id, $term );
			}
		}
	}


	$data['current_winners'] = array();
	$args = array(
		'post_type'         => 'winner',
		'post_status'       => 'publish',
		'orderby'           => 'modified',
		'tax_query' => array(
			array(
				'taxonomy'  => 'winner_year',
				'field'     => 'slug',
				'terms'     => '2018',
			),
		)
	);
	$query_loadmore = new WP_Query( $args );
	$data['current_winners'] = Timber::get_posts($query_loadmore);
	foreach ($data['current_winners'] as $itemPost) {
		$terms = get_post_taxonomies( $itemPost );
		foreach ($terms as $term) {
			$itemPost->$term = wp_get_post_terms( $itemPost->id, $term );
		}
	}

	// News
	$news_media_types = get_terms( 'category', array(
		'hide_empty' => true,
	));
	$data['news_media_types'] = $news_media_types;

	$args = array(
		'post_type'         => 'post',
		'post_status'       => 'publish',
	);
	$query_loadmore = new WP_Query( $args );
	$data['news_medias'] = Timber::get_posts($query_loadmore);
	foreach ($data['news_medias'] as $itemPost) {
		$terms = get_post_taxonomies( $itemPost );
		foreach ($terms as $term) {
			$itemPost->$term = wp_get_post_terms( $itemPost->id, $term );
		}
	}
	return $data;
}


if( function_exists('acf_add_options_page') ) {
	acf_add_options_page();
}

function js_global($text) {
	$str = '<script>var '.$text.' = { "ajaxurl": "'.admin_url( 'admin-ajax.php' ).'", "templatepath": "'.get_stylesheet_directory_uri().'" };</script>';
	return $str;
}

function js_tag($text) {
	$str = '<script src="'.$GLOBALS['assets'].'/js/'.$text.'"></script>';
	return $str;
}

function css_tag($text) {
	$str = '<link rel="stylesheet" href="'.$GLOBALS['assets'].'/css/'.$text.'" type="text/css" media="all">';
	return $str;
}

function pre_tag($text) {
	$str = '<pre>'.$text.'</pre>';
	return $str;
}

function boh_building_get_button($building) {
	$eventbrite_event_id = get_field('field_5d0841b166bd2', $building->ID);
	$force_booked_out = (bool) \get_field('field_5d8d6abc727ef', $building->ID, false);
	$fallback_booking_url = get_field('field_5b555c3d097dd', $building->ID);

	$eventbrite_status = boh_eventbrite_parse($eventbrite_event_id);

	if (
		is_numeric($eventbrite_event_id)
		&& null === $eventbrite_status['url']
		&& ! empty($fallback_booking_url)
	) {
		$eventbrite_status = [
			'is_booking_available' => true,
			'url' => $fallback_booking_url,
		];
	}

	if (
		is_numeric($eventbrite_event_id)
		&& true === $eventbrite_status['is_booking_available']
		&& true === $force_booked_out
	) {
		$eventbrite_status = [
			'is_booking_available' => false
		];
	}

	return \Timber\Timber::compile('partials/_building-book-button.twig', array('building' => $building, 'eventbrite' => $eventbrite_status));
}

function boh_eventbrite_parse( $event_id ) {
	$output = array();
	$output['url'] = null;
	$output['is_booking_available'] = false;
	if ( ! is_numeric($event_id) ) {
		$output['no_eventbrite_defined'] = true;
		return $output;
	}

	$booking_starts_at = (strlen(get_field('eventbrite_booking_button_starts_at', 'option'))) ? \DateTime::createFromFormat('Ymd H:i:s', get_field('eventbrite_booking_button_starts_at', 'option') . ' 00:00:00') : null;
	$output['booking_starts'] = $booking_starts_at;
	$output['forced_booking_starts'] = false;

	if (
		! function_exists('eventbrite') || ! function_exists('eventbrite_get_event')
	) {
		$plugins_url = plugins_url('eventbrite-api/inc');
		$plugins_path = wp_parse_url($plugins_url, PHP_URL_PATH);
		require_once ABSPATH . $plugins_path . '/class-eventbrite-manager.php';
		require_once ABSPATH . $plugins_path . '/functions.php';
	}
	$event = eventbrite_get_event($event_id)->events[0];

	if (!empty($event->ID)) {
		$output['url'] = $event->url;
		$output['is_booking_available'] = true;
	}

	if ( true === $output['is_booking_available'] ) {
		/**
		 * Check if we forced to display specific date to start the bookings.
		 */
		$force_booking_starts = get_field('define_when_eventbrite_booking_starts', 'option');
		$now = new \DateTime();
		if ( true === $force_booking_starts && $now < $booking_starts_at ) {
			$output['is_booking_available'] = false;
			$output['forced_booking_starts'] = true;
			return $output;
		}
	}

	return $output;
}

function boh_is_eventbrite_id_public($event_id) {
	/**
	 * 	1. Checks whether this eventbrite is not a private (draft,unpublished) event.
	 * 		a. Get all public events
	 * 		b. Loop over each event
	 * 		c. Check if $event_id exist on the list.
	 */
	if (
		! function_exists('eventbrite')
		|| ! function_exists('eventbrite_get_event')
		|| ! class_exists('Eventbrite_API')
	) {
		$plugins_url = plugins_url('eventbrite-api/inc');
		$plugins_path = wp_parse_url($plugins_url, PHP_URL_PATH);
		require_once ABSPATH . $plugins_path . '/class-eventbrite-api.php';
		require_once ABSPATH . $plugins_path . '/class-eventbrite-manager.php';
		require_once ABSPATH . $plugins_path . '/functions.php';
	}
	$page_current = 1;
	$init_query = eventbrite_get_events(array(
		'page' => $page_current
	));
	if ( isset($init_query->pagination) ) {
		$page_limit = $init_query->pagination->page_count;
		while( $page_current <= $page_limit ) {
			$q = eventbrite_get_events(array(
				'page' => $page_current
			));
			foreach ( $q->events as $e ) {
				if ( $event_id === $e->ID ) {
					return true;
				}
			}
			$page_current++;
		}
	}
	return false;
}

function fewbricks_brick($brick, $brick_name, $layout = null) {
	if ( !$brick || !$brick_name ) return false;
	if ( !$layout ) {
		eval('echo (new \fewbricks\bricks\\' . $brick . '("' . $brick_name . '"))->get_html();');
	} else {
		eval('echo (new \fewbricks\bricks\\' . $brick . '("' . $brick_name . '"))->get_html(false,"' . $layout . '");');
	}
}

add_filter('acf/settings/google_api_key', function () {
	$context = Timber::get_context();
	return $context['google_maps_api_key'];
});


/**
 * Allow svg files
 */
function cc_mime_types($mimes) {
	$mimes['svg'] = 'image/svg+xml';
	return $mimes;
}
add_filter('upload_mimes', 'cc_mime_types');

/**
 * Insert jQuery in header
 * Gravity Forms requires jQuery in the header in order for multi-file upload and AJAX to work :(
 */
function insert_jquery(){
	wp_enqueue_script('jquery', false, array(), false, false);
	wp_enqueue_script('jquery-ui','https://code.jquery.com/ui/1.12.1/jquery-ui.js');
	wp_enqueue_script('gravity-forms', plugins_url().'/gravityforms/js/gravityforms.min.js');
	wp_enqueue_script('gravity-forms-conditional', plugins_url().'/gravityforms/js/conditional_logic.min.js');
}
add_filter('wp_enqueue_scripts','insert_jquery',1);

/**
 * Gravity Forms
 */

add_filter( 'gform_validation_message', 'boh_gf_validation_message', 10, 2 );
function boh_gf_validation_message( $message, $form ) {
	return '';
}

add_action( 'gform_user_registered', 'boh_gf_registration_autologin',  10, 4 );
function boh_gf_registration_autologin( $user_id, $user_config, $entry, $password ) {
	$user = get_userdata( $user_id );
	$user_login = $user->user_login;
	$user_password = $password;

	wp_signon( array(
		'user_login' => $user_login,
		'user_password' => $user_password,
		'remember' => false
	) );

	echo "<script type='text/javascript'>window.top.location.reload(true);</script>";
}

/**
 * wp
 */

add_action( 'after_setup_theme', 'theme_setup' );
function theme_setup() {

	/* general */
	add_theme_support('post-thumbnails', array('page','post','building','event', 'sponsor', 'winner') );

	/* editor */
	add_editor_style();

	/* nav */
	register_nav_menus( array(
		'header_nav' => 'Header Nav'
	) );

	/* media */
	update_option('image_default_align', 'none' );
	update_option('image_default_link_type', 'none' );
	update_option('image_default_size', 'Large' );

	/* Image sizes */
	add_image_size( 'tile-image', 290, 190, true );
	add_image_size( 'building-tile-image', 438, 293, true );

}

function clean_wp_head() {
	remove_action( 'wp_head', 'feed_links_extra', 3 ); // Display the links to the extra feeds such as category feeds
	remove_action( 'wp_head', 'feed_links', 2 ); // Display the links to the general feeds: Post and Comment Feed
	remove_action( 'wp_head', 'rsd_link' ); // Display the link to the Really Simple Discovery service endpoint, EditURI link
	remove_action( 'wp_head', 'wlwmanifest_link' ); // Display the link to the Windows Live Writer manifest file.
	remove_action( 'wp_head', 'index_rel_link' ); // index link
	remove_action( 'wp_head', 'parent_post_rel_link', 10, 0 ); // prev link
	remove_action( 'wp_head', 'start_post_rel_link', 10, 0 ); // start link
	remove_action( 'wp_head', 'adjacent_posts_rel_link', 10, 0 ); // Display relational links for the posts adjacent to the current post.
	remove_action( 'wp_head', 'wp_generator' ); // Display the XHTML generator that is generated on the wp_head hook, WP version
}
add_action('init', 'clean_wp_head');
remove_action('wp_head', 'wp_generator');

add_action('init', 'init_remove_support',100);
function init_remove_support()
{
	$post_type = 'page';
	remove_post_type_support( $post_type, 'editor');
}

add_action('wp_logout','auto_redirect_after_logout');
function auto_redirect_after_logout(){
	wp_redirect( home_url() );
	exit();
}


add_action( 'restrict_manage_posts', 'filter_posts_by_taxonomies' , 10, 2);
function filter_posts_by_taxonomies( $post_type, $which ) {
	$taxonomies = null;
	// Apply this only on a specific post type
	if ( $post_type === 'building' ) {
		$taxonomies = array( 'building_precinct', 'building_type', 'building_ticket_type' );
	} else if ( $post_type === 'event' ) {
		$taxonomies = array( 'event_type', 'event_ticket_type' );
	} else if ( $post_type === 'sponsor' ) {
		$taxonomies = array( 'sponsor_type' );
	} else if ( $post_type === 'winner' ) {
		$taxonomies = array( 'winner_type', 'winner_year' );
	}

	if ( $taxonomies !== null ) {
		foreach ( $taxonomies as $taxonomy_slug ) {
			$taxonomy_obj = get_taxonomy( $taxonomy_slug );
			$taxonomy_name = $taxonomy_obj->labels->name;
			$terms = get_terms( $taxonomy_slug );

			// Display filter HTML
			echo "<select name='{$taxonomy_slug}' id='{$taxonomy_slug}' class='postform'>";
			echo '<option value="">' . sprintf( esc_html__( 'Show All %s', 'text_domain' ), $taxonomy_name ) . '</option>';
			foreach ( $terms as $term ) {
				printf(
					'<option value="%1$s" %2$s>%3$s (%4$s)</option>',
					$term->slug,
					( ( isset( $_GET[$taxonomy_slug] ) && ( $_GET[$taxonomy_slug] == $term->slug ) ) ? ' selected="selected"' : '' ),
					$term->name,
					$term->count
				);
			}
			echo '</select>';
		}
	}

}

add_shortcode( 'open_house_user_forms', 'open_house_user_forms_shortcode' );
function open_house_user_forms_shortcode($atts) {
	$open_house_user_forms = '<div class="open-house-user-forms">';
	$open_house_user_forms .= '<ul class="nav nav-tabs" role="tablist">
    <li class="user-register active" form-name="register"><a href="#register_form" aria-controls="register_form" role="tab" data-toggle="tab">Save my Favourites</a></li>
    <li class="user-login" form-name="login"><a href="#login_form" aria-controls="login_form" role="tab" data-toggle="tab">Login to Favourites</a></li>
    <li class="forgot-password" form-name="forgot-password"><a href="#forgot_password" aria-controls="forgot_password" role="tab" data-toggle="tab">Forgot Password</a></li>
    </ul>';
	$open_house_user_forms .= '<div class="tab-content">
    <div role="tabpanel" class="tab-pane active" id="register_form">'. do_shortcode('[gravityform id=3 title=false description=false ajax=true]') .'<div class="custom-footer">Have an account? <span class="toggle-login">Login Here<span></div></div>
    <div role="tabpanel" class="tab-pane" id="login_form">'. wp_login_form(array('echo'=>false, 'remember'=>true)) .'<div class="custom-footer"><span class="toggle-forgot-password">Forgot Password?</span></div></div>
    <div role="tabpanel" class="tab-pane" id="forgot_password">'. do_shortcode('[reset_password]') .'<div class="custom-footer"><span class="toggle-login">Cancel<span></div></div>
  </div>';
	$open_house_user_forms .= '<a class="modal-close" data-favorites-modal-close href="#modalClose"></a>';
	$open_house_user_forms .= '</div>';
	return $open_house_user_forms;
}



/* Building custom columns */

add_filter('manage_building_posts_columns', 'boh_manage_building_columns');
function boh_manage_building_columns( $columns ) {
	unset( $columns['date'] );
	$columns['public_liability_expiry_date']  = 'Liability Expiry';
	$columns['contacts_0_email']  = 'Email';
	$columns['contacts_0_phone']  = 'Phone';
	return $columns;
}

add_action( 'manage_building_posts_custom_column', 'boh_manage_building_content', 10, 2);
function boh_manage_building_content( $column_name, $post_id ) {
	if( $column_name == 'public_liability_expiry_date' ) {
		$exp_date = get_post_meta( $post_id, 'public_liability_expiry_date', true );
		echo (strtotime($exp_date))?date("j M Y", strtotime($exp_date)):'';
	}
	if( $column_name == 'contacts_0_email' ) {
		$contact_name = get_post_meta( $post_id, 'contacts_0_name', true );
		$contact_email = get_post_meta( $post_id, 'contacts_0_email', true );
		echo '<a href="mailto:'.$contact_email.'">'.$contact_name.'</a>';
	}
	if( $column_name == 'contacts_0_phone' ) {
		$contact_phone = get_post_meta( $post_id, 'contacts_0_phone', true );
		echo $contact_phone;
	}
}

/* Event custom columns */

add_filter('manage_event_posts_columns', 'boh_manage_event_columns');
function boh_manage_event_columns( $columns ) {
	unset( $columns['date'] );
	$columns['dates_0_date']  = 'First date';
	$columns['dates_1_date']  = 'Other dates';
	return $columns;
}

add_action( 'manage_event_posts_custom_column', 'boh_manage_event_content', 10, 2);
function boh_manage_event_content( $column_name, $post_id ) {

	if( $column_name == 'dates_0_date' ) {
		$first_date = strtotime(get_post_meta( $post_id, 'dates_0_date', true ));
		$first_date = ($first_date)?date('j M Y', $first_date):'';
		echo $first_date;
	}
	if( $column_name == 'dates_1_date' ) {
		$first_date = strtotime(get_post_meta( $post_id, 'dates_1_date', true ));
		$first_date = ($first_date)?date('j M Y', $first_date):'';
		$second_date = strtotime(get_post_meta( $post_id, 'dates_2_date', true ));
		$second_date = ($second_date)?date('j M Y', $second_date):'';
		echo $first_date . ($second_date?'<br>'.$second_date:'');
	}

}

add_filter( 'pre_get_posts', 'boh_io_cpt_search' );
/**
 * This function modifies the main WordPress query to include an array of
 * post types instead of the default 'post' post type.
 *
 * @param object $query  The original query.
 * @return object $query The amended query.
 */
function boh_io_cpt_search( $query ) {

	if ( $query->is_search ) {
		$query->set( 'post_type', array( 'post', 'event', 'building', 'page' ) );
	}

	return $query;

}

/* Add TinyMCE */
function my_mce_buttons( $buttons ) {
	array_unshift( $buttons, 'styleselect' );

	return $buttons;
}
add_filter( 'mce_buttons_2', 'my_mce_buttons' );

function wpex_styles_dropdown( $settings ) {

	$new_styles = array(
		[
			'title'	=> __( 'Buttons', 'wpex' ),
			'items'	=> [
				[
					'title'		=> __('Button Primary', 'wpex'),
					'selector'	=> 'a',
					'classes'	=> 'btn btn-primary',
				],
				[
					'title'		=> __('Button Default', 'wpex'),
					'selector'	=> 'a',
					'classes'	=> 'btn btn-default',
				],
			],
		],
	);

	$settings['style_formats_merge'] = false;

	$settings['style_formats'] = json_encode( $new_styles );

	return $settings;

}
add_filter( 'tiny_mce_before_init', 'wpex_styles_dropdown' );
