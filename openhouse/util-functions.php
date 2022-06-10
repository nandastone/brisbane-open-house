<?php
/**
 * Created by PhpStorm.
 * User: arvil
 * Date: 2019-05-01
 * Time: 09:49
 */

if ( ! function_exists('boh_debug') ) {
	/**
	 * Logs a variable to 'BOH_ERROR_LOG' file.
	 * WP_DEBUG constant must be set to true.
	 *
	 * @param mixed $var
	 * @param string $title
	 */
	function boh_debug( $var, string $title = '' ) {

		if (true !== WP_DEBUG) {
			return;
		}

		if ( ! defined( 'BOH_ERROR_LOG' ) ) {
			$destination = dirname(ABSPATH, 1) . '/dev.log';
		} else {
			$destination = BOH_ERROR_LOG;
		}

		$message = "\n";
		if ( '' !== $title ) {
			$message .= $title . "\n";
		}
		$message .= print_r($var, 1);

		error_log(
			$message,
			3,
			$destination
		);
	}
}

