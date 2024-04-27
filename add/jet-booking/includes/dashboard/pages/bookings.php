<?php
namespace JET_ABAF\Dashboard\Pages;

use JET_ABAF\Dashboard\Helpers\Page_Config;
use JET_ABAF\Plugin;

/**
 * Base dashboard page
 */
class Bookings extends Base {

	/**
	 * Page slug
	 *
	 * @return string
	 */
	public function slug() {
		return 'jet-abaf-bookings';
	}

	/**
	 * Page title
	 *
	 * @return string
	 */
	public function title() {
		return esc_html__( 'Bookings', 'jet-booking' );
	}

	/**
	 * Return  page config object
	 *
	 * @return [type] [description]
	 */
	public function page_config() {

		do_action( 'jet-abaf/dashboard/bookings-page/before-page-config' );

		return new Page_Config(
			$this->slug(),
			[
				'api'                => Plugin::instance()->rest_api->get_urls( false ),
				'bookings'           => $this->get_bookings(),
				'statuses'           => Plugin::instance()->statuses->get_schema(),
				'all_statuses'       => Plugin::instance()->statuses->get_statuses(),
				'columns'            => Plugin::instance()->db->get_default_fields(),
				'additional_columns' => Plugin::instance()->db->get_additional_db_columns(),
				'edit_link'          => add_query_arg( [
					'post'   => '%id%',
					'action' => 'edit',
				], admin_url( 'post.php' ) ),
			]
		);

	}

	/**
	 * Get bookings.
	 *
	 * Returns all registered bookings list.
	 *
	 * @since  2.0.0
	 * @since  2.5.5 Added `jet-abaf/dashboard/bookings-post-type/args` for additional args modification.
	 * @since  2.6.0 Code refactor.
	 * @access public
	 *
	 * @return array
	 */
	public function get_bookings() {

		$posts = Plugin::instance()->utils->get_booking_posts( 'jet-abaf/dashboard/bookings-page/post-type-args' );

		if ( empty( $posts ) ) {
			return [];
		}

		return wp_list_pluck( $posts, 'post_title', 'ID' );

	}

	/**
	 * Render.
	 *
	 * Page render function.
	 *
	 * @since  2.0.0
	 * @since  2.5.4 Added `jquery-date-range-picker` styles.
	 * @access public
	 */
	public function render() {
		?>
		<style type="text/css">
			.cell--id {
				flex: 0 0 4%;
			}
			.cell--booking_id {
				flex: 0 0 5%;
			}
			.cell--apartment_id,
			.cell--apartment_unit,
			.cell--check_in_date,
			.cell--check_out_date,
			.cell--order_id {
				flex: 0 0 12%;
			}
			.cell--status {
				flex: 0 0 30%;
				display: flex;
				justify-content: space-between;
				align-items: center;
			}
			.jet-abaf-actions button {
				margin: 0 0 0 10px;
			}

			.jet-abaf-details__field {
				display: flex;
				align-items: center;
				margin-bottom: 10px;
			}

			.jet-abaf-details__label {
				color: #23282d;
				font-weight: bold;
				flex: 0 1 150px;
			}

			.jet-abaf-details__content {
				flex: 1 1 auto;
			}

			.jet-abaf-details__content select,
			.jet-abaf-details__content input {
				margin: 0;
				max-width: 100%;
				width: 100%;
			}

			.jet-abaf-details__content .vdp-datepicker {
				width: 100%;
			}

			.jet-abaf-details__content .vdp-datepicker__calendar {
				max-width: 100%;
			}

			.jet-abaf-details .notice {
				margin: 0;
			}
			.jet-abaf-loading {
				opacity: .6;
			}
			.jet-abaf-bookings-error {
				font-size: 15px;
				line-height: 23px;
				color: #c92c2c;
				padding: 0 0 10px;
			}
			.cx-vui-popup__body {
				display: flex;
				flex-direction: column;
				justify-content: flex-start;
				align-items: stretch;
				max-height: calc(100% - 150px);
				overflow: hidden;
			}
			.cx-vui-popup__content {
				overflow-y: auto;
			}

			.jet-abaf-bookings-wrap {
				margin: 15px 26px 26px 6px;
			}

			.jet-abaf-header {
				display: flex;
				align-items: center;
				margin-bottom: 35px;
			}

			.jet-abaf-title {
				color: #23282D;
				font-size: 2.1em;
				font-weight: 400;
				display: inline-block;
				margin-right: 19px;
				letter-spacing: 0.4px;
			}

			.jet-abaf-details__booking,
			.jet-abaf-details__booking-dates {
				display: flex;
				margin-bottom: 25px;
			}

			.jet-abaf-details__booking-dates {
				position: relative;
				gap: 15px;
			}

			.jet-abaf-details__booking-dates.jet-abaf-disabled {
				opacity: .6;
				pointer-events: none;
			}

			.jet-abaf-details__booking-dates .date-picker-wrapper {
				left: 50% !important;
				transform: translateX( -50% );
			}

			.jet-abaf-details__booking > *,
			.jet-abaf-details__booking-dates > * {
				flex: 1 1 auto;
			}

			.jet-abaf-details__booking > * {
				display: flex;
			}
		</style>
		<div id="jet-abaf-bookings-page"></div>
		<?php
	}

	/**
	 * Assets.
	 *
	 * Dashboard page specific assets.
	 *
	 * @since  2.0.0
	 * @since  2.5.4 Added `moment-js`, `jquery-date-range-picker` scripts and style. Remove `vuejs-datepicker`.
	 * @access public
	 */
	public function assets() {

		$this->enqueue_script( 'vuex', 'admin/lib/vuex.min.js' );

		wp_register_script(
			'jet-plugins',
			JET_ABAF_URL . 'assets/lib/jet-plugins/jet-plugins.js',
			[ 'jquery' ],
			'1.1.0',
			true
		);

		wp_register_script(
			'moment-js',
			JET_ABAF_URL . 'assets/lib/moment/js/moment.js',
			[],
			'2.4.0',
			true
		);

		wp_enqueue_script(
			'jquery-date-range-picker-js',
			JET_ABAF_URL . 'assets/lib/jquery-date-range-picker/js/daterangepicker.min.js',
			[ 'jquery', 'moment-js', 'jet-plugins' ],
			JET_ABAF_VERSION,
			true
		);

		wp_enqueue_style(
			'jquery-date-range-picker-css',
			JET_ABAF_URL . 'assets/lib/jquery-date-range-picker/css/daterangepicker.min.css',
			[],
			JET_ABAF_VERSION
		);

		$this->enqueue_script( $this->slug(), 'admin/bookings.js' );

	}

	/**
	 * Page components templates
	 *
	 * @return [type] [description]
	 */
	public function vue_templates() {
		return array(
			'bookings',
			'bookings-list',
			'add-new-booking',
		);
	}

}