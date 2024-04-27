import {
	jsonToObj,
	objToJson,
	borderStrToObj,
	objToBorderStr,
	boxShadowStrToObj,
	objToBoxShadowStr,
	toBoolean,
	boolToVerbose
} from 'includes/utility';

import { pluginIcon } from 'includes/icons';

import BoxShadowControl from "includes/controls/box-shadow-control";
import BackgroundControl from "includes/controls/background-control";
import ColorPickerControl from "includes/controls/color-picker-control";

const { __ } = wp.i18n;

const { merge } = window.lodash;

const { registerPlugin } = wp.plugins;

const {
	PluginSidebar,
	PluginSidebarMoreMenuItem
} = wp.editPost;

const { Fragment, useState } = wp.element;

const { useEntityProp } = wp.coreData;

const {
	useSelect,
	useDispatch
} = wp.data;

const {
	MediaUpload,
} = wp.blockEditor;

const { addFilter } = wp.hooks;

const {
	PanelBody,
	BaseControl,
	Icon,
	Dashicon,
	TextControl,
	RangeControl,
	ToggleControl,
	ColorPicker,
	ColorIndicator,
	BoxControl,
	DateTimePicker,
	SelectControl,
	Button,
	RadioControl,
	__experimentalInputControl,
	__experimentalUnitControl,
	__experimentalBorderControl,
	__experimentalToggleGroupControl,
	__experimentalToggleGroupControlOption,
	__experimentalToggleGroupControlOptionIcon,
} = wp.components;

let {
	InputControl,
	UnitControl,
	BorderControl,
	ToggleGroupControl,
	ToggleGroupControlOption,
	ToggleGroupControlOptionIcon
} = wp.components;

InputControl = InputControl || __experimentalInputControl;
UnitControl = UnitControl || __experimentalUnitControl;
BorderControl = BorderControl || __experimentalBorderControl;
ToggleGroupControl = ToggleGroupControl || __experimentalToggleGroupControl;
ToggleGroupControlOption = ToggleGroupControlOption || __experimentalToggleGroupControlOption;
ToggleGroupControlOptionIcon = ToggleGroupControlOptionIcon || __experimentalToggleGroupControlOptionIcon;

registerPlugin( 'jet-popup-sidebar', { render: () => {
	const _metaStyles = useSelect( function ( select ) {
		return select( 'core/editor' ).getEditedPostAttribute(
			'meta'
		)[ '_styles' ];
	}, [] );

	const metaStyles = merge( {}, window.JetPopupBlockEditorPluginConfig.defaultStyleSettings || {}, _metaStyles );

	const _metaSettings = useSelect( function ( select ) {
		return select( 'core/editor' ).getEditedPostAttribute(
			'meta'
		)[ '_settings' ];
	}, [] );

	const metaSettings = Object.assign( {}, window.JetPopupBlockEditorPluginConfig.defaultSettings || {}, _metaSettings );

	const postId = useSelect( function ( select ) {
		return select( 'core/editor' ).getCurrentPostId();
	}, [] );

	const editPost = useDispatch( 'core/editor' ).editPost;

	const updateMetaValue = ( id, value ) => {

		if ( 'undefined' ===  typeof value ) {
			return false;
		}

		let newMetaObj = {};

		newMetaObj[ id ] = value;

		editPost( {
			meta: { _styles: Object.assign( {}, metaStyles, newMetaObj ) },
		} );
	};

	const updateMetaValues = ( newMetaObj = {} ) => {

		editPost( {
			meta: { _styles: Object.assign( {}, metaStyles, newMetaObj ) },
		} );
	};

	const updateSettingValue = ( id, value ) => {

		if ( 'undefined' ===  typeof value ) {
			return false;
		}

		let newMetaObj = {};

		newMetaObj[ id ] = value;

		editPost( {
			meta: { _settings: Object.assign( {}, metaSettings, newMetaObj ) },
		} );
	};

	const [ closeButtonIconUrl, setCloseButtonIconUrl ] = useState();

	if ( metaSettings.close_button_icon ) {
		wp.media.attachment( metaSettings.close_button_icon ).fetch().then( ( data ) => {
			setCloseButtonIconUrl( data.url );
		} )
	}

	return (
		<Fragment>
			<PluginSidebarMoreMenuItem target={ 'jet-popup-sidebar' } key={ 'jet-popup-sidebar-link' } icon={ pluginIcon }>
				{ __( 'Jet Popup', 'jet-popup' ) }
			</PluginSidebarMoreMenuItem>
			<PluginSidebar name="jet-popup-sidebar" title={ __( 'Jet Popup', 'jet-popup' ) } icon={ pluginIcon }>
				<PanelBody title={__( 'Settings' )}>

					<BaseControl label={ __( 'Animation', 'jet-popup' ) } help={ __( 'Choose animation effect for popup.', 'jet-popup' ) }>
						<SelectControl
							value={ metaSettings.jet_popup_animation }
							options={ window.JetPopupBlockEditorPluginConfig.popupAnimationTypeOptions || [] }
							onChange={ ( value ) => {
								updateSettingValue( 'jet_popup_animation', value );
							} }
						/>
					</BaseControl>

					<BaseControl label={ __( 'Open Event', 'jet-popup' ) } help={ __( 'Choose popup open event.', 'jet-popup' ) }>
						<SelectControl
							value={ metaSettings.jet_popup_open_trigger }
							options={ window.JetPopupBlockEditorPluginConfig.popupOpenTriggerOptions || [] }
							onChange={ ( value ) => {
								updateSettingValue( 'jet_popup_open_trigger', value );
							} }
						/>
					</BaseControl>

					{ 'page-load' === metaSettings.jet_popup_open_trigger &&
						<BaseControl label={ __( 'Open Delay(s)', 'jet-popup' ) } help={ __( 'Enter a delay after which the popup will appear after the page is loaded.', 'jet-popup' ) }>
							<InputControl
								type="number"
								value={ metaSettings.jet_popup_page_load_delay }
								onChange={ (value) => {
									updateSettingValue( 'jet_popup_page_load_delay', value );
								} }
							/>
						</BaseControl>
					}

					{ 'user-inactive' === metaSettings.jet_popup_open_trigger &&
						<BaseControl label={ __( 'User Inactivity Time(s)', 'jet-popup' ) } help={ __( 'Enter the time of user inactivity after which the popup will appear.', 'jet-popup' ) }>
							<InputControl
								type="number"
								value={ metaSettings.jet_popup_user_inactivity_time }
								onChange={ (value) => {
									updateSettingValue( 'jet_popup_user_inactivity_time', value );
								} }
							/>
						</BaseControl>
					}

					{ 'scroll-trigger' === metaSettings.jet_popup_open_trigger &&
						<BaseControl label={ __( 'Page Scroll Progress(%)', 'jet-popup' ) } help={ __( 'Enter the scrolling percentage of the page on which the popup will appear.', 'jet-popup' ) }>
							<InputControl
								type="number"
								value={ metaSettings.jet_popup_scrolled_to_value }
								onChange={ (value) => {
									updateSettingValue( 'jet_popup_scrolled_to_value', value );
								} }
							/>
						</BaseControl>
					}

					{ 'on-date' === metaSettings.jet_popup_open_trigger &&
						<BaseControl label={ __( 'Open Date', 'jet-popup' ) } help={ __( 'Enter the date when the popup will appear.', 'jet-popup' ) }>
							<DateTimePicker
								currentDate={ metaSettings.jet_popup_on_date_value }
								onChange={ ( value ) => {
									updateSettingValue( 'jet_popup_on_date_value', value.replace( 'T', ' ' ) );
								} }
								__nextRemoveHelpButton
								__nextRemoveResetButton
							/>
						</BaseControl>
					}

					{ 'on-time' === metaSettings.jet_popup_open_trigger &&
						<BaseControl label={ __( 'Start Time', 'jet-popup' ) } help={ __( 'Enter the time when the popup will appear.', 'jet-popup' ) }>
							<InputControl
								type="time"
								value={ metaSettings.jet_popup_on_time_start_value }
								onChange={ ( value ) => {
									updateSettingValue( 'jet_popup_on_time_start_value', value );
								} }
							/>
						</BaseControl>
					}

					{ 'on-time' === metaSettings.jet_popup_open_trigger &&
						<BaseControl label={__( 'End Time', 'jet-popup' )} help={__( 'Enter the time when the popup will will disappear.', 'jet-popup' )}>
							<InputControl
								type="time"
								value={ metaSettings.jet_popup_on_time_end_value }
								onChange={ ( value ) => {
									updateSettingValue( 'jet_popup_on_time_end_value', value );
								}}
							/>
						</BaseControl>
					}

					{ 'custom-selector' === metaSettings.jet_popup_open_trigger &&
						<BaseControl label={__( 'Custom Selector', 'jet-popup' )} help={__( 'Set a custom selector on which a popup will appear when clicked.', 'jet-popup' )}>
							<InputControl
								type="text"
								value={ metaSettings.jet_popup_custom_selector }
								onChange={ ( value ) => {
									updateSettingValue( 'jet_popup_custom_selector', value );
								}}
							/>
						</BaseControl>
					}

					<BaseControl label={ __( 'Prevent Page Scrolling', 'jet-popup' ) } help={ __( 'Enable to block page scrolling. Close popup to continue page scrolling.', 'jet-popup' ) }>
						<ToggleControl
							checked={ toBoolean( metaSettings.jet_popup_prevent_scrolling ) }
							onChange={ ( value ) => {
								updateSettingValue( 'jet_popup_prevent_scrolling', boolToVerbose( value ) );
							} }
						/>
					</BaseControl>

					<BaseControl label={ __( 'Show Once', 'jet-popup' ) } help={ __( 'When closing the popup, when retriggered, it will not appear again.', 'jet-popup' ) }>
						<ToggleControl
							checked={ toBoolean( metaSettings.jet_popup_show_once ) }
							onChange={ ( value ) => {
								updateSettingValue( 'jet_popup_show_once', boolToVerbose( value ) );
							} }
						/>
					</BaseControl>

					{ toBoolean( metaSettings.jet_popup_show_once ) &&
						<BaseControl label={ __( 'Repeat Showing Popup In', 'jet-popup' ) } help={ __( 'Set the timeout caching and a popup will be displayed again.', 'jet-popup' ) }>
							<SelectControl
								value={ metaSettings.jet_popup_show_again_delay }
								options={ window.JetPopupBlockEditorPluginConfig.popupTimeDelayOptions || [] }
								onChange={ ( value ) => {
									updateSettingValue( 'jet_popup_show_again_delay', value );
								} }
							/>
						</BaseControl>
					}

					<BaseControl label={ __( 'Loading content with Ajax', 'jet-popup' ) } help={ __( 'When using ajax, the content of the popup will be loaded after the popup appears. This allows you to increase the loading speed of the site.', 'jet-popup' ) }>
						<ToggleControl
							checked={ toBoolean( metaSettings.jet_popup_use_ajax ) }
							onChange={ ( value ) => {
								updateSettingValue( 'jet_popup_use_ajax', boolToVerbose( value ) );
							} }
						/>
					</BaseControl>

					{ toBoolean( metaSettings.jet_popup_use_ajax ) &&
						<BaseControl label={ __( 'Force Loading', 'jet-popup' ) } help={ __( 'Force Loading every time you open the popup.', 'jet-popup' ) }>
							<ToggleControl
								checked={ toBoolean( metaSettings.jet_popup_force_ajax ) }
								onChange={ ( value ) => {
									updateSettingValue( 'jet_popup_force_ajax', boolToVerbose( value ) );
								} }
							/>
						</BaseControl>
					}

					<BaseControl label={ __( 'Use Close Button', 'jet-popup' ) }>
						<ToggleControl
							checked={ toBoolean( metaSettings.use_close_button ) }
							onChange={ ( value ) => {
								updateSettingValue( 'use_close_button', boolToVerbose( value ) );
							} }
						/>
					</BaseControl>

					{ toBoolean( metaSettings.use_close_button ) &&
						<BaseControl label={ __( 'SVG Icon', 'jet-popup' ) }>
							<div className="components-base-control jet-media-control">
								<div className="jet-media-control__container">
									{ closeButtonIconUrl &&
										<img className="jet-media-control__preview"
											 src={ closeButtonIconUrl }
											 alt=""/>
									}
									<MediaUpload
										onSelect={ media => {
											setCloseButtonIconUrl( media.url );
											updateSettingValue( 'close_button_icon', media.id.toString() );
										} }
										allowedTypes={ [ 'image/svg+xml' ] }
										value={ metaSettings.close_button_icon }
										render={ ( { open } ) => (
											<Button
												isSecondary
												icon="edit"
												onClick={open}
											>{ __( 'Select Icon' ) }</Button>
										)}
									/>
									{ closeButtonIconUrl &&
										<Button
											onClick={ () => {
												setCloseButtonIconUrl( '' );
												updateSettingValue( 'close_button_icon', '' );
											} }
											isLink
											isDestructive
										>
											{ __( 'Remove Icon' ) }
										</Button>
									}
								</div>
							</div>
						</BaseControl>
					}

					<BaseControl label={ __( 'Use Overlay', 'jet-popup' ) }>
						<ToggleControl
							checked={ toBoolean( metaSettings.use_overlay ) }
							onChange={ ( value ) => {
								updateSettingValue( 'use_overlay', boolToVerbose( value ) );
							} }
						/>
					</BaseControl>

					{ toBoolean( metaSettings.use_overlay ) &&
						<BaseControl label={ __( 'Close On Overlay Click', 'jet-popup' ) } help={ __( 'Сlose the popup when clicking on the overlay.', 'jet-popup' ) }>
							<ToggleControl
								checked={ toBoolean( metaSettings.close_on_overlay_click ) }
								onChange={ ( value ) => {
									updateSettingValue( 'close_on_overlay_click', boolToVerbose( value ) );
								} }
							/>
						</BaseControl>
					}

					<BaseControl className="jet-base-control-inline" label={ __( 'Display Conditions', 'jet-popup' ) } help={ __( 'Set the conditions that determine where your Popup is used throughout your site.', 'jet-popup' ) }>
						<Button
							variant="secondary"
							href={ window.JetPopupBlockEditorPluginConfig.conditionManagerUrl + '&popup_id=' + postId }
							target='_blank'
						>
							{
								__( 'Edit Conditions', 'jet-popup' )
							}
						</Button>
					</BaseControl>
				</PanelBody>
				<PanelBody title={__( 'Container Styles' )}>
					<BaseControl label={ __( 'Container width', 'jet-popup' ) }>
						<UnitControl
							onChange={ (value) => {
								updateMetaValue( 'container_width', value );
							} }
							isUnitSelectTabbable
							value={ metaStyles.container_width }
						/>
					</BaseControl>

					<BaseControl label={ __( 'Custom Height', 'jet-popup' ) }>
						<ToggleControl
							checked={ metaStyles.container_custom_height }
							onChange={ ( status ) => {
								updateMetaValues( {
									container_custom_height: !metaStyles.container_custom_height,
									container_height: status ? metaStyles.container_height : '',
								} );
							} }
						/>
					</BaseControl>

					{ metaStyles.container_custom_height &&
						<BaseControl label={ __( 'Container Height', 'jet-popup' ) }>
							<UnitControl
								onChange={ (value) => {
									updateMetaValue( 'container_height', value );
								} }
								isUnitSelectTabbable
								value={ metaStyles.container_height }
							/>
						</BaseControl>
					}

					<ToggleGroupControl
						label={ __( 'Horizontal Position', 'jet-popup' ) }
						value={ metaStyles.container_hor_position }
						onChange={ ( value ) => updateMetaValue( 'container_hor_position', value ) }
					>
						<ToggleGroupControlOptionIcon value="flex-start" label="Left" icon="arrow-left-alt"  />
						<ToggleGroupControlOptionIcon value="center" label="Center" icon="align-center"/>
						<ToggleGroupControlOptionIcon value="flex-end" label="Right" icon="arrow-right-alt"/>
					</ToggleGroupControl>

					<ToggleGroupControl
						label={ __( 'Vertical Position', 'jet-popup' ) }
						value={ metaStyles.container_ver_position }
						onChange={ ( value ) => updateMetaValue( 'container_ver_position', value ) }
					>
						<ToggleGroupControlOptionIcon value="flex-start" label="Top" icon="arrow-up-alt"  />
						<ToggleGroupControlOptionIcon value="center" label="Center" icon="align-center"/>
						<ToggleGroupControlOptionIcon value="flex-end" label="Bottom" icon="arrow-down-alt"/>
					</ToggleGroupControl>

					<ToggleGroupControl
						label={ __( 'Content Vertical Position', 'jet-popup' ) }
						value={ metaStyles.content_ver_position }
						onChange={ ( value ) => updateMetaValue( 'content_ver_position', value ) }
					>
						<ToggleGroupControlOptionIcon value="flex-start" label="Top" icon="arrow-up-alt"  />
						<ToggleGroupControlOptionIcon value="center" label="Center" icon="align-center"/>
						<ToggleGroupControlOptionIcon value="flex-end" label="Bottom" icon="arrow-down-alt"/>
					</ToggleGroupControl>

					<BackgroundControl
						label={ __( 'Background Color', 'jet-popup' ) }
						value={ metaStyles.container_bg }
						onChange={ newValue => {
							updateMetaValue( 'container_bg', newValue );
						} }
					/>

					<BaseControl label={ __( 'Horizontal Padding', 'jet-popup' ) }>
						<UnitControl
							onChange={ (value) => {
								updateMetaValue( 'container_hor_padding', value );
							} }
							isUnitSelectTabbable
							value={ metaStyles.container_hor_padding }
						/>
					</BaseControl>

					<BaseControl label={ __( 'Vertical Padding', 'jet-popup' ) }>
						<UnitControl
							onChange={ (value) => {
								updateMetaValue( 'container_ver_padding', value );
							} }
							isUnitSelectTabbable
							value={ metaStyles.container_ver_padding }
						/>
					</BaseControl>

					<BaseControl label={ __( 'Vertical Margin', 'jet-popup' ) }>
						<UnitControl
							onChange={ (value) => {
								updateMetaValue( 'container_ver_margin', value );
							} }
							isUnitSelectTabbable
							value={ metaStyles.container_ver_margin }
						/>
					</BaseControl>

					<BaseControl label={ __( 'Horizontal Margin', 'jet-popup' ) }>
						<UnitControl
							onChange={ (value) => {
								updateMetaValue( 'container_hor_margin', value );
							} }
							isUnitSelectTabbable
							value={ metaStyles.container_hor_margin }
						/>
					</BaseControl>

					<BaseControl label={ __( 'Border', 'jet-popup' ) }>
						<BorderControl
							onChange={ (value) => {
								updateMetaValue( 'container_border', objToBorderStr( value ) );
							} }
							value={ borderStrToObj( metaStyles.container_border ) }
						/>
					</BaseControl>

					<BaseControl label={ __( 'Border Radius', 'jet-popup' ) }>
						<UnitControl
							onChange={ (value) => {
								updateMetaValue( 'container_border_radius', value );
							} }
							isUnitSelectTabbable
							value={ metaStyles.container_border_radius }
						/>
					</BaseControl>

					<BoxShadowControl
						label={ __( 'Box Shadow', 'jet-popup' ) }
						value={ boxShadowStrToObj( metaStyles.container_box_shadow ) }
						onChange={ newValue => {
							console.log(newValue)
							updateMetaValue( 'container_box_shadow', objToBoxShadowStr( newValue ) );
						} }
					/>

					<BaseControl label={ __( 'Z Index', 'jet-popup' ) }>
						<InputControl
							type="number"
							value={ metaStyles.z_index }
							onChange={ (value) => {
								updateMetaValue( 'z_index', value );
							} }
						/>
					</BaseControl>

				</PanelBody>
				<PanelBody title={__( 'Close Button Styles' )}>
					<BaseControl label={ __( 'Icon Color', 'jet-popup' ) }>
						<ColorPickerControl
							color={ metaStyles.close_button_icon_color }
							onChange={ ( value ) => updateMetaValue( 'close_button_icon_color', value ) }
						/>
					</BaseControl>

					<BaseControl label={ __( 'Icon Size', 'jet-popup' ) }>
						<UnitControl
							onChange={ (value) => {
								updateMetaValue( 'close_button_icon_size', value );
							} }
							isUnitSelectTabbable
							value={ metaStyles.close_button_icon_size }
						/>
					</BaseControl>

					<BaseControl label={ __( 'Background Color', 'jet-popup' ) }>
						<ColorPickerControl
							color={ metaStyles.close_button_bg_color }
							onChange={ ( value ) => updateMetaValue( 'close_button_bg_color', value ) }
						/>
					</BaseControl>

					<BaseControl label={ __( 'Button Size', 'jet-popup' ) }>
						<UnitControl
							onChange={ (value) => {
								updateMetaValue( 'close_button_size', value );
							} }
							isUnitSelectTabbable
							value={ metaStyles.close_button_size }
						/>
					</BaseControl>

					<BaseControl label={ __( 'Border', 'jet-popup' ) }>
						<BorderControl
							onChange={ (value) => {
								updateMetaValue( 'close_button_border', objToBorderStr( value ) );
							} }
							value={ borderStrToObj( metaStyles.close_button_border ) }
						/>
					</BaseControl>

					<BaseControl label={ __( 'Border Radius', 'jet-popup' ) }>
						<UnitControl
							onChange={ (value) => {
								updateMetaValue( 'close_button_border_radius', value );
							} }
							isUnitSelectTabbable
							value={ metaStyles.close_button_border_radius }
						/>
					</BaseControl>

					<BaseControl label={ __( 'Button X Translate', 'jet-popup' ) }>
						<UnitControl
							onChange={ (value) => {
								updateMetaValue( 'close_button_translate_x', value );
							} }
							isUnitSelectTabbable
							value={ metaStyles.close_button_translate_x }
						/>
					</BaseControl>

					<BaseControl label={ __( 'Button Y Translate', 'jet-popup' ) }>
						<UnitControl
							onChange={ (value) => {
								updateMetaValue( 'close_button_translate_y', value );
							} }
							isUnitSelectTabbable
							value={ metaStyles.close_button_translate_y }
						/>
					</BaseControl>

				</PanelBody>
				<PanelBody title={__( 'Overlay Styles' )}>
					<BackgroundControl
						label={ __( 'Background Color', 'jet-popup' ) }
						value={ metaStyles.overlay_bg }
						onChange={ newValue => {
							updateMetaValue( 'overlay_bg', newValue );
						} }
					/>
				</PanelBody>
			</PluginSidebar>
		</Fragment>
	)
} } );