(function () {

	"use strict";

	const eventHub = new Vue();
	const { __, sprintf } = wp.i18n;
	const buildQuery = function( params ) {
		return Object.keys( params ).map( function( key ) {
			return key + '=' + params[ key ];
		} ).join( '&' );
	}

	// Mixin for handling booking fields.
	const fieldsManager = {
		computed: Vuex.mapState( {
			bookingItem: 'bookingItem',
			dateRangePickerConfig: 'dateRangePickerConfig',
			isDisabled: 'isDisabled',
			datePickerIsActive: 'datePickerIsActive'
		} ),
		methods: {
			initDateRangePicker: function () {

				let self = this;

				store.dispatch( 'getDateRangePickerConfig' ).then( function () {
					jQuery( self.$refs.jetABAFDatePicker ).dateRangePicker( self.dateRangePickerConfig )
						.bind( 'datepicker-first-date-selected', () => {
							store.commit( 'setValue', {
								key: 'datePickerIsActive',
								value: true
							} );
						} ).bind( 'datepicker-change', () => {
							store.commit( 'setValue', {
								key: 'datePickerIsActive',
								value: false
							} );
						} );
				} );

			},
			beVisible: function ( key ) {
				switch ( key ) {
					case 'booking_id':
					case 'apartment_unit':
					case 'order_id':
					case 'status':
					case 'apartment_id':
					case 'check_in_date':
					case 'check_in_date_timestamp':
					case 'check_out_date':
					case 'check_out_date_timestamp':
						return false;
					default:
						return true;
				}
			},
			onApartmentChange: function () {
				this.initDateRangePicker();
			},
		}
	};

	const store = new Vuex.Store( {
		state: {
			...window.JetABAFConfig,
			perPage: 30,
			offset: 0,
			totalItems: 0,
			itemsList: [],
			isLoading: true,
			overlappingBookings: false,
			bookingItem: {},
			dateRangePickerConfig: {},
			isDisabled: false,
			datePickerIsActive: false
		},
		mutations: {
			setValue( state, varObject ) {
				state[ varObject.key ] = varObject.value;
			},
		},
		actions: {
			getItems: function() {

				store.commit( 'setValue', {
					key: 'isLoading',
					value: true
				} );

				wp.apiFetch( {
					method: 'get',
					path: window.JetABAFConfig.api.bookings_list + '?' + buildQuery( {
						per_page: store.state.perPage,
						offset: store.state.offset,
					} ),
				} ).then( function( response ) {

					store.commit( 'setValue', {
						key: 'isLoading',
						value: false
					} );

					if ( response.success ) {
						store.commit( 'setValue', {
							key: 'itemsList',
							value: response.data
						} );

						if ( ! store.state.totalItems ) {
							store.commit( 'setValue', {
								key: 'totalItems',
								value: parseInt( response.total, 10 )
							} );
						}
					}

				} ).catch( function( e ) {

					store.commit( 'setValue', {
						key: 'isLoading',
						value: false
					} );

					eventHub.$CXNotice.add( {
						message: e.message,
						type: 'error',
						duration: 7000,
					} );

				} );

			},
			getDateRangePickerConfig: async function() {

				store.commit( 'setValue', {
					key: 'isDisabled',
					value: true
				} );

				const bookingItem = store.state.bookingItem;

				await wp.apiFetch( {
					method: 'post',
					path: window.JetABAFConfig.api.booked_dates,
					data: { item: bookingItem }
				} ).then( function( response ) {
					if ( ! response.success ) {
						self.$CXNotice.add( {
							message: response.data,
							type: 'error',
							duration: 7000,
						} );
					} else {
						const
							perNights = response.per_nights,
							excludedDates = response.booked_dates,
							disabledDays = response.disabled_days,
							checkoutOnly = response.checkout_only,
							excludedNext = response.booked_next,
							labels = response.labels,
							startDayOffset = response.start_day_offset,
							minDays = response.min_days,
							maxDays = response.max_days;

						window.JetABAFConfig.seasonal_price = response.seasonal_price;
						window.JetABAFConfig.start_day_offset = startDayOffset;
						window.JetABAFConfig.min_days = minDays;
						window.JetABAFConfig.max_days = maxDays;

						let config = {
							autoClose: true,
							separator: ' - ',
							startOfWeek: 'monday',
							getValue: function () {
								if ( bookingItem.check_in_date && bookingItem.check_out_date ) {
									return bookingItem.check_in_date + ' - ' + bookingItem.check_out_date;
								} else {
									return '';
								}
							},
							setValue: function ( s, s1, s2 ) {
								if ( s === s1 ) {
									s2 = s1;
								}

								bookingItem.check_in_date = s1;
								bookingItem.check_out_date = s2;
							},
							startDate: startDayOffset ? moment().add( Number( startDayOffset ), 'd' ) : new Date(),
							minDays: minDays ? Number( minDays ) : perNights ? 1 : 0,
							maxDays: maxDays ? Number( maxDays ) : 0,
							perNights: perNights,
							container: '.jet-abaf-details__booking-dates',
							beforeShowDay: function( t ) {
								let formated = moment( t ).format( 'YYYY-MM-DD' ),
									valid = true,
									_class = '',
									_tooltip = '';

								if ( disabledDays.length && 0 <= disabledDays.indexOf( t.getDay() ) ) {
									valid = false;
								}

								if ( excludedDates.length && 0 <= excludedDates.indexOf( formated ) ) {
									valid = false;
									_class = 'booked';
									_tooltip = labels.booked;

									// Mark first day of booked period as checkout only
									if ( checkoutOnly ) {
										let next = moment( t ).add( 1, 'd' ).format( 'YYYY-MM-DD' );
										let prev = moment( t ).subtract( 1, 'd' ).format( 'YYYY-MM-DD' );

										if ( 0 <= excludedNext.indexOf( next ) || ( 0 <= excludedDates.indexOf( next ) && -1 === excludedDates.indexOf( prev ) ) ) {
											if ( store.state.datePickerIsActive ) {
												valid = true;
												_tooltip = '';
												_class = '';
											} else {
												_class = 'tmp only-checkout';
												_tooltip = labels.only_checkout;
											}
										}
									}
								}

								// If is single night booking - exclude next day for checkout only days.
								if ( checkoutOnly && store.state.datePickerIsActive && 0 <= excludedNext.indexOf( formated ) ) {
									valid = false;
									_class = 'booked';
									_tooltip = labels.booked;
								}

								return window.JetPlugins.hooks.applyFilters( 'jet-booking.date-range-picker.date-show-params', [ valid, _class, _tooltip ], t );
							},
							excludedDates: excludedDates,
							selectForward: true,
						};

						if ( response.custom_labels ) {
							jQuery.dateRangePickerLanguages['custom'] = labels;
							config.language = 'custom';
						}

						if ( response.weekly_bookings ) {
							config.batchMode = 'week';
							config.showShortcuts = false;

							if ( response.week_offset ) {
								config.weekOffset = Number( response.week_offset );
							}
						} else if ( response.one_day_bookings ) {
							config.singleDate = true;
						}

						config = window.JetPlugins.hooks.applyFilters( 'jet-booking.input.config', config );

						store.commit( 'setValue', {
							key: 'dateRangePickerConfig',
							value: config
						} );

						store.commit( 'setValue', {
							key: 'isDisabled',
							value: false
						} );
					}

				} ).catch( function( e ) {
					self.$CXNotice.add( {
						message: e.message,
						type: 'error',
						duration: 7000,
					} );
				} );

			}
		}
	} );

	Vue.component( 'jet-abaf-bookings-list', {
		template: '#jet-abaf-bookings-list',
		mixins: [ fieldsManager ],
		data: function() {
			return {
				deleteDialog: false,
				deleteItem: false,
				detailsDialog: false,
				currentItem: false,
				currentIndex: false,
				editDialog: false,
			};
		},
		computed: Vuex.mapState( {
			itemsList: 'itemsList',
			perPage: 'perPage',
			offset: 'offset',
			totalItems: 'totalItems',
			statuses: state => state.all_statuses,
			bookingInstances: state => state.bookings,
			overlappingBookings: 'overlappingBookings'
		} ),
		methods: {
			changePage: function( page ) {

				store.commit( 'setValue', {
					key: 'offset',
					value: this.perPage * ( page - 1 )
				} );

				store.dispatch( 'getItems' );

			},
			showEditDialog: function ( item, index ) {

				this.editDialog = true;

				store.commit( 'setValue', {
					key: 'overlappingBookings',
					value: false
				} );

				this.currentItem = JSON.parse( JSON.stringify( item ) );
				this.currentIndex = index;

				this.currentItem.check_in_date = moment.unix( this.currentItem.check_in_date_timestamp ).utc().format( 'YYYY-MM-DD' );
				this.currentItem.check_out_date = moment.unix( this.currentItem.check_out_date_timestamp ).utc().format( 'YYYY-MM-DD' );

				store.commit( 'setValue', {
					key: 'bookingItem',
					value: this.currentItem
				} );

				this.initDateRangePicker();

			},
			showDetailsDialog: function( item ) {
				this.detailsDialog = true;
				this.currentItem = item;
			},
			showDeleteDialog: function( itemID ) {
				this.deleteItem = itemID;
				this.deleteDialog = true;
			},
			handleEdit: function() {

				let self = this;

				if ( ! self.currentItem ) {
					return;
				}

				store.commit( 'setValue', {
					key: 'overlappingBookings',
					value: false
				} );

				wp.apiFetch( {
					method: 'post',
					path: window.JetABAFConfig.api.update_booking + self.currentItem.booking_id + '/',
					data: { item: self.currentItem }
				} ).then( function( response ) {

					if ( ! response.success ) {
						if ( response.overlapping_bookings ) {
							self.$CXNotice.add( {
								message: response.data,
								type: 'error',
								duration: 7000,
							} );

							store.commit( 'setValue', {
								key: 'overlappingBookings',
								value: response.html
							} );

							self.editDialog = true;

							return;
						} else {
							self.$CXNotice.add( {
								message: response.data,
								type: 'error',
								duration: 7000,
							} );
						}
					} else {
						self.$CXNotice.add( {
							message: 'Done!',
							type: 'success',
							duration: 7000,
						} );

						store.dispatch( 'getItems' );
					}

					self.currentItem = false;
					self.currentIndex = false;

				} ).catch( function( e ) {

					self.$CXNotice.add( {
						message: e.message,
						type: 'error',
						duration: 7000,
					} );

					self.currentItem = false;
					self.currentIndex = false;

				} );

			},
			handleDelete: function() {

				var self = this;

				if ( ! self.deleteItem ) {
					return;
				}

				wp.apiFetch( {
					method: 'delete',
					path: window.JetABAFConfig.api.delete_booking + self.deleteItem + '/',
				} ).then( function( response ) {
					if ( ! response.success ) {
						self.$CXNotice.add( {
							message: response.data,
							type: 'error',
							duration: 7000,
						} );
					}

					for ( var i = 0; i < self.itemsList.length; i++ ) {
						if ( self.itemsList[ i ].booking_id === self.deleteItem ) {
							self.itemsList.splice( i, 1 );
							break;
						}
					}

				} ).catch( function( e ) {
					self.$CXNotice.add( {
						message: e.message,
						type: 'error',
						duration: 7000,
					} );
				} );
			},
			getBookingLabel: function( id ) {

				if ( ! id ) {
					return '--';
				}

				return this.bookingInstances[ id ] || id;

			},
			getOrderLink: function( orderID ) {
				return window.JetABAFConfig.edit_link.replace( /\%id\%/, orderID );
			},
			isFinished: function( status ) {
				return ( 0 <= window.JetABAFConfig.statuses.finished.indexOf( status ) );
			},
			isInProgress: function( status ) {
				return ( 0 <= window.JetABAFConfig.statuses.in_progress.indexOf( status ) );
			},
			isInvalid: function( status ) {
				return ( 0 <= window.JetABAFConfig.statuses.invalid.indexOf( status ) );
			}
		},
	} );

	Vue.component( 'jet-abaf-add-new-booking', {
		template: '#jet-abaf-add-new-booking',
		mixins: [ fieldsManager ],
		data: function () {
			return {
				addDialog: false,
				newItem: {
					status: '',
					apartment_id: '',
					check_in_date: '',
					check_out_date: '',
				},
				datePickerFormat: 'dd-MM-yyyy',
				dateMomentFormat: 'DD-MM-YYYY',
			}
		},
		computed: Vuex.mapState( {
			statuses: state => state.all_statuses,
			bookingInstances: state => state.bookings,
			overlappingBookings: 'overlappingBookings',
			fields: function ( state ) {
				return [ ...state.columns, ...state.additional_columns ];
			}
		} ),
		methods: {
			showAddDialog: function() {
				this.addDialog = true;

				store.commit( 'setValue', {
					key: 'overlappingBookings',
					value: false
				} );

				store.commit( 'setValue', {
					key: 'isDisabled',
					value: true
				} );

				store.commit( 'setValue', {
					key: 'bookingItem',
					value: this.newItem
				} );
			},

			checkRequiredFields: function() {
				let requiredFields = [ 'status', 'apartment_id', 'check_in_date', 'check_out_date' ],
					emptyFields = [];

				for ( let field of requiredFields ){
					if ( ! this.newItem[ field ].length ) {
						emptyFields.push( field );
					}
				}

				if( ! emptyFields[0] ){
					return true;
				}

				emptyFields = emptyFields.join( ', ' ).toLowerCase();

				eventHub.$CXNotice.add( {
					message: sprintf( __( 'Empty fields: %s.', 'jet-booking' ), emptyFields ),
					type: 'error',
					duration: 7000,
				} );

				return false;
			},

			handleAdd: function() {

				let self = this;

				if( ! self.checkRequiredFields() ) {
					this.addDialog = true;

					return;
				}

				store.commit( 'setValue', {
					key: 'overlappingBookings',
					value: false
				} );

				wp.apiFetch( {
					method: 'post',
					path: window.JetABAFConfig.api.add_booking,
					data: { item: self.newItem }
				} ).then( function( response ) {

					if ( ! response.success ) {
						if ( response.overlapping_bookings ) {
							eventHub.$CXNotice.add( {
								message: response.data,
								type: 'error',
								duration: 7000,
							} );

							store.commit( 'setValue', {
								key: 'overlappingBookings',
								value: response.html
							} );

							self.addDialog = true;

							return;
						} else {
							eventHub.$CXNotice.add( {
								message: response.data,
								type: 'error',
								duration: 7000,
							} );
						}
					} else {
						eventHub.$CXNotice.add( {
							message: 'Done!',
							type: 'success',
							duration: 7000,
						} );
					}

					store.dispatch( 'getItems' );

					self.newItem = {
						status: '',
						apartment_id: '',
						check_in_date: '',
						check_out_date: '',
					};

				} ).catch( function( e ) {
					eventHub.$CXNotice.add( {
						message: e.message,
						type: 'error',
						duration: 7000,
					} );
				} );

			}
		}
	} );

	new Vue( {
		el: '#jet-abaf-bookings-page',
		template: '#jet-abaf-bookings',
		store,
		computed: Vuex.mapState( {
			isSet: state => state.setup.is_set,
			isLoading: 'isLoading',
		} ),
		created: function () {
			store.dispatch('getItems');
		},
	} );

} )();
