<?php

namespace BOH\Applications\MyBuildingsApp\Resources;

class Resources {

	private $template_resource;
	private $building_resource;
	private $form_resource;

	public function __construct() {
		$this->form_resource = new FormResource();
		$this->template_resource = new TemplateResource();
		$this->building_resource = new BuildingResource();
	}

	/**
	 * @param $post_id
	 * @return BuildingResource
	 */
	public function get_building($post_id) {
		return $this->building_resource->get($post_id);
	}

	public function get_form() {
		return $this->form_resource;
	}

	public function get_template() {
		return $this->template_resource;
	}
}
