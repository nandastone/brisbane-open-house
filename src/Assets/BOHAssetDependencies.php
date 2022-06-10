<?php

namespace BOH\Assets;

use Symfony\Component\Asset\VersionStrategy\JsonManifestVersionStrategy;
use Symfony\Component\Asset\UrlPackage;
use Symfony\Component\Asset\VersionStrategy\StaticVersionStrategy;


class BOHAssetDependencies {

    private $style_handlers = [];

    private $script_handlers = [];

    private $package;

    private $version = '';

    public function __construct()
    {
        $this->package = new UrlPackage( '//cdnjs.cloudflare.com/ajax/libs/', new StaticVersionStrategy( $this->version ) );
        $this->script_handlers[] = array(
            'handler' => 'slick-carouselJS',
            'path' => '/slick-carousel/1.8.0/slick.min.js',
            'dependencies' => array( 'jquery' ),
        );
        $this->script_handlers[] = array(
            'handler' => 'jquery.maskJS',
            'path' => '/jquery.mask/1.14.15/jquery.mask.min.js',
            'dependencies' => array( 'jquery' ),
        );
    }

    public function enqueue() {
        // $this->register_styles();
        // $this->enqueue_styles();

        $this->register_scripts();
        $this->enqueue_scripts();
    }

    public function get_all_handlers() {
        return array_column($this->script_handlers, 'handler');
    }

    private function register_scripts() {
        add_action( 'wp_enqueue_scripts', array( $this, 'cb_register_scripts' ) );
    }

    public function cb_register_scripts() {
        foreach ( $this->script_handlers as $script ) {
            wp_register_script( $script['handler'],  $this->package->getUrl( $script['path'] ), $script['dependencies'], false, true );
        }
    }

    private function enqueue_scripts() {
        add_action( 'wp_enqueue_scripts', array( $this, 'cb_enqueue_scripts' ) );
    }

    public function cb_enqueue_scripts() {
        foreach ( $this->script_handlers as $handler ) {
            wp_enqueue_script( $handler['handler'] );
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
