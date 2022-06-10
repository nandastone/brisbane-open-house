<?php
/**
 * Created by PhpStorm.
 * User: arvil
 * Date: 2019-04-17
 * Time: 10:37
 */

namespace BOH\Applications\MyBuildingsApp\RestEndpoints\Endpoints;


use BOH\Applications\MyBuildingsApp\Resources\Resources;

class Attachment extends ImageUrlById
{

	public $resources;

	public function __construct(Resources $resources)
	{
		$this->resources = $resources;
	}

	public function endpoint_name(): string
	{
		return 'attachment_by_id';
	}

	public function endpoint_route() : string {
		return '/attachment-by-id/(?P<attachment_id>\d+)';
	}

	public function endpoint_route_base() : string {
		return '/attachment-by-id/';
	}

	public function endpoint_method(): string
	{
		return 'POST';
	}

	public function endpoint_callback( \WP_REST_Request $request ) : \WP_REST_Response {
		$data = array();

		$attachment_id = $request->get_param( 'attachment_id' );
		$attachment_id = ( $attachment_id && filter_var( $attachment_id, FILTER_VALIDATE_INT ) ) ? (int) $attachment_id : null;

		if ( ! $attachment_id ) {
			return new \WP_REST_Response($data, 404);
		}

		$data['request']['attachment_id'] = $attachment_id;

		$url = wp_get_attachment_url($attachment_id);

		if ( false === $url ) {
			return new \WP_REST_Response( $data, 500 );
		} else {
			$data['output']['attachment_url'] = $url;
			$data['output']['attachment_name'] = basename( $url );
		}

		return new \WP_REST_Response( $data );
	}
}
