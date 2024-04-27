<?php

namespace JET_ABAF;

class Utils {

	/**
	 * Get booking posts.
	 *
	 * Returns list of all created bookings posts.
	 *
	 * @since  2.6.1
	 * @access public
	 *
	 * @param string $hook Hook name.
	 *
	 * @return array|int[]|\WP_Post[]
	 */
	public function get_booking_posts( $hook = '' ) {

		$post_type = Plugin::instance()->settings->get( 'apartment_post_type' );

		if ( ! $post_type ) {
			return [];
		}

		$args = [
			'post_type'      => $post_type,
			'posts_per_page' => -1,
		];

		if ( $hook ) {
			$args = apply_filters( $hook, $args );
		}

		$posts = get_posts( $args );

		if ( ! $posts ) {
			return [];
		}

		return $posts;

	}

	/**
	 * Get invalid dates in range.
	 *
	 * Returns list of booked, disabled and off dates in defined range.
	 *
	 * @since  2.5.5
	 * @since  2.6.1 Added `$instance_id` parameter.
	 * @access public
	 *
	 * @param string        $from        First date of range in timestamp.
	 * @param string        $to          Last date of range in timestamp.
	 * @param string|number $instance_id Booking instance ID.
	 *
	 * @return array
	 */
	public function get_invalid_dates_in_range( $from, $to, $instance_id ) {

		$start = new \DateTime( date( 'Y-m-d', $from ) );
		$end   = new \DateTime( date( 'Y-m-d', $to ) );

		$end->modify( '+1 day' );

		$period = new \DatePeriod( $start, new \DateInterval( 'P1D' ), $end );

		if ( ! $period ) {
			return [];
		}

		$booked_dates  = Plugin::instance()->engine_plugin->get_off_dates( $instance_id );
		$disabled_days = Plugin::instance()->engine_plugin->get_disabled_days( $instance_id );
		$booked_range  = [];

		foreach ( $period as $key => $value ) {
			if ( in_array( $value->format( 'Y-m-d' ), $booked_dates ) || in_array( $value->format( 'w' ), $disabled_days ) ) {
				$booked_range[] = $value->format( 'Y-m-d' );
			}
		}

		sort( $booked_range );

		return $booked_range;

	}

}
