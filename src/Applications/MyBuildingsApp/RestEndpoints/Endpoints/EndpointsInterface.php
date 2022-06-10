<?php

namespace BOH\Applications\MyBuildingsApp\RestEndpoints\Endpoints;

interface EndpointsInterface {

	public function endpoint_name() : string;

	public function endpoint_route() : string;

	public function endpoint_route_base() : string;

	public function endpoint_method() : string;

	public function endpoint_callback( \WP_REST_Request $request ) : \WP_REST_Response;

	public function endpoint_args() : array;

	public function endpoint_permission_callback();

}
