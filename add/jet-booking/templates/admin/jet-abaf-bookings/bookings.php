<div class="jet-abaf-bookings-wrap">
	<header class="jet-abaf-header">
		<h1 class="jet-abaf-title"><?php esc_html_e( 'Bookings', 'jet-booking' ); ?></h1>

		<jet-abaf-add-new-booking
			v-if="isSet"
			:class="{ 'jet-abaf-loading': isLoading }"
		></jet-abaf-add-new-booking>
	</header>

	<jet-abaf-bookings-list
		v-if="isSet"
		:class="{ 'jet-abaf-loading': isLoading }"
	></jet-abaf-bookings-list>

	<div class="cx-vui-panel" v-else>
		<jet-abaf-go-to-setup></jet-abaf-go-to-setup>
	</div>
</div>