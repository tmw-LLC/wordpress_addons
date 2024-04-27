import ColorPickerControl from "includes/controls/color-picker-control";

const { __ } = wp.i18n;

/**
 * External dependencies
 */
const { isEmpty } = window.lodash;

const { useState } = wp.element;

const {
	MediaUpload,
} = wp.blockEditor;

/**
 * WordPress dependencies
 */
const { withInstanceId } = window.wp.compose;

/**
 * Internal dependencies
 */

const {
	BaseControl,
	Dropdown,
	Button,
	Icon,
	ColorIndicator,
	ColorPicker,
	GradientPicker,
	RadioControl,
	SelectControl,
	__experimentalToggleGroupControl,
	__experimentalToggleGroupControlOption,
} = wp.components;

let {
	ToggleGroupControl,
	ToggleGroupControlOption,
} = wp.components;

ToggleGroupControl = ToggleGroupControl || __experimentalToggleGroupControl;
ToggleGroupControlOption = ToggleGroupControlOption || __experimentalToggleGroupControlOption;

function BackgroundControl( {
	label,
	help,
	hideLabelFromVision,
	className,
	onChange,
	value,
} ) {
	const onChangeValue = ( changedValue ) => {
		let updatedValue = Object.assign( {}, value, changedValue );

		onChange( updatedValue );
	};

	const onReset = () => {
		onChange( {
			type: 'classic',
			color: '#fff',
			bg_image_id: '',
			bg_image_url: '',
			bg_position: 'center center',
			bg_repeat: 'no-repeat',
			bg_size: 'auto',
			gradient: 'linear-gradient(160deg, rgba(85,85,85,0.8477984943977591) 0%, rgba(0,0,0,0.8505996148459384) 100%)'
		} );
	}

	/* eslint-disable jsx-a11y/no-onchange */
	return (
		<BaseControl label={ label } hideLabelFromVision={ hideLabelFromVision } help={ help } className={ className }>
			<div className="components-jet-background-control">
				<div className="components-jet-background-control__type">
					<ToggleGroupControl
						value={ value.type }
						onChange={ ( value ) => {
							onChangeValue( { type: value } );
						} }
					>
						<ToggleGroupControlOption value="classic" label="Classic" />
						<ToggleGroupControlOption value="gradient" label="Gradient" />
					</ToggleGroupControl>
				</div>

				{ 'gradient' === value.type && <div className="components-jet-background-control__type-controls">
					<GradientPicker
						__nextHasNoMargin
						value={ value.gradient }
						onChange={ ( currentGradient ) => {
							onChangeValue( { gradient: currentGradient } );
						} }
					/>
				</div> }

				{ 'classic' === value.type && <div className="components-jet-background-control__type-controls">
					<BaseControl label={ __( 'Color', 'jet-popup' ) }>
						<ColorPickerControl
							color={ value.color }
							onChange={ ( value ) => onChangeValue( { color: value } ) }
						/>
					</BaseControl>
					<BaseControl label={ __( 'Image', 'jet-popup' ) }>
						<div className="components-base-control jet-media-control jet-media-control--image-preview">
							<div className="jet-media-control__container">
								{ value.bg_image_url &&
									<img className="jet-media-control__preview"
										 src={ value.bg_image_url }
										 alt=""/>
								}
								<MediaUpload
									onSelect={ media => {
										onChangeValue( {
											bg_image_id: media.id.toString(),
											bg_image_url: media.url
										} );
									} }
									allowedTypes={ [ 'image' ] }
									value={ value.bg_image_id }
									render={ ( { open } ) => (
										<Button
											isSecondary
											icon="edit"
											onClick={open}
										>{ __( 'Select Image' ) }</Button>
									)}
								/>
								{ value.bg_image_url &&
									<Button
										onClick={ () => {
											onChangeValue( {
												bg_image_url: '',
												bg_image_id: ''
											} );
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
					{ value.bg_image_url && <BaseControl label={ __( 'Image Position', 'jet-popup' ) }>
						<SelectControl
							value={ value.bg_position }
							options={ [
								{ label: __( 'Center Center', 'jet-popup' ), value: 'center center' },
								{ label: __( 'Center Left', 'jet-popup' ), value: 'center left' },
								{ label: __( 'Center Right', 'jet-popup' ), value: 'center right' },
								{ label: __( 'Top Center', 'jet-popup' ), value: 'top center' },
								{ label: __( 'Top Left', 'jet-popup' ), value: 'top left' },
								{ label: __( 'Top Right', 'jet-popup' ), value: 'top right' },
								{ label: __( 'Bottom Center', 'jet-popup' ), value: 'bottom center' },
								{ label: __( 'Bottom Left', 'jet-popup' ), value: 'bottom left' },
								{ label: __( 'Bottom Left', 'jet-popup' ), value: 'bottom right' },
								{ label: __( 'Bottom Left', 'jet-popup' ), value: 'bottom right' },
							] }
							onChange={ ( value ) => {
								onChangeValue( { bg_position: value } );
							} }
						/>
					</BaseControl> }
					{ value.bg_image_url && <BaseControl label={ __( 'Image Repeat', 'jet-popup' ) }>
						<SelectControl
							value={ value.bg_repeat }
							options={ [
								{ label: __( 'No Repeat', 'jet-popup' ), value: 'no-repeat' },
								{ label: __( 'Repeat', 'jet-popup' ), value: 'repeat' },
								{ label: __( 'Repeat X', 'jet-popup' ), value: 'repeat-x' },
								{ label: __( 'Repeat Y', 'jet-popup' ), value: 'repeat-y' },
							] }
							onChange={ ( value ) => {
								onChangeValue( { bg_repeat: value } );
							} }
						/>
					</BaseControl> }
					{ value.bg_image_url && <BaseControl label={ __( 'Image Size', 'jet-popup' ) }>
						<SelectControl
							value={ value.bg_size }
							options={ [
								{ label: __( 'Auto', 'jet-popup' ), value: 'auto' },
								{ label: __( 'Cover', 'jet-popup' ), value: 'cover' },
								{ label: __( 'Contain', 'jet-popup' ), value: 'contain' },
							] }
							onChange={ ( value ) => {
								onChangeValue( { bg_size: value } );
							} }
						/>
					</BaseControl> }
				</div> }
			</div>
		</BaseControl>
	);
	/* eslint-enable jsx-a11y/no-onchange */
}

export default withInstanceId( BackgroundControl );