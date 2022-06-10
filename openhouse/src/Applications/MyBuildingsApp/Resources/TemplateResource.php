<?php

namespace BOH\Applications\MyBuildingsApp\Resources;

class TemplateResource {

	public function get_dashboard_page() {
		return get_field('field_5ca2bbff7d360', 'option');
	}

	public function building_list_title() {
		return get_field('field_5ca2bb6c77c2b', $this->get_dashboard_page());
	}

	public function building_list_paragraph() {
		return get_field('field_5ca2bb8577c2c', $this->get_dashboard_page());
	}

	public function building_form_title() {
		return get_field('field_5cb0193618f85', $this->get_dashboard_page());
	}

	public function building_form_paragraph() {
		return get_field('field_5cb0195118f86', $this->get_dashboard_page());
	}

}
