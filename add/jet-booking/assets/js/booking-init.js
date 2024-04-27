(function () {

	window.jetBookingState = {
		isActive: false,
		bookingCalendars: [],
		bookingInputs: [],
		filters: ( function() {
			return {
				add: function( name, callback ) {
					window.JetPlugins.hooks.addFilter( name.replace( /[\/]/g, '.' ), 'jetBooking', callback );
					console.warn( '`window.jetBookingState.filters.add(' + name + ')` is deprecated since 2.6.3 Use `window.JetPlugins.hooks.addFilter(' + name.replace( /[\/]/g, '.' ) + ')` instead.' );
				}
			};
		})()
	};

	const {
		per_nights: perNights,
		css_url: cssUrl,
		post_id: postID,
		one_day_bookings: oneDayBookings,
		bace_price: bacePrice,
		seasonal_price: seasonalPrice,
		labels: labels,
		custom_labels: customLabels,
		weekly_bookings: weeklyBookings,
		week_offset: weekOffset,
		start_day_offset: startDayOffset,
		min_days: minDays,
		max_days: maxDays,
		ajax_url: ajaxURL
	} = window.JetABAFData;

	const editorJetABAFInput = {
		start_of_week: 'monday',
		field_format: 'YYYY-MM-DD',
	}

	const {
		start_of_week: startOfWeek,
		field_format: fieldFormat,
	} = window.JetABAFInput || editorJetABAFInput;

	let {
			booked_dates: excludedDates,
			booked_next: excludedNext,
			disabled_days: disabledDays,
			checkout_only: checkoutOnly,
		} = window.JetABAFData,
		separator = ' - ',
		namespace = 'JetFormBuilderMain',
		initialized = {
			JetEngine: false,
			JetFormBuilderMain: false
		},
		head = document.getElementsByTagName( 'head' )[0],
		link = document.createElement( 'link' );

	link.rel   = 'stylesheet';
	link.type  = 'text/css';
	link.href  = cssUrl;
	link.media = 'all';

	head.appendChild( link );

	let setDynamicPrice = function( field = false ) {
			jQuery( 'span[data-price-change="1"][data-post="' + postID + '"]' ).each( function() {
				let $this = jQuery( this ),
					period,
					price = bacePrice.price;

				if( $this.data('price-change') === 0 && field ){
					return;
				}

				if( ! field[0] ){
					period = {
						start: new Date().valueOf() / 1000,
						end: new Date().valueOf() / 1000,
					}
				} else {
					period = stringToTimestamp( field[0].value, separator, field.data('format') );
				}

				let periodRange = createRange( period.start, period.end ),
					curentSeason = {
						price: false,
						price_rates: [],
						weekend_price: [],
					},
					priceList = [],
					priceRates,
					ratePriceList,
					weekendPriceList,
					priceType = $this.data( 'show-price' );

				if ( JSON.stringify( seasonalPrice ) !== JSON.stringify( {} ) ) {
					for ( let day of periodRange ) {
							for( let key in seasonalPrice ) {
								let start = parseInt( seasonalPrice[ key ].start ),
									end   = parseInt( seasonalPrice[ key ].end );

								if( day >= start && day <= end ){
									curentSeason = seasonalPrice[ key ];
								}
							}

					}
				}

				priceRates = bacePrice.price_rates.concat( curentSeason.price_rates );
				ratePriceList = priceRates.map( function( el ) {
					return Number( el.value );
				});
				weekendPriceList = bacePrice.weekend_price.concat( curentSeason.weekend_price ).filter( function( el ) {
					return typeof el === 'number' ;
				});

				if( curentSeason.price ){
					priceList.push( Number( curentSeason.price ) )
				}

				priceList.push(
					Number( bacePrice.price ),
					...ratePriceList,
					...weekendPriceList,
				);

				switch ( priceType ){
					case 'min':
						price = Math.min( ...priceList );
					break;

					case 'max':
						price = Math.max( ...priceList );
					break;

					case 'range':
						price = `${ Math.min( ...priceList ) } - ${ Math.max( ...priceList ) }`
					break;

					default:
						price = curentSeason.price || bacePrice.price;
					break;
				}

				if ( priceRates.length ) {
					for ( let i = 0; i < priceRates.length; i++ ) {
						if ( periodRange.length >= parseInt( priceRates[ i ].duration, 10 ) ) {
							price = parseInt( priceRates[ i ].value, 10 )
						}
					}
				}

				if ( $this.data( 'currency' ) ) {

					let currencyPosition = $this.data( 'currency-position' );

					if ( 'before' === currencyPosition ) {
						price = $this.data( 'currency' ) + '' + price;
					} else {
						price = price + '' + $this.data( 'currency' );
					}

				}

				$this.text( price )

			} );
		},
		setAvailableUnitsCount = function( field ) {
			jQuery( 'span[data-units-count][data-post="' + postID + '"]' ).each( function() {

				let $this = jQuery( this ),
					period;

				if( ! field[0] ){
					period = {
						start: new Date().valueOf() / 1000,
						end: new Date().valueOf() / 1000,
					}
				} else {
					period = stringToTimestamp( field[0].value, separator, field.data('format') );
				}

				jQuery.ajax( {
					url: ajaxURL,
					type: 'POST',
					dataType: 'json',
					data: {
						action: 'jet_booking_check_available_units_count',
						booking: {
							apartment_id: $this.data( 'post' ),
							check_in_date: period.start,
							check_out_date: period.end
						}
					},
				} ).done( function( response ) {
					$this.text( response.data.count );
				} ).fail( function( jqXHR, textStatus, errorThrown ) {
					alert( errorThrown );
				} );

			} );
		},
		validateDay = function( t ) {

			let formatted = moment( t ).format( 'YYYY-MM-DD' ),
				valid = true,
				_class = '',
				_tooltip = '';

			if ( disabledDays.length && 0 <= disabledDays.indexOf( t.getDay() ) ) {
				valid = false;
			}

			if ( excludedDates.length && 0 <= excludedDates.indexOf( formatted ) ) {
				valid = false;
				_class = 'booked';
				_tooltip = labels.booked;

				// Mark first day of booked period as checkout only
				if ( checkoutOnly ) {
					let next = moment( t ).add( 1, 'd' ).format( 'YYYY-MM-DD' );
					let prev = moment( t ).subtract( 1, 'd' ).format( 'YYYY-MM-DD' );

					if ( 0 <= excludedNext.indexOf( next ) || ( 0 <= excludedDates.indexOf( next ) && -1 === excludedDates.indexOf( prev ) ) ) {
						if ( window.jetBookingState.isActive ) {
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
			if ( checkoutOnly && window.jetBookingState.isActive && 0 <= excludedNext.indexOf( formatted ) ) {
				valid = false;
				_class = 'booked';
				_tooltip = labels.booked;
			}

			return window.JetPlugins.hooks.applyFilters( 'jet-booking.date-range-picker.date-show-params', [ valid, _class, _tooltip ], t );

		},
		calculatedFieldValue = function( value, $field ) {
			if ( 'checkin-checkout' === $field.data( 'field' ) ) {
				return culcBookedDates( value, $field.data( 'format' ) );
			} else {
				return value;
			}
		},
		parseBookingMacros = function( formula, $scope ){
			if ( -1 !== formula.search( new RegExp( 'ADVANCED_PRICE' ) ) ) {
				let regexp = /%ADVANCED_PRICE::([a-zA-Z0-9-_]+)%/g,
					dateField;

				formula = formula.replace( regexp, function ( match1, match2 ) {
					dateField = $scope.closest( 'form' ).find( '[name="' + match2 + '"], [name="' + match2 + '[]"]' );

					return getApartmentPrice( dateField );
				} );
			}

			return formula;
		},
		getApartmentPrice = function( field ){

			let period = stringToTimestamp( field[0].value, separator, field.data('format') );

			if( ! period ){
				return 0;
			}

			let periodRange = createRange( period.start, period.end ),
				daysCount   = ( window.JetEngineForms || window.JetFormBuilder ).getFieldValue( field ),
				price = 0;

			for ( let day of periodRange ) {
				price += getOneDayPrice( day, daysCount );
			}

			return window.JetPlugins.hooks.applyFilters( 'jet-booking.apartment-price', price, field );

		},
		getOneDayPrice = function( day, daysCount ) {

			let pricing = bacePrice;

			if ( JSON.stringify( seasonalPrice ) !== JSON.stringify( {} ) ) {
				for( let key in seasonalPrice ) {
					let start = parseInt( seasonalPrice[ key ].start ),
						end   = parseInt( seasonalPrice[ key ].end );

					if( day >= start && day <= end ){
						pricing = seasonalPrice[ key ];
					}
				}
			}

			let weekDay = moment.unix( day ).utc().day(),
				weekendPrice = pricing.weekend_price[ weekDay ],
				price = weekendPrice ? weekendPrice : pricing.price;

			if ( pricing.price_rates[0] ) {
				for ( let rate of pricing.price_rates ) {
					if ( daysCount >= Number( rate.duration ) ) {
						price = rate.value;
					}
				}
			}

			return Number( price );

		},
		createRange = function ( start, end, step = 86400 ) {
			let range   = [ start ],
				newItem = start;

			end = ! perNights ? end : end - step ;

			while ( newItem < end ) {
				range.push( newItem += step );
			}

			return range;
		},
		stringToTimestamp = function ( string, separator, format = "YYYY-MM-DD" ) {

			if( ! string ){
				return false;
			}

			let output    = {},
				startDate = ! oneDayBookings ? string.slice( 0, string.indexOf( separator ) ) : string,
				endDate   = ! oneDayBookings ? string.slice( string.indexOf( separator ) + separator.length, string.length ) : string;

			format = `${format} hh:mm:ss Z`;

			output.start =  moment( `${startDate} 00:00:00 +0000`, format ).unix();
			output.end = moment( `${endDate} 00:00:00 +0000`, format ).unix();

			return output;
		},
		culcBookedDates = function ( value, dateFormat = "YYYY-MM-DD" ) {
			if ( oneDayBookings ) {
				return 1;
			}

			if ( 1 < value.length ) {
				value = value.split( ' - ' );

				if( ! value[0] ){
					return 0;
				}

				if ( fieldFormat ) {
					dateFormat = fieldFormat;
				}

				let startDate = moment( value[0], dateFormat ),
					endDate   = moment( value[1], dateFormat );

				value = endDate.diff( startDate, 'days' );
				value = Number( value );

				if ( ! perNights ) {
					value++;
				}
			}

			return value;
		},
		setDateRangePickerConfig = function () {

			let config = {
				separator: separator,
				startOfWeek: startOfWeek,
				startDate: startDayOffset ? moment().add( Number( startDayOffset ), 'd' ) : new Date(),
				minDays: minDays ? Number( minDays ) : perNights ? 1 : 0,
				maxDays: maxDays ? Number( maxDays ) : 0,
				selectForward: true,
				beforeShowDay: validateDay,
				excludedDates: excludedDates,
				perNights: perNights
			};

			if ( customLabels ) {
				jQuery.dateRangePickerLanguages['custom'] = labels;
				config.language = 'custom';
			}

			if ( weeklyBookings ) {
				config.batchMode     = 'week';
				config.showShortcuts = false;

				if ( weekOffset ) {
					config.weekOffset = Number( weekOffset );
				}
			} else if ( oneDayBookings ) {
				config.singleDate = true;
			}

			return config;

		},
		syncValuesWithCalendarWidget = function ( s1, s2 ) {

			const $bookingCalendar = jQuery( '.jet-booking-calendar__input' );

			if ( $bookingCalendar.length || $bookingCalendar[0] ) {
				s1 = moment( s1, fieldFormat ).format( 'YYYY-MM-DD' );
				s2 = moment( s2, fieldFormat ).format( 'YYYY-MM-DD' );

				if ( oneDayBookings ) {
					$bookingCalendar.data( 'dateRangePicker' ).setStart( s1 );
				} else {
					$bookingCalendar.data( 'dateRangePicker' ).setDateRange( s1, s2 );
				}
			}

		},
		getDateRangeString = function ( value ) {
			if ( value ) {
				value = value.split( separator );

				if ( 0 === value.length ) {
					return '';
				}

				if ( 1 === value.length ) {
					return value[0];
				}

				let startDate = moment.utc( value[0], fieldFormat ).local().format( fieldFormat ),
					endDate   = moment.utc( value[1], fieldFormat ).local().format( fieldFormat );

				return startDate + separator + endDate;
			} else {
				return '';
			}
		},
		resetInitializedNamespace = function () {
			initialized[ namespace ] = false;
		}
		initializeCheckInOut = function ( event, $scope ) {

			if ( ! $scope ) {
				alert( 'Please update JetEngine to version 2.4.0 or higher' );
			}

			namespace = event.data.namespace;

			if ( initialized[ namespace ] || ! jQuery( '.field-type-check_in_out, .field-type-check-in-out', $scope )[0] ) {
				return;
			}

			const fieldType = jQuery( '.jet-abaf-separate-fields', $scope )[0] ? 'separate' : 'single' ;

			let config = {
				...setDateRangePickerConfig(),
				format: jQuery( '.jet-abaf-separate-fields', $scope )[ 0 ] ? 'separate' : 'single',
				autoClose: true
			};

			if ( fieldFormat ) {
				config.format = fieldFormat;
			}

			config = window.JetPlugins.hooks.applyFilters( 'jet-booking.input.config', config );

			if ( 'single' === fieldType ) {
				let $checkInOut = jQuery( '#jet_abaf_field', $scope );

				config.container = '.jet-abaf-field';

				config.getValue = function () {
					return getDateRangeString( $checkInOut.val() )
				};

				config.setValue = function( s, s1, s2 ) {

					$checkInOut.val( s ).trigger( 'change.' + namespace );

					syncValuesWithCalendarWidget( s1, s2 )
					setDynamicPrice( jQuery( 'input[data-field="checkin-checkout"]', $scope ) );
					setAvailableUnitsCount( jQuery( 'input[data-field="checkin-checkout"]', $scope ) );

				};
			} else {
				let $checkIn = jQuery( '#jet_abaf_field_1', $scope ),
					$checkOut = jQuery( '#jet_abaf_field_2', $scope ),
					$result = jQuery( '#jet_abaf_field_range', $scope );

				config.container = '.jet-abaf-separate-fields';

				config.getValue = function () {
					return getDateRangeString( $result.val() )
				};

				config.setValue = function( s, s1, s2 ) {

					if ( s === s1 ) {
						s2 = s1;
					}

					$checkIn.val( s1 );
					$checkOut.val( s2 );
					$result.val( s ).trigger( 'change.' + namespace );

					syncValuesWithCalendarWidget( s1, s2 )
					setDynamicPrice( jQuery( config.container + ' input[data-field="checkin-checkout"]', $scope ) );
					setAvailableUnitsCount( jQuery( config.container + ' input[data-field="checkin-checkout"]', $scope ) );

				};
			}

			let $field = jQuery( config.container, $scope );

			window.jetBookingState.bookingCalendars.push( $field );

			$field.dateRangePicker( config ).bind( 'datepicker-first-date-selected', () => {
				window.jetBookingState.isActive = true;
			}).bind( 'datepicker-change', () => {
				window.jetBookingState.isActive = false;
			});

			if ( ! initialized[ namespace ] ) {
				if( namespace === 'JetEngine' ){
					JetEngine.filters.addFilter( 'forms/calculated-field-value', calculatedFieldValue );
					JetEngine.filters.addFilter( 'forms/calculated-formula-before-value', parseBookingMacros );
				}else{
					JetFormBuilderMain.filters.addFilter( 'forms/calculated-field-value', calculatedFieldValue );
					JetFormBuilderMain.filters.addFilter( 'forms/calculated-formula-before-value', parseBookingMacros );
				}
			}

			initialized[ namespace ] = true;

			$document.trigger( 'jet-booking/init-field', [ $field ] );

		};

	const $document = jQuery( document );

	$document
		.on( 'jet-engine/booking-form/init', { namespace: 'JetEngine' }, initializeCheckInOut )
		.on( 'jet-form-builder/init', { namespace: 'JetFormBuilderMain' }, initializeCheckInOut )
		.on( 'elementor/popup/hide', resetInitializedNamespace )
		.trigger( 'jet-booking/init' );

	setDynamicPrice();

	jQuery( window ).on( 'elementor/frontend/init', function() {

		window.elementorFrontend.hooks.addAction( 'frontend/element_ready/jet-booking-calendar.default', function( $scope ) {

			let $container = $scope.find( '.jet-booking-calendar__container' ),
				scrollToForm = $container.data( 'scroll-to-form' ),
				config = {
					...setDateRangePickerConfig(),
					inline: true,
					container: '#' + $container.attr( 'id' ),
					alwaysOpen: true,
					showTopbar: false
				};

			config = window.JetPlugins.hooks.applyFilters( 'jet-booking.calendar.config', config );

			config.setValue = function( s, s1, s2 ) {

				if ( ! s )  {
					return;
				}

				let $formField = jQuery( '.field-type-check_in_out, .field-type-check-in-out' ),
					$result,
					format;

				if ( s === s1 ) {
					s2 = s1;
				}

				if ( $formField.find( '.jet-abaf-separate-fields' ).length ) {
					$result = $formField.find( '#jet_abaf_field_range' );
					format = $result.data( 'format' );

					let $field_1 = $formField.find( '#jet_abaf_field_1' ),
						$field_2 = $formField.find( '#jet_abaf_field_2' );

					$field_1.val( format ? moment( s1 ).format( format ) : s1 );
					$field_2.val( format ? moment( s2 ).format( format ) : s2 );
				} else if ( $formField.find( '.jet-abaf-field' ).length ) {
					$result = $formField.find( '#jet_abaf_field' );
					format = $result.data( 'format' );
				}

				if ( format ) {
					s1 = moment( s1 ).format( format );
					s2 = moment( s2 ).format( format );
					s  = oneDayBookings ? moment( s ).format( format ) : s1 + config.separator + s2;
				}

				if ( $result.hasClass( 'jet-form__field' ) ) {
					$result.val( s ).trigger( 'change.JetEngine' );
				} else {
					$result.val( s ).trigger( 'change.JetFormBuilderMain' );
				}

				if ( scrollToForm ) {
					jQuery( 'html, body' ).animate({
						scrollTop: $formField.closest( 'form' ).offset().top
					}, 500 );
				}

				setDynamicPrice( jQuery( 'input[data-field="checkin-checkout"]', $result ) );
				setAvailableUnitsCount( jQuery( 'input[data-field="checkin-checkout"]', $result ) );

			};

			let $el = $scope.find( '.jet-booking-calendar__input' );
			
			window.jetBookingState.bookingCalendars.push( $el );

			$el.dateRangePicker( config ).bind( 'datepicker-first-date-selected', () => {
				window.jetBookingState.isActive = true;
			}).bind( 'datepicker-change', () => {
				window.jetBookingState.isActive = false;
			});

			$document.trigger( 'jet-booking/init-calendar', [ $el ] );

		} );
	} );

}() );
