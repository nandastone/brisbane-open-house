<?php

namespace BOH\Applications\MyBuildingsApp\RestEndpoints\Endpoints;

use BOH\Applications\MyBuildingsApp\Resources\Resources;

class BuildingFormFields extends BuildingDetails {

	public $resources;

	public function __construct(Resources $resources)
	{
		$this->resources = $resources;
	}

	public function endpoint_name(): string
	{
		return 'building_form_fields';
	}

	public function endpoint_route() : string {
		return '/building-form-fields';
	}

	public function endpoint_route_base() : string {
		return $this->endpoint_route();
	}

	public function endpoint_method(): string
	{
		return 'GET';
	}

	public function endpoint_callback( \WP_REST_Request $request ) : \WP_REST_Response {
		$data = array();


		$no_format = $request->get_query_params('no-format');

		$no_format = ( isset( $no_format ) ) ? $no_format : false;

		$format_value = ( ! $no_format );

		$data = $this->resources->get_form()->get_all($format_value);

		return new \WP_REST_Response( $data );
	}

}
