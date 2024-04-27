<?php

namespace JET_ABAF\Rest_API;

use JET_ABAF\Plugin;

class Endpoint_Booked_Dates extends \Jet_Engine_Base_API_Endpoint {

	public function get_name() {
		return 'booked-dates';
	}

	public function callback( $request ) {

		$params = $request->get_params();
		$item   = ! empty( $params['item'] ) ? $params['item'] : array();

		if ( empty( $item ) ) {
			return rest_ensure_response( [
				'success' => false,
				'data'    => __( 'No data to check booked dates.', 'jet-booking' ),
			] );
		}

		$apartment_id = $item['apartment_id'];

		if ( empty( $apartment_id ) ) {
			return rest_ensure_response( [
				'success' => false,
				'data'    => __( 'Incorrect item data.', 'jet-booking' ),
			] );
		}

		$apartment_price = new \JET_ABAF\Price( $apartment_id );
		$booked_dates    = Plugin::instance()->engine_plugin->get_off_dates( $apartment_id );

		return rest_ensure_response( [
			'success'          => true,
			'booked_dates'     => $booked_dates,
			'disabled_days'    => Plugin::instance()->engine_plugin->get_disabled_days( $apartment_id ),
			'booked_next'      => Plugin::instance()->engine_plugin->get_next_booked_dates( $booked_dates ),
			'checkout_only'    => Plugin::instance()->settings->checkout_only_allowed(),
			'per_nights'       => Plugin::instance()->engine_plugin->is_per_nights_booking(),
			'labels'           => Plugin::instance()->settings->get_labels(),
			'custom_labels'    => Plugin::instance()->settings->get( 'use_custom_labels' ),
			'weekly_bookings'  => Plugin::instance()->engine_plugin->get_config_option( $apartment_id, 'weekly_bookings' ),
			'week_offset'      => Plugin::instance()->engine_plugin->get_config_option( $apartment_id, 'week_offset' ),
			'one_day_bookings' => Plugin::instance()->settings->is_one_day_bookings( $apartment_id ),
			'start_day_offset' => Plugin::instance()->engine_plugin->get_config_option( $apartment_id, 'start_day_offset' ),
			'min_days'         => Plugin::instance()->engine_plugin->get_config_option( $apartment_id, 'min_days' ),
			'max_days'         => Plugin::instance()->engine_plugin->get_config_option( $apartment_id, 'max_days' ),
			'seasonal_price'   => $apartment_price->seasonal_price->get_price(),
		] );

	}

	public function permission_callback( $request ) {
		return current_user_can( 'manage_options' );
	}

	public function get_method() {
		return 'POST';
	}

	public function get_args() {
		return [];
	}

}