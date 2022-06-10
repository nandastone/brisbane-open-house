<?php
/**
 * Created by PhpStorm.
 * User: arvil
 * Date: 2019-04-14
 * Time: 21:24
 */

namespace BOH\Applications\MyBuildingsApp\RestEndpoints\Endpoints;


use BOH\Applications\MyBuildingsApp\Resources\Resources;

class ImageUrlById extends BuildingDetailsUpdate
{

	public $resources;

	public function __construct(Resources $resources)
	{
		$this->resources = $resources;
	}

	public function endpoint_name(): string
	{
		return 'image_url_by_id';
	}

	public function endpoint_route() : string {
		return '/image-url-by-id/(?P<image_id>\d+)';
	}

	public function endpoint_route_base() : string {
		return '/image-url-by-id/';
	}

	public function endpoint_method(): string
	{
		return 'POST';
	}

	public function endpoint_callback( \WP_REST_Request $request ) : \WP_REST_Response {
		$data = array();

		$image_id = $request->get_param( 'image_id' );
		$image_id = ( $image_id && filter_var( $image_id, FILTER_VALIDATE_INT ) ) ? (int) $image_id : null;

		if ( ! $image_id ) {
			return new \WP_REST_Response($data);
		}

		$data['request']['image_id'] = $image_id;

		$url = wp_get_attachment_image_url($image_id,'medium');

		if ( false === $url ) {
			return new \WP_REST_Response( $data, 500 );
		} else {
			$data['output']['image_url'] = $url;
		}

		return new \WP_REST_Response( $data );
	}
}
