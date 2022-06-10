<?php

namespace BOH\Applications\MyBuildingsApp;

use BOH\Applications\MyBuildingsApp\Resources\Resources;
use BOH\Applications\MyBuildingsApp\RestEndpoints\RestEndpoints;


class MyBuildingsApp {

	private $resources;

	public function __construct() {
		$this->resources =  new Resources();
	}

	public function run() {

		$endpoints = new RestEndpoints( $this->resources );
		$endpoints->run();
	}
}
