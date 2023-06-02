<?php

namespace BOH\Applications\MyBuildingsApp\Resources;

class TemplateResource {

	public function get_dashboard_page_id() {
		$my_buildings_page = get_field('my_buildings_page', 'option')[0];
		return $my_buildings_page->ID;
	}

	public function building_list_title() {
		return get_field('building_list_intro_title', $this->get_dashboard_page_id());
	}

	public function building_list_paragraph() {
		return get_field('building_list_intro_paragraph', $this->get_dashboard_page_id());
	}

	public function building_form_title() {
		return get_field('form_intro_title', $this->get_dashboard_page_id());
	}

	public function building_form_paragraph() {
		return get_field('form_intro_paragraph', $this->get_dashboard_page_id());
	}

}
