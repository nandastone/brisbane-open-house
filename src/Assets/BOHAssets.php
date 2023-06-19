<?php

namespace BOH\Assets;

use Symfony\Component\Asset\Package;
use Symfony\Component\Asset\VersionStrategy\JsonManifestVersionStrategy;


class BOHAssets {

	private $style_handlers = [];

	private $script_handlers = [];

	private $dependencies = [];

	private $package;

	public function __construct()
	{
		$this->package = new Package( new JsonManifestVersionStrategy( get_template_directory() . '/dist/manifest.json' ) );
		$this->script_handlers[] = 'main.js';
		$this->style_handlers[] = 'globalStyles.css';
		$this->script_handlers[] = 'globalStyles.js';
	}

	public function set_dependencies(array $array) {
		if ( ! empty($array) ) {
			$this->dependencies = $array;
		}
	}

	public function enqueue() {
		$this->register_styles();
		$this->enqueue_styles();

		$this->register_scripts();
		$this->enqueue_scripts();
	}

	private function register_scripts() {
		add_action( 'wp_enqueue_scripts', array( $this, 'cb_register_scripts' ) );
	}

	public function cb_register_scripts() {
		foreach ( $this->script_handlers as $handler ) {
			wp_register_script( $handler,  $this->package->getUrl( $handler ), $this->dependencies, false, true );
		}

		wp_localize_script('main.js', 'appSettings', [
			'GOOGLE_MAPS_API_KEY' => get_field('google_maps_api_key', 'option')
		]);
	}

	private function enqueue_scripts() {
		add_action( 'wp_enqueue_scripts', array( $this, 'cb_enqueue_scripts' ) );
	}

	public function cb_enqueue_scripts() {
		foreach ( $this->script_handlers as $handler ) {
			wp_enqueue_script( $handler );
		}
	}

	private function register_styles() {
		add_action( 'wp_enqueue_scripts', array( $this, 'cb_register_styles' ) );
	}

	public function cb_register_styles() {
		foreach ( $this->style_handlers as $handler ) {
			wp_register_style( $handler,  $this->package->getUrl( $handler ) );
		}
	}

	private function enqueue_styles() {
		add_action( 'wp_enqueue_scripts', array( $this, 'cb_enqueue_styles' ) );
	}

	public function cb_enqueue_styles() {
		foreach ( $this->style_handlers as $handler ) {
			wp_enqueue_style( $handler );
		}
	}

}
