<?php
/*
 * Template Name: [DEBUG] Migrate buildings
 *
 * @package BrisbaneOpenHouse
 * @author Arvil Meña <arvil@jsacreative.com.au>
 */

class MigrateBuildings
{

	public $args = array();

	private $query;

	public function __construct()
	{
		$this->args = [
			'post_type' => 'building',
			'posts_per_page' => -1,
			'post_status' => 'any',
			'orderby' => 'title',
		];

		$this->query = new \WP_Query($this->args);
	}

	public function getAllBuildings()
	{
		return $this->query->get_posts();
	}

	public function getTotal()
	{
		return $this->query->found_posts;
	}

	public function getQuery() {
		return $this->query;
	}

	public function getOldGallery($post_id) {
		return get_field('');
	}

}

$migration = new MigrateBuildings();

$totalBuildings = $migration->getTotal();

echo "Found <strong>{$totalBuildings}</strong> buildings." . "<br />";

echo "<pre>";
$i = 1;
if ( $migration->getQuery()->have_posts() ) {
	while ( $migration->getQuery()->have_posts() ) {
		$migration->getQuery()->the_post();
		echo $i . " - ".  get_the_title() . " <a href=\"" . get_edit_post_link() . "\">(edit)</a>" . "<br />";

		$newGallery = is_array( get_field('field_5cac834f2a1d0', get_the_ID(), false) ) ? get_field('field_5cac834f2a1d0', get_the_ID(), false) : array();
		$newGalleryCount = is_array( $newGallery ) ? count($newGallery) : 0;
		echo "&emsp;" . "Found <strong>$newGalleryCount</strong> \"<em>2019 images</em>\"" . "<br />";

		$newGalleryImageIds = array_column( $newGallery,'field_5cac83ae2a1d1' );

		foreach( $newGalleryImageIds as $oId ) {
			echo "<br />" . "&emsp;&emsp;" . "- #$oId" . "<br />";
		}

//		print_r( $newGallery );

		// old.
		echo "<br />";

		$oldGallery = is_array( get_field('images', get_the_ID(), false) ) ? get_field('images', get_the_ID(), false) : array();
		$oldGalleryCount = is_array( $oldGallery ) ? count($oldGallery) : 0;
		echo "&emsp;" . "Found <strong>$oldGalleryCount</strong> \"<em>2018 images</em>\"" . "<br />";

		$appendToNew = array();
		foreach( $oldGallery as $oId ) {

			$oIdObj = get_post( $oId );

			echo "<br />" . "&emsp;&emsp;" . "- #$oId" . "<br />";
			echo "&emsp;&emsp;&emsp;&emsp;" . "caption: {$oIdObj->post_excerpt}" . "<br />";
			echo "&emsp;&emsp;&emsp;&emsp;" . "description: {$oIdObj->post_content}" . "<br />";

			if ( strlen($oIdObj->post_excerpt) > 0 && strlen($oIdObj->post_content) === 0 ) {
				$creditToUse = $oIdObj->post_excerpt;
			}
			else if ( strlen($oIdObj->post_content) > 0 && strlen($oIdObj->post_excerpt) === 0 ) {
				$creditToUse = $oIdObj->post_content;
			}
			else if ( strlen($oIdObj->post_excerpt) > 0 && strlen($oIdObj->post_excerpt) < strlen($oIdObj->post_content) ) {
				$creditToUse = $oIdObj->post_excerpt;
			}
			else if ( strlen($oIdObj->post_content) > 0 && strlen($oIdObj->post_content) < strlen($oIdObj->post_excerpt) ) {
				$creditToUse = $oIdObj->post_content;
			} else {
				$creditToUse = "";
			}

			$creditToUse = str_replace( 'Image: ', '', $creditToUse );

//			$creditToUse = ( strlen( $oIdObj->post_excerpt ) > 0 ) ? $oIdObj->post_excerpt : $oIdObj->post_content;

			echo "&emsp;&emsp;" . "- <strong>Image credit to use:</strong> {$creditToUse}" . "<br />";

			if ( in_array( $oId, $newGalleryImageIds ) ) {
				echo "&emsp;&emsp;" . "- Skipping... already in the new gallery" . "<br />";
				continue;
			}
			$appendToNew[] = array(
				'field_5cac83ae2a1d1' => $oId, // image_id,
				'field_5cac83c42a1d2' => $creditToUse, // image credit,
			);
		}

		if ( ! empty( $appendToNew ) ) {

			echo "&emsp;" . "- To append: <strong>" . count($appendToNew) . "</strong> images" . "<br />";
//			print_r($appendToNew);

			$newValues = array_merge($appendToNew, $newGallery);

			echo "&emsp;" . "- Resulting to: <strong>" . count($newValues) . "</strong> total images" . "<br />";
//			print_r($newValues);

			echo "&emsp;" . "Updating..." . "<br />";
			update_field('field_5cac834f2a1d0', $newValues);
		} else {
			echo "&emsp;" . "- <strong>Nothing to update.</strong>" . "<br />";
		}

		echo "-----------------------------------------------------";
		echo "<br />";
		$i++;
	}
	/* Restore original Post Data */
	wp_reset_postdata();
}
echo "</pre>";
