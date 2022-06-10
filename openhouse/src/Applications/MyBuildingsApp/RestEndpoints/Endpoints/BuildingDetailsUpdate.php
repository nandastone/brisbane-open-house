<?php

namespace BOH\Applications\MyBuildingsApp\RestEndpoints\Endpoints;

use BOH\Applications\MyBuildingsApp\Resources\Resources;

class BuildingDetailsUpdate extends BuildingDetails {

	public $resources;

	public function __construct(Resources $resources)
	{
		$this->resources = $resources;
	}

	public function endpoint_name(): string
	{
		return 'building_details_update';
	}

	public function endpoint_route() : string {
		return '/building-details-update/(?P<building_id>\d+)';
	}

	public function endpoint_route_base() : string {
		return '/building-details-update/';
	}

	public function endpoint_method(): string
	{
		return 'POST';
	}

	public function endpoint_callback( \WP_REST_Request $request ) : \WP_REST_Response {
		$data = array();

		$building_id = $request->get_param( 'building_id' );
		$building_id = ( $building_id && filter_var( $building_id, FILTER_VALIDATE_INT ) ) ? (int) $building_id : null;

		// if not allowed to edit.
		if ( ! $this->is_allowed_to_edit($building_id) ) {
			return new \WP_REST_Response( $data, 403  );
		}

		if ( ! $building_id ) {
			return new \WP_REST_Response($data);
		}

		$data['request'] = $request->get_json_params();

//		boh_debug( 'building update POST Request received' );

		$data['result'] = $this->process($building_id, $data['request']);

		$data['status'] = 'success';

//		boh_debug( 'building update POST Request completed' );

		return new \WP_REST_Response( $data );
	}

	private function process($building_id, $input) {
		$output = array();

		$post = get_post( $building_id );

		if ( ! $building_id || null === $post ) {
			$output = false;
			return $output;
		}

//		error_log( "\n" . 'unfiltered ' . "\n" . print_r( $input,1  ) . "\n", 3, "D:/arvil/Projects/vhosted/brisbaneopenhouse.jsa.test/debug.txt" );

		$input = filter_var_array($input, FILTER_SANITIZE_STRING);

//		error_log( "\n" . 'filtered ' . "\n" . print_r( $input,1  ) . "\n", 3, "D:/arvil/Projects/vhosted/brisbaneopenhouse.jsa.test/debug.txt" );

		foreach ( $input as $key => $node ) {
			// check if key is in the allowed frontend fields array.
			if ( ! in_array( $key, $this->resources->get_form()->get_frontend_fields() ) ) {
				$output[ $key ] = 'NOT ALLOWED!';
				continue;
			}

			if ( !isset($node['value']) || null === $node['value'] ) continue;
			if ('WORDPRESS_POST_TITLE' === $key) {
				$post_title = $node['value'];
				$update_arg = array( 'ID' => $building_id, 'post_title' => $post_title );
				$output['WORDPRESS_POST_TITLE'] = wp_update_post( $update_arg, false );
				if ( 0 !== $output['WORDPRESS_POST_TITLE'] ) {
					$output['WORDPRESS_POST_TITLE'] = get_the_title($output['WORDPRESS_POST_TITLE']);
				}
				continue;
			}
			if ('WORDPRESS_POST_CONTENT' === $key) {
				$content = $node['value'];
				$update_arg = array( 'ID' => $building_id, 'post_content' => $content );
				$output['WORDPRESS_POST_CONTENT'] = wp_update_post( $update_arg, false );
				if ( 0 !== $output['WORDPRESS_POST_CONTENT'] ) {
					$updated_post = get_post($building_id);
					$output['WORDPRESS_POST_CONTENT'] = $updated_post->post_content;
				}
				continue;
			}

			if ('BUMP_STATUS' === $key) {
//				$output['BUMP_STATUS'] = $this->resources->get_building($building_id)->bump_status();
				$output['BUMP_STATUS'] = $node['value'];
				continue;
			}

//			TODO set for type.
//			$output[] = get_field_object($key, false, false);

			update_field($key, $node['value'], $building_id );
			$output[ $key ] = get_field($key, $building_id, true);


		}


		return $output;
	}

}
