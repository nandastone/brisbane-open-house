<?php
/**
 * Created by PhpStorm.
 * User: arvil
 * Date: 2019-06-19
 * Time: 07:00
 */

namespace BOH\PostTypeLogics;


class BuildingPostTypeLogic
{

	public function run() {
		$this->populate_eventbrite_field();
	}

	private function populate_eventbrite_field() {
		add_filter('acf/load_field/key=field_5d0841b166bd2', array($this, 'cb_populate_eventbrite_field'));
	}

	public function cb_populate_eventbrite_field( $field ) {
		if (
			! function_exists('eventbrite') || ! function_exists('eventbrite_get_event')
		) {
			$plugins_url = plugins_url('eventbrite-api/inc');
			$plugins_path = wp_parse_url($plugins_url, PHP_URL_PATH);
			require_once ABSPATH . $plugins_path . '/class-eventbrite-manager.php';
			require_once ABSPATH . $plugins_path . '/functions.php';
		}
		// reset choices
		$field['choices'] = array();

		if (
			! function_exists('eventbrite')
			|| ! function_exists('eventbrite_get_event')
			|| ! class_exists('Eventbrite_API')
		) {
			$plugins_url = plugins_url('eventbrite-api/inc');
			$plugins_path = wp_parse_url($plugins_url, PHP_URL_PATH);
			require_once ABSPATH . $plugins_path . '/class-eventbrite-api.php';
			require_once ABSPATH . $plugins_path . '/class-eventbrite-manager.php';
			require_once ABSPATH . $plugins_path . '/functions.php';
		}
		$user_owned_events = array();
		$page_current = 1;
		$init_query = eventbrite_get_events(array(
			'status' => 'all',
			'page' => $page_current
		));
		if ( isset($init_query->pagination) ) {
			$page_limit = $init_query->pagination->page_count;
			while( $page_current <= $page_limit ) {
				$q = eventbrite_get_events(array(
					'status' => 'all',
					'page' => $page_current
				));
				foreach ( $q->events as $e ) {
					$user_owned_events[$e->ID] = $e->post_title . ' (id: '.$e->ID.')';
				}
				$page_current++;
			}
//			boh_debug($user_owned_events, 'user_owned_events');
			$field['choices'] = $user_owned_events;
		}

		return $field;
	}

}
