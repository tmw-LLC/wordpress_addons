<div class="jet-apb-appointments-wrap">
	<header class="jet-apb-header">
		<h1 class="jet-apb-title"><?php esc_html_e( 'Appointments', 'jet-appointments-booking' ); ?></h1>
		<jet-apb-add-new-appointment
			v-if="isSet"
			:class="{ 'jet-apb-loading': isLoading, 'jet-apb-add-new': true, 'transition': true }"
		></jet-apb-add-new-appointment>
		<jet-apb-appointments-config v-if="isSet"></jet-apb-appointments-config>
		<div
			v-if="isLoading"
			class="jet-apb-main-notice">
			<h2><?php esc_html_e( 'Appointments is loading...', 'jet-appointments-booking' ); ?></h2>
		</div>
		<div
			v-else-if="! itemsList.length"
			class="jet-apb-main-notice jet-apb-main-notice-naf">
			<h2><?php esc_html_e( 'No appointments found.', 'jet-appointments-booking' ); ?></h2>
		</div>
		<jet-apb-appointments-view
			v-if="isSet"
			:class="{ 'jet-apb-loading': isLoading }"
		></jet-apb-appointments-view>
	</header>
	<div
		v-if="isSet"
		:class="{ 'jet-apb-loading': isLoading }"
	>
		<jet-apb-appointments-filter></jet-apb-appointments-filter>
		<component
			:is="curentView">
		</component>
		<jet-apb-popup></jet-apb-popup>
	</div>
	<div class="cx-vui-panel" v-else>
		<jet-apb-go-to-setup></jet-apb-go-to-setup>
	</div>
</div>
