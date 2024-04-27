<div class="jet-abaf-bookings-add-new">
	<cx-vui-button
		button-style="accent"
		size="mini"
		@click="showAddDialog()"
	>
		<template slot="label"><?php esc_html_e( 'Add New', 'jet-booking' ); ?></template>
	</cx-vui-button>

	<cx-vui-popup
		v-model="addDialog"
		body-width="500px"
		ok-label="<?php esc_html_e( 'Add New', 'jet-booking' ) ?>"
		@on-cancel="addDialog = false"
		@on-ok="handleAdd"
	>
		<div class="cx-vui-subtitle" slot="title">
			<?php esc_html_e( 'Add New Booking:', 'jet-booking' ); ?>
		</div>

		<div
			class="jet-abaf-bookings-error"
			slot="content"
			v-if="overlappingBookings"
			v-html="overlappingBookings"
		></div>

		<div class="jet-abaf-details" slot="content">
			<br>

			<div class="jet-abaf-details__field jet-abaf-details__field-status">
				<div class="jet-abaf-details__label">Status:</div>

				<div class="jet-abaf-details__content">
					<select v-model="newItem.status">
						<option v-for="( label, value ) in statuses" :value="value" :key="value">
							{{ label }}
						</option>
					</select>
				</div>
			</div>

			<div class="jet-abaf-details__field jet-abaf-details__field-apartment_id">
				<div class="jet-abaf-details__label">Booking Item:</div>

				<div class="jet-abaf-details__content">
					<select  @change="onApartmentChange()" v-model="newItem.apartment_id">
						<option v-for="( label, value ) in bookingInstances" :value="value" :key="value">
							{{ label }}
						</option>
					</select>
				</div>
			</div>

			<div :class="[ 'jet-abaf-details__booking-dates',  { 'jet-abaf-disabled': isDisabled } ]" ref="jetABAFDatePicker">
				<div class="jet-abaf-details__check-in-date">
					<div class="jet-abaf-details__label">Check in:</div>
					<div class="jet-abaf-details__content">
						<input type="text" v-model="newItem.check_in_date" />
					</div>
				</div>

				<div class="jet-abaf-details__check-out-date">
					<div class="jet-abaf-details__label">Check out:</div>
					<div class="jet-abaf-details__content">
						<input type="text" v-model="newItem.check_out_date" />
					</div>
				</div>
			</div>

			<div class="jet-abaf-details__fields">
				<template v-for="field in fields">
					<div
						v-if="beVisible( field )"
						:key="field"
						:class="[ 'jet-abaf-details__field', 'jet-abaf-details__field-' + field ]"
					>
						<div class="jet-abaf-details__label">{{ field }}:</div>

						<div class="jet-abaf-details__content">
							<input type="text" v-model="newItem[ field ]" />
						</div>
					</div>
				</template>
			</div>
		</div>
	</cx-vui-popup>
</div>