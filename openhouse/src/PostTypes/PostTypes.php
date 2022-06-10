<?php
/**
 * Created by PhpStorm.
 * User: arvil
 * Date: 2019-04-12
 * Time: 13:44
 */

namespace BOH\PostTypes;


class PostTypes
{

	public function run() {
		$bulding = new BuildingPostType();
		$bulding->run();
	}
}
