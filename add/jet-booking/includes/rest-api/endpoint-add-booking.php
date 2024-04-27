<?php

namespace JET_ABAF\Rest_API;

use JET_ABAF\Plugin;

class Endpoint_Add_Booking extends \Jet_Engine_Base_API_Endpoint {

	/**
	 * Name.
	 *
	 * Returns route name.
	 *
	 * @since  2.5.0
	 * @access public
	 *
	 * @return string
	 */
	public function get_name() {
		return 'add-booking';
	}

	/**
	 * Callback.
	 *
	 * API callback.
	 *
	 * @since  2.5.0
	 * @access public
	 *
	 * @param $request
	 *
	 * @return \WP_Error|\WP_HTTP_Response|\WP_REST_Response
	 */
	public function callback( $request ) {

		$params      = $request->get_params();
		$item        = ! empty( $params['item'] ) ? $params['item'] : [];
		$not_allowed = [ 'booking_id', 'apartment_unit', 'order_id' ];

		if ( empty( $item['check_in_date'] ) || empty( $item['check_out_date'] ) ) {
			return rest_ensure_response( [
				'success' => false,
				'data'    => __( 'Booking date is empty.', 'jet-booking' ),
			] );
		}

		foreach ( $not_allowed as $key ) {
			if ( isset( $item[ $key ] ) ) {
				unset( $item[ $key ] );
			}
		}

		if ( empty( $item ) ) {
			return rest_ensure_response( [
				'success' => false,
				'data'    => __( 'Booking could not be added.', 'jet-booking' ),
			] );
		}

		$item['check_in_date']  = strtotime( $item['check_in_date'] );
		$item['check_out_date'] = strtotime( $item['check_out_date'] );

		$is_available       = Plugin::instance()->db->booking_availability( $item );
		$is_dates_available = Plugin::instance()->db->is_booking_dates_available( $item );
		$column             = Plugin::instance()->settings->get( 'related_post_type_column' );

		if ( ! $is_available && ! $is_dates_available ) {
			ob_start();

			echo __( 'Selected dates are not available.', 'jet-booking' ) . '<br>';

			if ( Plugin::instance()->db->latest_result ) {
				echo __( 'Overlapping bookings: ', 'jet-booking' );

				$result = [];

				foreach ( Plugin::instance()->db->latest_result as $ob ) {
					if ( ! empty( $ob[ $column ] ) ) {
						$result[] = sprintf(
							'<a href="%s" target="_blank">#%s</a>',
							get_edit_post_link( $ob[ $column ] ),
							$ob[ $column ]
						);
					} else {
						$result[] = '#' . $ob['booking_id'];
					}
				}

				echo implode( ', ', $result ) . '.';
			}

			return rest_ensure_response( [
				'success'              => false,
				'overlapping_bookings' => true,
				'html'                 => ob_get_clean(),
				'data'                 => __( 'Can`t add this item', 'jet-booking' ),
			] );
		}

		Plugin::instance()->db->insert_booking( $item );

		return rest_ensure_response( [
			'success' => true,
		] );

	}

	/**
	 * Permission callback.
	 *
	 * Check user access to current end-point.
	 *
	 * @since  2.5.0
	 * @access public
	 *
	 * @return bool
	 */
	public function permission_callback( $request ) {
		return current_user_can( 'manage_options' );
	}

	/**
	 * Method.
	 *
	 * Returns endpoint request method - GET/POST/PUT/DELETE.
	 *
	 * @since  2.5.0
	 * @access public
	 *
	 * @return string
	 */
	public function get_method() {
		return 'POST';
	}

	/**
	 * Arguments.
	 *
	 * Returns arguments config.
	 *
	 * @since  2.5.0
	 * @access public
	 *
	 * @return array
	 */
	public function get_args() {
		return [];
	}

}