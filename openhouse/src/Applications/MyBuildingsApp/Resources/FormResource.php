<?php

namespace BOH\Applications\MyBuildingsApp\Resources;

class FormResource {

	const FK_OWNER = 'field_5caf437763fc7';
	const FK_EDITORIAL_STATUS = 'field_5caec9af32826';
	const FK_BUMP_STATUS = 'BUMP_STATUS';

	const FK_WORDPRESS_POST_TITLE = 'WORDPRESS_POST_TITLE';
	const FK_WORDPRESS_POST_CONTENT = 'WORDPRESS_POST_CONTENT';
	const FK_ADDRESS = 'field_5b555f4bf6e67';
	const FK_DELIVERY = 'field_5b5543fb965b0';
	const FK_CONTACTS = 'field_5b55440b965b1';
	const FK_OPEN_DAYS = 'field_5ca6f467dcaed';
	const FK_OTHER_DAY = 'field_62a06a74a9626';
	const FK_SATURDAY_OPENING_HOURS = 'field_5caae315ec23c';
	const FK_SUNDAY_OPENING_HOURS = 'field_5cac85c49acb3';
	const FK_TYPE_OF_ACCESS = 'field_5b5556ab03a05';
	const FK_TYPE_OF_ACCESS_OTHER = 'field_5b55576803a06';
	const FK_FREQ_GUIDED_TOURS = 'field_5b5666f19561d';
	const FK_TOUR_TIPS = 'field_5cabf2fc71031';
	const FK_TOUR_TIPS_OTHER = 'field_5cabf7c469ed2';
	const FK_DRESS_REQUIREMENTS = 'field_5cabf7e969ed3';
	const FK_WHEELCHAIR_ACCESS = 'field_5b5670cf9b1ae';
	const FK_GUIDED_TOURS_ON_SUN_SAT = 'field_5cabf84669ed4';
	const FK_GUIDED_TOURS_ON_SUN_SAT_NO = 'field_5cabf85f69ed5';
	const FK_ADDITIONAL_ACTIVITIES_WEEKEND_BOOL = 'field_5cabf89e69ed6';
	const FK_ADDITIONAL_ACTIVITIES_WEEKEND = 'field_5cabf8b969ed7';
	const FK_ADDITIONAL_ACTIVITIES_WEEKEND_OTHER = 'field_5cabf8ef69ed8';
	const FK_WOULD_LIKE_TO_APPLY_FOR_VOLUNTEERS = 'field_5cac415211938';
	const FK_BUILDING_SHOULD_BE_PRE_BOOKED = 'field_5cac43b5e7c32';
//	const FK_FREQ_GUIDED_TOURS_PREBOOKED = 'field_5cac415211938';
	const FK_TOUR_MAXIMUM_CAPACITY = 'field_5cac43cae7c33';
	// DETAILS ABOUT YOUR BUILDING
	const FK_ARCHITECT_S = 'field_5b4bfd944a5c9';
	const FK_ARCHITECT_ADDITIONAL = 'field_5cb40d7cb1a22';
	const FK_YEAR_BUILT = 'field_5b4bfd094a5c8';
	const FK_ARCHITECTURAL_AWARDS = 'field_5b555e5b4f01b';
	const FK_ENVIRONMENTAL_ACCREDITATION = 'field_5cac809e03e7f';
	const FK_WEBSITE = 'field_5b4bfdbb4a5ca';
	const FK_IS_HERITAGE_LISTED = 'field_5b555e774f01c';
	// INSURANCE
	const FK_HAS_PL_INSURANCE = 'field_5cac821b3a483';
	const FK_PL_EXPIRY_DATE = 'field_5b555bb7097d8';
	const FK_PL_FILE = 'field_5cac82913a484';
	// PHOTOGRAPHS
	const FK_IMAGES = 'field_5cac834f2a1d0';
	// OTHER INFORMATION
	const FK_NOTES = 'field_5cac851a43b82';

	private $frontend_fields = array();

	public function __construct() {
		$this->frontend_fields = array(
			// SPECIAL FIELDS
			self::FK_BUMP_STATUS,

			// WORDPRESS NATIVE.
			self::FK_WORDPRESS_POST_TITLE,
			self::FK_WORDPRESS_POST_CONTENT,

			// OTHER INFORMATION
			self::FK_NOTES,

			// IMAGES
			self::FK_IMAGES,

			// INSURANCE
			self::FK_HAS_PL_INSURANCE,
			self::FK_PL_EXPIRY_DATE,
			self::FK_PL_FILE,

			// DETAILS ABOUT YOUR BUILDING
			self::FK_ARCHITECT_S,
			self::FK_ARCHITECT_ADDITIONAL,
			self::FK_YEAR_BUILT,
			self::FK_ARCHITECTURAL_AWARDS,
			self::FK_ENVIRONMENTAL_ACCREDITATION,
			self::FK_WEBSITE,
			self::FK_IS_HERITAGE_LISTED,

			self::FK_ADDRESS,
			self::FK_DELIVERY,
			self::FK_CONTACTS,
			self::FK_OPEN_DAYS,
			self::FK_OTHER_DAY,
			self::FK_SATURDAY_OPENING_HOURS,
			self::FK_SUNDAY_OPENING_HOURS,
			self::FK_TYPE_OF_ACCESS,
			self::FK_TYPE_OF_ACCESS_OTHER,
			self::FK_FREQ_GUIDED_TOURS,
			self::FK_TOUR_TIPS,
			self::FK_TOUR_TIPS_OTHER,
			self::FK_DRESS_REQUIREMENTS,
			self::FK_WHEELCHAIR_ACCESS,
			self::FK_GUIDED_TOURS_ON_SUN_SAT,
			self::FK_GUIDED_TOURS_ON_SUN_SAT_NO,
			self::FK_ADDITIONAL_ACTIVITIES_WEEKEND_BOOL,
			self::FK_ADDITIONAL_ACTIVITIES_WEEKEND,
			self::FK_ADDITIONAL_ACTIVITIES_WEEKEND_OTHER,
			self::FK_WOULD_LIKE_TO_APPLY_FOR_VOLUNTEERS,
			self::FK_BUILDING_SHOULD_BE_PRE_BOOKED,
			self::FK_TOUR_MAXIMUM_CAPACITY,
		);
	}

	public function get_all(bool $format_value = true) {
		$output = array();

		$unfiltered_acf_fields = acf_get_fields('group_5b4558a0c7ac6');
		$filtered_acf_fields = $this->filter_frontend_fields($unfiltered_acf_fields);

		if ( ! empty( $filtered_acf_fields ) ) {
			$output = $filtered_acf_fields;

			if (false === $format_value) {
				$output = $this->change_field_objects_key_to_field_key($output);
			}
		}

		$output[self::FK_WORDPRESS_POST_TITLE] = array( 'label' => 'Building Name', 'name' =>  'building_name', 'key' => self::FK_WORDPRESS_POST_TITLE, 'type' => 'text' );
		$output[self::FK_WORDPRESS_POST_CONTENT] = array( 'label' => 'Building Description', 'name' =>  'building_desciption', 'key' => self::FK_WORDPRESS_POST_CONTENT, 'type' => 'textarea', 'rows' => 20 );
		$output[self::FK_BUMP_STATUS] = array( 'label' => '', 'name' =>  'bump_status', 'key' => self::FK_BUMP_STATUS, 'type' => 'checkbox', 'choices' => array( 'I confirm that all building details are completed and correct' ) );
		return $output;
	}

	public function filter_frontend_fields( array $field_objects ) {
		$fefs = $this->frontend_fields;
		return array_filter( $field_objects, function($field) use ($fefs) {
			return ( !empty($field['key']) && in_array($field['key'], $fefs) );
		} );
	}

	public function change_field_objects_key_to_field_key( array $field_objects ) {
		$new_array = array();
		foreach ( $field_objects as $field_object ) {
			$new_array[ $field_object['key'] ] = $field_object;
		}
		return $new_array;
	}

	public function get_frontend_fields() {
		return $this->frontend_fields;
	}

}
