<?php

namespace BOH\Applications\MyBuildingsApp\RestEndpoints\Endpoints;

use BOH\Applications\MyBuildingsApp\Resources\Resources;

class BuildingList extends Intro {

	/**
	 * @var Resources
	 */
	public $resources;

	public function __construct(Resources $resources)
	{
		$this->resources = $resources;
		parent::__construct($resources);
	}

	public function endpoint_name(): string
	{
		return 'building_list';
	}

	public function endpoint_route() : string {
		return '/building-list';
	}

	public function endpoint_method(): string
	{
		return 'GET';
	}

	public function is_admin() : bool {

		$user = get_user_by('id', get_current_user_id());

		return in_array('administrator', (array) $user->roles );
	}

	public function is_building_owner() : bool {

		$user = get_user_by('id', get_current_user_id());

		return in_array('building_owner', (array) $user->roles );
	}

	public function endpoint_callback( \WP_REST_Request $request ) : \WP_REST_Response {

		$data = array();

		// if neither building owner nor admin.
		if ( ! $this->is_building_owner() && ! $this->is_admin() ) {
			return new \WP_REST_Response( $data, 403  );
		}

		$paged_param = ( isset( $request->get_query_params()['paged'] ) ) ? (int) $request->get_query_params()['paged'] : 1;
		$paged = ( $paged_param && filter_var( $paged_param, FILTER_VALIDATE_INT ) ) ? max( 1, $paged_param ) : 1;

		$post_id_param = ( isset( $request->get_query_params()['post_id'] ) ) ? (int) $request->get_query_params()['post_id'] : null;
		$post_id = ( $post_id_param && filter_var( $post_id_param, FILTER_VALIDATE_INT ) ) ? $post_id_param : null;

		$args = array( 'paged' => $paged );
		if ($post_id) {
			$args['p'] = $post_id;
		}

		if ( $this->is_building_owner() ) {
			$args['meta_query'] = array(
				'relation'		=> 'AND',
				array(
					'key'	 	=> 'building_owner',
					'value'	  	=> get_current_user_id(),
					'compare' 	=> 'IN',
				),
			);
		}

		$query = $this->query( $args );

		// get status.
		$status_fk = $this->resources->get_form()::FK_EDITORIAL_STATUS;

		$data['max_num_pages'] = $query->max_num_pages;
		$data['paged'] = $query->query_vars['paged'];
		$data['buildings'] = array();
		while ( $query->have_posts() ) :
			$query->the_post();
			$status = is_array( get_field($status_fk, get_the_ID()) ) ? get_field($status_fk, get_the_ID())[0] : get_field($status_fk, get_the_ID());
			$status = ( 'to complete' === strtolower($status) ) ? 'In Progress' : $status;
			$data['buildings'][ get_the_ID() ]['status'] = $status;
			$data['buildings'][ get_the_ID() ]['name'] = get_the_title();
			$data['buildings'][ get_the_ID() ]['image'] = get_the_post_thumbnail_url(get_the_ID(),'medium');
		endwhile;
		wp_reset_postdata();

		return new \WP_REST_Response( $data );
	}

	private function query( $args = array() ) {

		$args['post_type'] = 'building';

		$query = new \WP_Query($args);

		return $query;
	}

}
