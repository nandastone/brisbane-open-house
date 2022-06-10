<?php

namespace BOH;

use BOH\Assets\Assets;
use BOH\Applications\Applications;
use BOH\PostTypeLogics\BuildingPostTypeLogic;
use BOH\PostTypes\PostTypes;


class BOH {

	public function cb_add_building_owner_role() {
		if ( null === get_role('building_owner') ) {
			add_role(
				'building_owner',
				'Building Owner',
				array(
					'read' => true,
				)
			);
		}
	}

	public function cb_redirect_building_owners_to_building_dashboard_on_login( $redirect_to, $request, $user ) {

		if (isset($user->roles) && is_array($user->roles)) {
			//check for subscribers
			if (in_array('building_owner', $user->roles)) {
				// redirect them to another URL, in this case, the homepage
				$redirect_to =  trailingslashit( home_url() ) . 'my-buildings/';
			}
		}

		return $redirect_to;
	}

	public function cb_wp_login_failed() {

		$server_uri = $_SERVER['REQUEST_URI'];
		$server_referrer = $_SERVER['HTTP_REFERER'];
		if (
			isset( $server_uri, $server_referrer )
			&& 1 === preg_match( '/login/', $server_uri )
			&& 1 === preg_match( '/my-buildings/', $server_referrer )
		) {
			wp_redirect( '/my-buildings/?error=true' );
			exit;
		}

	}

	public function cb_redirect_building_owners_to_building_dashboard_on_reset_pass( $location, $status ) {

		$server_uri = $_SERVER['REQUEST_URI'];
		$options = get_option( 'somfrp_gen_settings' );

		$reset_success_page = ( isset( $options['somfrp_reset_success_page'] ) && $options['somfrp_reset_success_page'] )
			? get_permalink( intval( $options['somfrp_reset_success_page'] ) )
			: som_get_lost_password_url() . '?som_password_reset=true' ;

		$parsed_url = parse_url( $server_uri );

		if ( ! isset( $parsed_url['query'] ) || empty( $parsed_url['query'] ) ) {
			return $location;
		}

		parse_str( $parsed_url['query'], $parse_str );

		if ( ! isset( $parse_str['login'] ) || empty( $parse_str['login'] ) ) {
			return $location;
		}

		$user = get_user_by( 'login', $parse_str['login'] );

		if (
			$user
			&& ! empty( $user->roles )
			&& in_array( 'building_owner', $user->roles )
			&& $reset_success_page === $location
		) {
			$location = '/my-buildings/';
		}

		return $location;
	}

	private function add_building_owner_role() {
		add_action('after_switch_theme', array( $this, 'cb_add_building_owner_role' ));
	}

	private function redirect_building_owners_to_building_dashboard_on_login() {
		add_filter( 'login_redirect', array( $this, 'cb_redirect_building_owners_to_building_dashboard_on_login' ), 99999999, 3 );
		add_action( 'wp_login_failed', array( $this, 'cb_wp_login_failed') );
	}

	private function on_switch_theme_functions() {
		$this->add_building_owner_role();
	}

	private function redirect_building_owners_to_building_dashboard_on_reset_pass() {
		add_filter( 'wp_redirect', array( $this, 'cb_redirect_building_owners_to_building_dashboard_on_reset_pass' ), 99, 2 );
	}

	public function run() {
		$this->on_switch_theme_functions();
		$this->redirect_building_owners_to_building_dashboard_on_login();
		$this->redirect_building_owners_to_building_dashboard_on_reset_pass();

		$assets = new Assets();
		$assets->enqueue_assets();

		$applications = new Applications();
		$applications->run();

		$post_types = new PostTypes();
		$post_types->run();

		$post_type_logics = new BuildingPostTypeLogic();
		$post_type_logics->run();
	}
}
