<?php

namespace BOH\Applications;

use BOH\Applications\MyBuildingsApp\MyBuildingsApp;

class Applications {

	public function run() {
		$my_buildings_app = new MyBuildingsApp();
		$my_buildings_app->run();
	}
}
