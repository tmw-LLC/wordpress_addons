<?php

namespace JET_ABAF\Compatibility\Packages;

use JET_ABAF\Plugin;

class WPML {

	public function __construct() {

		add_filter( 'jet-abaf/db/initial-apartment-id', [ $this, 'set_initial_booking_item_id' ] );
		add_filter( 'jet-abaf/dashboard/bookings-page/post-type-args', [ $this, 'set_additional_post_type_args' ] );

		add_action( 'jet-abaf/dashboard/bookings-page/before-page-config', [ $this, 'set_required_page_language' ] );

	}

	/**
	 * Set initial apartment id.
	 *
	 * Returns a booking item id in the default site language.
	 *
	 * @since  2.5.5
	 * @access public
	 *
	 * @param int|string $id Apartment post type ID.
	 *
	 * @return mixed|void
	 */
	public function set_initial_booking_item_id( $id ) {

		$default_lang = apply_filters( 'wpml_default_language', NULL );
		$post_type    = Plugin::instance()->settings->get( 'apartment_post_type' );

		return apply_filters( 'wpml_object_id', $id, $post_type, FALSE, $default_lang );

	}

	/**
	 * Set additional post type args.
	 *
	 * Returns booking post type arguments with additional option so we can see only default language posts.
	 *
	 * @since  2.5.5
	 * @access public
	 *
	 * @param array $args List of post arguments.
	 *
	 * @return mixed
	 */
	public function set_additional_post_type_args( $args ) {

		$args['suppress_filters'] = 0;

		return $args;

	}

	/**
	 * Set required page language.
	 *
	 * Switch language to default for proper posts display in bookings list.
	 *
	 * @since  2.5.5
	 * @access public
	 */
	public function set_required_page_language() {

		$default_lang = apply_filters( 'wpml_default_language', NULL );

		do_action( 'wpml_switch_language', $default_lang );

	}

}

new WPML();