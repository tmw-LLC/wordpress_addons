<?php

namespace JET_ABAF;

/**
 * Upgrader class
 */
class Upgrade {

	/**
	 * Settings.
	 *
	 * @var array
	 */
	public $settings = [];

	public function __construct() {

		$this->to_2_0();

		$this->settings = Plugin::instance()->settings->get_all();

		$db_updater = jet_engine()->framework->get_included_module_data( 'cherry-x-db-updater.php' );

		new \CX_DB_Updater(
			[
				'path'      => $db_updater['path'],
				'url'       => $db_updater['url'],
				'slug'      => 'jet-booking',
				'version'   => '2.6.0',
				'callbacks' => [
					'2.5.0' => [
						[ $this, 'update_db_2_5_0' ],
					],
					'2.6.0' => [
						[ $this, 'update_db_2_6_0' ],
					],
				],
				'labels'    => [
					'start_update' => __( 'Start Update', 'jet-booking' ),
					'data_update'  => __( 'Data Update', 'jet-booking' ),
					'messages'     => [
						'error'   => __( 'Module DB Updater init error in %s - version and slug is required arguments', 'jet-booking' ),
						'update'  => __( 'We need to update your database to the latest version.', 'jet-booking' ),
						'updated' => __( 'DB Update complete, thank you for updating to the latest version!', 'jet-booking' ),
					],
				],
			]
		);

	}

	/**
	 * Update db updater to 2.5.0.
	 */
	public function update_db_2_5_0() {

		$schedule_settings = [
			'days_off',
			'disable_weekday_1',
			'disable_weekday_2',
			'disable_weekday_3',
			'disable_weekday_4',
			'disable_weekday_5',
			'disable_weekend_1',
			'disable_weekend_2',
		];

		if ( $this->settings ) {
			foreach ( $schedule_settings as $setting ) {
				if ( ! isset( $this->settings[ $setting ] ) ) {
					$default_setting = Plugin::instance()->settings->get( $setting );

					Plugin::instance()->settings->update( $setting, $default_setting );
				}
			}
		}

	}

	/**
	 * Update db updater to 2.6.0.
	 */
	public function update_db_2_6_0() {

		$new_settings = [
			'start_day_offset',
			'min_days',
			'max_days',
		];

		if ( $this->settings ) {
			foreach ( $new_settings as $setting ) {
				if ( ! isset( $this->settings[ $setting ] ) ) {
					$default_setting = Plugin::instance()->settings->get( $setting );

					Plugin::instance()->settings->update( $setting, $default_setting );
				}
			}
		}

	}

	/**
	 * Check DB requirements for 2.0 version and show upgrade notice
	 *
	 * @return [type] [description]
	 */
	public function to_2_0() {
		add_action( 'admin_init', function () {

			if ( ! Plugin::instance()->db->is_bookings_table_exists() ) {
				return;
			}

			if ( ! Plugin::instance()->db->column_exists( 'status' ) ) {
				Plugin::instance()->db->insert_table_columns( array( 'status' ) );
			}

			if ( Plugin::instance()->dashboard->is_dashboard_page() ) {
				if ( ! Plugin::instance()->db->column_exists( 'import_id' ) ) {
					Plugin::instance()->db->insert_table_columns( array( 'import_id' ) );
				}
			}

			$wc_integration = Plugin::instance()->settings->get( 'wc_integration' );

			if ( $wc_integration ) {

				$additional_columns = Plugin::instance()->settings->get( 'additional_columns' );
				$has_order_id_col   = false;

				if ( ! empty( $additional_columns ) ) {
					foreach ( $additional_columns as $col ) {

						if ( ! empty( $col['column'] ) && 'order_id' === $col['column'] ) {
							$has_order_id_col = true;
						}

					}
				}

				if ( ! $has_order_id_col ) {

					if ( ! is_array( $additional_columns ) ) {
						$additional_columns = array();
					}

					$additional_columns[] = array( 'column' => 'order_id' );

					Plugin::instance()->settings->update( 'additional_columns', $additional_columns );

					if ( ! Plugin::instance()->db->column_exists( 'order_id' ) ) {
						Plugin::instance()->db->insert_table_columns( array( 'order_id' ) );
					}

				}

			}

		} );
	}

}
