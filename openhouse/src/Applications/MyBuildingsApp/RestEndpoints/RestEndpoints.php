<?php

namespace BOH\Applications\MyBuildingsApp\RestEndpoints;

use BOH\Applications\MyBuildingsApp\Resources\Resources;
use BOH\Applications\MyBuildingsApp\RestEndpoints\Callbacks\BuildingListCallback;
use BOH\Applications\MyBuildingsApp\RestEndpoints\Endpoints\Attachment;
use BOH\Applications\MyBuildingsApp\RestEndpoints\Endpoints\BuildingAddFile;
use BOH\Applications\MyBuildingsApp\RestEndpoints\Endpoints\BuildingAddImage;
use BOH\Applications\MyBuildingsApp\RestEndpoints\Endpoints\BuildingStatusBump;
use BOH\Applications\MyBuildingsApp\RestEndpoints\Endpoints\ImageUrlById;
use BOH\Applications\MyBuildingsApp\RestEndpoints\Endpoints\Intro;
use BOH\Applications\MyBuildingsApp\RestEndpoints\Endpoints\EndpointsInterface;
use BOH\Applications\MyBuildingsApp\RestEndpoints\Endpoints\BuildingList;
use BOH\Applications\MyBuildingsApp\RestEndpoints\Endpoints\BuildingDetails;
use BOH\Applications\MyBuildingsApp\RestEndpoints\Endpoints\BuildingDetailsUpdate;
use BOH\Applications\MyBuildingsApp\RestEndpoints\Endpoints\BuildingFormFields;

class RestEndpoints {

	private $endpoints = array();

	private $resources;

	const REST_NAMESPACE = 'my-buildings-app/v1';

	public function __construct(Resources $resources)
	{
		$this->resources = $resources;
	}

	public function add_endpoint( EndpointsInterface $endpoint_class ) {
		$this->endpoints[] = $endpoint_class;
	}

	public function localize_endpoints() {
		$endpoints = $this->endpoints;
		add_action( 'wp_enqueue_scripts', function() use ($endpoints) {
			$data = array();
			$data['nonce_header'] = wp_create_nonce( 'wp_rest' );
			$data['logout_url'] = wp_logout_url( trailingslashit( home_url() ) . 'my-buildings/' );
			foreach ($endpoints as $endpoint) {
				$data[ $endpoint->endpoint_name() ] = get_rest_url(null, self::REST_NAMESPACE . $endpoint->endpoint_route_base());
			}
			wp_localize_script( 'myBuildings.js', 'myBuildingsApp', $data );
		} );
	}

	public function register_endpoints() {
		$endpoints = $this->endpoints;
		add_action( 'rest_api_init', function () use ($endpoints) {
			foreach( $endpoints as $endpoint ) {
				$args = array(
					'methods' => $endpoint->endpoint_method(),
					'callback' => array( $endpoint, 'endpoint_callback' ),
				);
				if ( ! empty( $endpoint->endpoint_args() ) ) {
					$args['args'] = $endpoint->endpoint_args();
				}
				if ( $endpoint->endpoint_permission_callback() ) {
					$pcb = $endpoint->endpoint_permission_callback();
					$args['permission_callback'] = function() use ($pcb) {
						return $pcb;
					};
				}
				register_rest_route( self::REST_NAMESPACE, $endpoint->endpoint_route(), $args );
			}
		} );
	}

	public function run() {

		$this->add_endpoint( new Intro( $this->resources ) );
		$this->add_endpoint( new BuildingList( $this->resources ) );
		$this->add_endpoint( new BuildingDetails( $this->resources ) );
		$this->add_endpoint( new BuildingDetailsUpdate( $this->resources ) );
		$this->add_endpoint( new BuildingFormFields( $this->resources ) );
		$this->add_endpoint( new BuildingStatusBump( $this->resources ) );
		$this->add_endpoint( new BuildingAddImage( $this->resources ) );
		$this->add_endpoint( new ImageUrlById( $this->resources ) );
		$this->add_endpoint( new BuildingAddFile( $this->resources ) );
		$this->add_endpoint( new Attachment( $this->resources ) );

		$this->register_endpoints();

		$this->localize_endpoints();
	}
}
