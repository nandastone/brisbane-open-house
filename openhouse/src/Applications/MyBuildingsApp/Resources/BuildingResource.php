<?php

namespace BOH\Applications\MyBuildingsApp\Resources;

class BuildingResource {

	private $post_id;

	private $form;

	private $status_fk;

	public function __construct()
	{
		$this->form = new FormResource();
		$this->status_fk = $this->form::FK_EDITORIAL_STATUS;
	}

	public function get($post_id) {
		if ( null !== get_post($post_id) ) {
			$this->post_id = $post_id;
		}
		return $this;
	}

	public function bump_status() {

		update_field( $this->status_fk, 'Submitted', $this->post_id );

		return get_field( $this->status_fk, $this->post_id );
	}

	public function get_status() {
		$current_status = get_field( $this->status_fk, $this->post_id );
		if ( is_array($current_status) ) $current_status = $current_status[0];
		return $current_status;
	}

}
