<?php

namespace BOH\Applications\MyBuildingsApp\RestEndpoints\Endpoints;

use BOH\Applications\MyBuildingsApp\Resources\Resources;

class BuildingDetails extends BuildingList {

	const FK_ADDRESS = 'field_5b555f4bf6e67';
	const FK_DELIVERY = 'field_5b5543fb965b0';
	const FK_CONTACTS = 'field_5b55440b965b1';
	const FK_CONTACTS_NAME = 'field_5b554428965b2';
	const FK_CONTACTS_PHONE = 'field_5b55442d965b3';
	const FK_CONTACTS_EMAIL = 'field_5b554437965b4';
	const FK_CONTACTS_MOBILE = 'field_5b554445965b5';
	const FK_CONTACTS_IS_EVENT_DAY_CONTACT = 'field_5ca45b878c91a';

	public $resources;

	public function __construct(Resources $resources)
	{
		$this->resources = $resources;
		parent::__construct($resources);
	}

	public function endpoint_name(): string
	{
		return 'building_details';
	}

	public function endpoint_route() : string {
		return '/building-details/(?P<building_id>\d+)';
	}

	public function endpoint_route_base() : string {
		return '/building-details/';
	}

	public function endpoint_method(): string
	{
		return 'GET';
	}

	public function is_allowed_to_edit($building_id) {

		$args = array(
			'post_type' => 'building',
			'posts_per_page' => -1,
		);

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

		$query = new \WP_Query($args);

		$post_ids = wp_list_pluck( $query->posts, 'ID' );

		if ( false === in_array($building_id, $post_ids) ) {
			return false;
		}

		$status = strtolower( $this->resources->get_building($building_id)->get_status() );

		// check if building status 'Submitted'.
		if ( 'submitted' === $status ) {
			return false;
		}
		// check if building status 'Approved'.
		if ( 'approved' === $status ) {
			return false;
		}

		return true;
	}

	public function endpoint_callback( \WP_REST_Request $request ) : \WP_REST_Response {
		$data = array();

		// if neither building owner nor admin.
		if ( ! $this->is_building_owner() && ! $this->is_admin() ) {
			return new \WP_REST_Response( $data, 403  );
		}

		$building_id = $request->get_param( 'building_id' );
		$building_id = ( $building_id && filter_var( $building_id, FILTER_VALIDATE_INT ) ) ? (int) $building_id : null;

		// if not allowed to edit.
		if ( ! $this->is_allowed_to_edit($building_id) ) {
			return new \WP_REST_Response( $data, 403  );
		}

		$no_format = $request->get_query_params('no-format');

		$no_format = ( isset( $no_format ) ) ? $no_format : false;

		$format_value = ( ! $no_format );

		if ( ! $building_id ) {
			return new \WP_REST_Response($data);
		}

		$data['buildingId'] = $building_id;

		if ( true === $format_value ) {

			$building_details = $this->query($building_id);

		} else {

			$building_details = $this->query_no_format($building_id);

		}

		if ( $building_details ) {

			$data = array_merge( $data, $building_details );

		}

//		boh_debug( 'building GET Request' );

		return new \WP_REST_Response( $data );
	}

	private function query_no_format($building_id) {

		$post = get_post( $building_id );

		if ( null === $post ) {
			return null;
		}

		$output = array();

		$output = get_field_objects( $post->ID, false, true );

		$output = $this->resources->get_form()->filter_frontend_fields( $output );

		$output = $this->resources->get_form()->change_field_objects_key_to_field_key( $output );

		$output['WORDPRESS_POST_TITLE'] = array( 'value' => $post->post_title, 'key' => 'WORDPRESS_POST_TITLE', 'type' => 'text' );
		$output['WORDPRESS_POST_CONTENT'] = array( 'value' => $post->post_content, 'key' => 'WORDPRESS_POST_CONTENT', 'type' => 'textarea' );

		return $output;

	}

	private function query($building_id) {

		$post = get_post( $building_id );

		if ( null === $post ) {
			return null;
		}

		$output = array();

		$output['buildingName'] = $post->post_title;
		$output['buildingAddress'] = get_field(self::FK_ADDRESS, $post->ID);
		$output['deliveryAddress'] = get_field(self::FK_DELIVERY, $post->ID);

		// contacts
		$i=0;
		$contacts = get_field(self::FK_CONTACTS, $post->ID);
		foreach( $contacts as $contact ) {
			// max of 2 only
			if ( 2 === $i ) {
				break;
			}
			$output['contacts'][$i] = $contact;
			$i++;
		}

		return $output;
	}

}
