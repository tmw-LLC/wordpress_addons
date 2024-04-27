<div class="jet-apb-filters">
	<div class="cx-vui-panel">
		<div class="jet-apb-nav-row">
			<div class="jet-apb-nav">
				<cx-vui-button
					@click="setMode( 'all' )"
					:button-style="modeButtonStyle( 'all' )"
					size="mini"
				>
					<template slot="label"><?php esc_html_e( 'All', 'jet-appointments-booking' ); ?></template>
				</cx-vui-button>
				<cx-vui-button
					@click="setMode( 'upcoming' )"
					:button-style="modeButtonStyle( 'upcoming' )"
					size="mini"
				>
					<template slot="label"><?php esc_html_e( 'Upcoming', 'jet-appointments-booking' ); ?></template>
				</cx-vui-button>
				<cx-vui-button
					@click="setMode( 'past' )"
					:button-style="modeButtonStyle( 'past' )"
					size="mini"
				>
					<template slot="label"><?php esc_html_e( 'Past', 'jet-appointments-booking' ); ?></template>
				</cx-vui-button>
			</div>
			<cx-vui-button
				v-if="! hideFilters"
				class="jet-apb-show-filters"
				@click="expandFilters = ! expandFilters"
				button-style="link-accent"
				size="mini"
			>
				<svg slot="label" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path d="M19.479 2l-7.479 12.543v5.924l-1-.6v-5.324l-7.479-12.543h15.958zm3.521-2h-23l9 15.094v5.906l5 3v-8.906l9-15.094z" fill="currentColor"/></svg>
				<span slot="label"><?php esc_html_e( 'Filters', 'jet-appointments-booking' ); ?></span>
			</cx-vui-button>
		</div>
		<div class="jet-apb-filters-row" v-if="expandFilters">
			<template v-for="( filter, name ) in filters">
				<cx-vui-component-wrapper
					v-if="isVisible( name, filter, 'date-picker' )"
					:wrapper-css="[ 'jet-apb-filter' ]"
					:label="filter.label"
				>
					<vuejs-datepicker
						input-class="cx-vui-input size-fullwidth"
						:value="curentFilters[ name ]"
						:format="dateFormat"
						:monday-first="true"
						placeholder="<?php esc_html_e( 'dd/mm/yyyy', 'jet-appointments-booking' ); ?>"
						@input="updateFilters( $event, name, filter.type )"
					></vuejs-datepicker>
					<span
						v-if="curentFilters[ name ]"
						class="jet-apb-date-clear"
						@click="updateFilters( '', name, filter.type )"
					>&times; <?php _e( 'Clear', 'jet-appointments-booking' ); ?></span>
				</cx-vui-component-wrapper>
				<cx-vui-select
					v-else-if="isVisible( name, filter, 'select' )"
					:key="name"
					:label="filter.label"
					:wrapper-css="[ 'jet-apb-filter' ]"
					:options-list="prepareObjectForOptions( filter.value )"
					:value="curentFilters[ name ]"
					@input="updateFilters( $event, name, filter.type )"
				>
				</cx-vui-select>
				<cx-vui-input
					v-else-if="isVisible( name, filter, 'search' )"
					:key="name"
					:label="filter.label"
					:wrapper-css="[ 'jet-apb-filter' ]"
					:value="curentFilters[ name ]"
					@on-blur="updateFilters( $event, name, filter.type )"
					@on-keyup.enter="updateFilters( $event, name, filter.type )"
				>
				</cx-vui-input>
			</template>
			<cx-vui-button
				v-if="curentFilters"
				class="jet-apb-clear-filters"
				@click="clearFilter()"
				button-style="accent-border"
				size="mini"
			>
				<template slot="label"><?php esc_html_e( 'Clear Filters', 'jet-appointments-booking' ); ?></template>
			</cx-vui-button>
		</div>
	</div>
</div>