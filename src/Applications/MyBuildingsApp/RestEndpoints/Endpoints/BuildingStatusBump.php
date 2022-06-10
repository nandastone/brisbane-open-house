<?php
/**
 * Created by PhpStorm.
 * User: arvil
 * Date: 2019-04-11
 * Time: 13:26
 */

namespace BOH\Applications\MyBuildingsApp\RestEndpoints\Endpoints;


use BOH\Applications\MyBuildingsApp\Resources\Resources;

class BuildingStatusBump extends BuildingDetailsUpdate
{

	public $resources;

	public function __construct(Resources $resources)
	{
		$this->resources = $resources;
		parent::__construct($resources);
	}

	public function endpoint_name(): string
	{
		return 'building_status_bump';
	}

	public function endpoint_route() : string {
		return '/building-status-bump/(?P<building_id>\d+)';
	}

	public function endpoint_route_base() : string {
		return '/building-status-bump/';
	}

	public function endpoint_method(): string
	{
		return 'POST';
	}

	public function endpoint_callback( \WP_REST_Request $request ) : \WP_REST_Response {
		$data = array();

		$building_id = $request->get_param( 'building_id' );
		$building_id = ( $building_id && filter_var( $building_id, FILTER_VALIDATE_INT ) ) ? (int) $building_id : null;

		if ( ! $building_id ) {
			return new \WP_REST_Response($data);
		}

		$data['request'] = $request->get_json_params();

		$data['result'] = $this->resources->get_building($building_id)->bump_status();

//		$data['result'] = $this->process($building_id, $data['request']);

		return new \WP_REST_Response( $data );
	}

	private function process($building_id, $input) {
		$output = array();

		$post = get_post( $building_id );

		if ( ! $building_id || null === $post ) {
			$output = false;
			return $output;
		}

		$input = filter_var_array($input, FILTER_SANITIZE_STRING);

		foreach ( $input as $key => $node ) {
			// check if key is in the allowed frontend fields array.
			if ( ! in_array( $key, $this->resources->get_form()->get_frontend_fields() ) ) {
				$output[ $key ] = 'NOT ALLOWED!';
				continue;
			}

			if ( !isset($node['value']) || null === $node['value'] ) continue;
			if ('WORDPRESS_POST_TITLE' === $key) {
				$update_arg = array( 'ID' => $building_id, 'post_title' => $node['value'] );
				$output['WORDPRESS_POST_TITLE'] = wp_update_post( $update_arg, false );
				if ( 0 !== $output['WORDPRESS_POST_TITLE'] ) {
					$output['WORDPRESS_POST_TITLE'] = get_the_title($output['WORDPRESS_POST_TITLE']);
				}
				continue;
			}
			if ('WORDPRESS_POST_CONTENT' === $key) {
				$update_arg = array( 'ID' => $building_id, 'post_content' => $node['value'] );
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

