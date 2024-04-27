<div class="jet-abaf-settings-schedule">
	<div class="jet-abaf-disabled-days jet-abaf-settings-schedule__column">
		<h4 class="cx-vui-subtitle"  slot="title"><?php esc_html_e( 'Disabled Days', 'jet-booking' ); ?></h4>
		<div class="cx-vui-component__desc"><?php esc_html_e( 'Select the days of the week that will be disabled for booking.', 'jet-booking' ); ?></div>

		<cx-vui-switcher
			label="<?php esc_html_e( 'Monday', 'jet-booking' ); ?>"
			:wrapper-css="[ 'equalwidth' ]"
			:return-true="true"
			:return-false="false"
			v-model="settings.disable_weekday_1"
			@input="updateSetting( $event, 'disable_weekday_1' )"
		></cx-vui-switcher>

		<cx-vui-switcher
			label="<?php esc_html_e( 'Tuesday', 'jet-booking' ); ?>"
			:wrapper-css="[ 'equalwidth' ]"
			:return-true="true"
			:return-false="false"
			v-model="settings.disable_weekday_2"
			@input="updateSetting( $event, 'disable_weekday_2' )"
		></cx-vui-switcher>

		<cx-vui-switcher
			label="<?php esc_html_e( 'Wednesday', 'jet-booking' ); ?>"
			:wrapper-css="[ 'equalwidth' ]"
			:return-true="true"
			:return-false="false"
			v-model="settings.disable_weekday_3"
			@input="updateSetting( $event, 'disable_weekday_3' )"
		></cx-vui-switcher>

		<cx-vui-switcher
			label="<?php esc_html_e( 'Thursday', 'jet-booking' ); ?>"
			:wrapper-css="[ 'equalwidth' ]"
			:return-true="true"
			:return-false="false"
			v-model="settings.disable_weekday_4"
			@input="updateSetting( $event, 'disable_weekday_4' )"
		></cx-vui-switcher>

		<cx-vui-switcher
			label="<?php esc_html_e( 'Friday', 'jet-booking' ); ?>"
			:wrapper-css="[ 'equalwidth' ]"
			:return-true="true"
			:return-false="false"
			v-model="settings.disable_weekday_5"
			@input="updateSetting( $event, 'disable_weekday_5' )"
		></cx-vui-switcher>

		<cx-vui-switcher
			label="<?php esc_html_e( 'Saturday', 'jet-booking' ); ?>"
			:wrapper-css="[ 'equalwidth' ]"
			:return-true="true"
			:return-false="false"
			v-model="settings.disable_weekend_1"
			@input="updateSetting( $event, 'disable_weekend_1' )"
		></cx-vui-switcher>

		<cx-vui-switcher
			label="<?php esc_html_e( 'Sunday', 'jet-booking' ); ?>"
			:wrapper-css="[ 'equalwidth' ]"
			:return-true="true"
			:return-false="false"
			v-model="settings.disable_weekend_2"
			@input="updateSetting( $event, 'disable_weekend_2' )"
		></cx-vui-switcher>
	</div>

	<div class="jet-abaf-days-off jet-abaf-settings-schedule__column">
		<cx-vui-collapse :collapsed="false">
			<h4 class="cx-vui-subtitle"  slot="title"><?php esc_html_e( 'Days Off', 'jet-booking' ); ?></h4>

			<div slot="content">
				<div class="jet-abaf-days-off__heading">
					<div class="cx-vui-component__desc"><?php esc_html_e( 'Set the days that will be the weekend.', 'jet-booking' ); ?></div>

					<cx-vui-button size="mini" button-style="accent" @click="showEditDay( 'days_off' )">
						<span slot="label"><?php esc_html_e( '+ Add Days', 'jet-booking' ); ?></span>
					</cx-vui-button>
				</div>
				<div class="jet-abaf-days-off__body">
					<div class="jet-abaf-days-off-schedule-slot" v-for="(offDate, key) in settings.days_off" :key="key">
						<div class="jet-abaf-days-off-schedule-slot__head">
							<div class="jet-abaf-days-off-schedule-slot__head-name">{{ offDate.name }}</div>

							<div class="jet-abaf-days-off-schedule-slot__head-actions">
								<span class="dashicons dashicons-edit" @click="showEditDay( 'days_off', offDate )"></span>

								<div style="position:relative;">
									<span class="dashicons dashicons-trash" @click="confirmDeleteDay( offDate )"></span>

									<div class="cx-vui-tooltip" v-if="deleteDayTrigger === offDate">
										<?php esc_html_e( 'Are you sure?', 'jet-booking' ); ?>
										<br>

										<span class="cx-vui-repeater-item__confrim-del" @click="deleteDay( 'days_off', offDate )">
										<?php esc_html_e( 'Yes', 'jet-booking' ); ?>
									</span>
										/
										<span class="cx-vui-repeater-item__cancel-del" @click="deleteDayTrigger = null">
										<?php esc_html_e( 'No', 'jet-booking' ); ?>
									</span>
									</div>
								</div>
							</div>
						</div>

						<div class="jet-abaf-days-off-schedule-slot__body">
							{{ offDate.start }}<span v-if=offDate.end> — {{ offDate.end }}</span>
						</div>
					</div>
				</div>
			</div>
		</cx-vui-collapse>
	</div>

	<cx-vui-popup
		v-model="editDay"
		body-width="600px"
		ok-label="<?php esc_html_e( 'Save', 'jet-booking' ) ?>"
		cancel-label="<?php esc_html_e( 'Cancel', 'jet-booking' ) ?>"
		@on-cancel="handleDayCancel"
		@on-ok="handleDayOk"
	>
		<div class="cx-vui-subtitle" slot="title">
			<?php esc_html_e( 'Select Days', 'jet-booking' ); ?>
		</div>

		<cx-vui-input
			label="<?php esc_html_e( 'Days Label', 'jet-booking' ); ?>"
			description="<?php esc_html_e( 'Name of the current day (eg. name of the holiday)', 'jet-booking' ); ?>"
			:wrapper-css="[ 'equalwidth' ]"
			size="fullwidth"
			v-model="date.name"
			slot="content"
		></cx-vui-input>

		<cx-vui-component-wrapper
			:wrapper-css="[ 'equalwidth' ]"
			label="<?php esc_html_e( 'Start Date *', 'jet-booking' ); ?>"
			description="<?php esc_html_e( 'Pick a start day', 'jet-booking' ); ?>"
			slot="content"
		>
			<vuejs-datepicker
				input-class="cx-vui-input size-fullwidth"
				placeholder="<?php esc_html_e( 'Select Date', 'jet-booking' ); ?>"
				:format="datePickerFormat"
				:disabled-dates="disabledDate"
				:value="secondsToMilliseconds( date.startTimeStamp )"
				:monday-first="true"
				@selected="selectedDate( $event, 'start' )"
			></vuejs-datepicker>
		</cx-vui-component-wrapper>

		<cx-vui-component-wrapper
			:wrapper-css="[ 'equalwidth' ]"
			label="<?php esc_html_e( 'End Date', 'jet-booking' ); ?>"
			description="<?php esc_html_e( 'Pick a end day', 'jet-booking' ); ?>"
			slot="content"
		>
			<vuejs-datepicker
				input-class="cx-vui-input size-fullwidth"
				placeholder="<?php esc_html_e( 'Select Date', 'jet-booking' ); ?>"
				:format="datePickerFormat"
				:disabled-dates="disabledDate"
				:value="secondsToMilliseconds( date.endTimeStamp )"
				:monday-first="true"
				@selected="selectedDate( $event, 'end' )"
			></vuejs-datepicker>
		</cx-vui-component-wrapper>
	</cx-vui-popup>
</div>