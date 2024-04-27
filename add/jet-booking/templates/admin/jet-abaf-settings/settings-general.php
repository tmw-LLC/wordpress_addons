<div>
	<cx-vui-select
		label="<?php _e( 'Booking orders post type', 'jet-booking' ); ?>"
		description="<?php _e( 'Select the post type, which will record and store the booking orders. It could be called `Orders`. Once a new order is placed, the record will appear in the corresponding database table within the chosen post type.', 'jet-booking' ); ?>"
		:options-list="postTypes"
		:wrapper-css="[ 'equalwidth' ]"
		:size="'fullwidth'"
		:value="generalSettings.related_post_type"
		@input="updateSetting( $event, 'related_post_type' )"
	></cx-vui-select>
	<cx-vui-input
		label="<?php _e( 'Booking orders column name', 'jet-booking' ); ?>"
		description="<?php _e( 'Select the post type, which will record and store the booking orders. It could be called `Orders`. Once a new order is placed, the record will appear in the corresponding database table within the chosen post type. Give a name to the booking table column, which will store the currently booked order IDs (`order_id`). When the user submits the booking form, the order ID is generated automatically. It will appear on the related post type’s edit page.', 'jet-booking' ); ?>"
		:wrapper-css="[ 'equalwidth' ]"
		size="fullwidth"
		:value="generalSettings.related_post_type_column"
		@input="updateSetting( $event, 'related_post_type_column' )"
	></cx-vui-input>
	<cx-vui-select
		label="<?php _e( 'Booking instance post type', 'jet-booking' ); ?>"
		description="<?php _e( 'Select the post type containing the units to be booked (booking instances). Once selected, the related post IDs will be shown in the Bookings database table.', 'jet-booking' ); ?>"
		:options-list="postTypes"
		:wrapper-css="[ 'equalwidth' ]"
		:size="'fullwidth'"
		:value="generalSettings.apartment_post_type"
		@input="updateSetting( $event, 'apartment_post_type' )"
	></cx-vui-select>
	<cx-vui-switcher
		label="<?php _e( 'WooCommerce integration', 'jet-booking' ); ?>"
		description="<?php _e( 'Enable to connect the booking system with WooCommerce checkout.', 'jet-booking' ); ?>"
		:wrapper-css="[ 'equalwidth' ]"
		:value="generalSettings.wc_integration"
		@input="updateSetting( $event, 'wc_integration' )"
	></cx-vui-switcher>
	<cx-vui-select
		label="<?php _e( 'Filters storage type', 'jet-booking' ); ?>"
		description="<?php _e( 'Select the filter storage type for the searched date range.', 'jet-booking' ); ?>"
		:options-list="[
			{
				value: 'session',
				label: 'Session',
			},
			{
				value: 'cookies',
				label: 'Cookies',
			}
		]"
		:wrapper-css="[ 'equalwidth' ]"
		:size="'fullwidth'"
		:value="generalSettings.filters_store_type"
		@input="updateSetting( $event, 'filters_store_type' )"
	></cx-vui-select>
</div>
