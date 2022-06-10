<?php

namespace BOH\PostTypeLogics;


class PostTypeLogics
{

	public function run() {
		$building_post_type_logic = new BuildingPostTypeLogic();
		$building_post_type_logic->run();
	}

}
