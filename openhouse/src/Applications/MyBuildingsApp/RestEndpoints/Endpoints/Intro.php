<?php

namespace BOH\Applications\MyBuildingsApp\RestEndpoints\Endpoints;

use BOH\Applications\MyBuildingsApp\Resources\Resources;

class Intro implements EndpointsInterface {

	private $resources;

	public function __construct( Resources $resources )
	{
		$this->resources = $resources;
	}

	public function endpoint_name() : string {
		return 'intro';
	}

	public function endpoint_route() : string {
		return '/intro';
	}

	public function endpoint_route_base() : string {
		return $this->endpoint_route();
	}

	public function endpoint_method() : string {
		return 'GET';
	}

	public function endpoint_callback( \WP_REST_Request $request ) : \WP_REST_Response {
		$data = array();
		$data['building_list_title'] = $this->resources->get_template()->building_list_title();
		$data['building_list_paragraph'] = $this->resources->get_template()->building_list_paragraph();
		$data['building_form_title'] = $this->resources->get_template()->building_form_title();
		$data['building_form_paragraph'] = $this->resources->get_template()->building_form_paragraph();

		$response = new \WP_REST_Response( $data );

		return $response;
	}

	public function endpoint_args(): array
	{
		return array();
	}

	public function endpoint_permission_callback()
	{
		return null;
	}

}
