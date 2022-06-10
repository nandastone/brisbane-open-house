<?php
/**
 * Created by PhpStorm.
 * User: arvil
 * Date: 2019-04-12
 * Time: 13:45
 */

namespace BOH\PostTypes;


class BuildingPostType
{
	const POST_TYPE = 'building';

	public function cb_add_editorial_status_column($columns) {
		$columns['editorial_status'] = 'Editorial Status';
		return $columns;
	}

	public function cb_add_building_owner_column($columns) {
		$columns['building_owners'] = 'Building Owners';
		return $columns;
	}

	public function cb_populate_added_columns( $column, $post_id ) {
		switch ( $column ) {
			case 'editorial_status' :
				$status = get_field('field_5caec9af32826', $post_id);
				echo ( is_array($status) ) ? $status[0] : $status;
			break;

			case 'building_owners' :
				$owner_ids = get_field('field_5caf437763fc7', $post_id, true);
				$owners = array();
				if ( ! empty($owner_ids) ) {
					if ( is_array($owner_ids) ) {
						foreach( $owner_ids as $owner_id ) {
							$owners[] = get_userdata( $owner_id )->user_login;
						}
					} else {
						$owners[] = get_userdata( $owner_ids )->user_login;
					}
				}
				echo implode(', ', $owners);
			break;
		}
	}


	private function add_editorial_status_column() {
		add_filter( 'manage_' . self::POST_TYPE . '_posts_columns', array( $this, 'cb_add_editorial_status_column' ) );
	}

	private function add_building_owner_column() {
		add_filter( 'manage_' . self::POST_TYPE . '_posts_columns', array( $this, 'cb_add_building_owner_column' ) );
	}

	private function populate_added_columns() {
		add_action( 'manage_' . self::POST_TYPE . '_posts_custom_column' , array( $this, 'cb_populate_added_columns' ), 10, 2 );
	}

	public function run() {
		$this->add_editorial_status_column();
		$this->add_building_owner_column();
		$this->populate_added_columns();
	}
}
