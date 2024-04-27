const { __ } = wp.i18n;

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
	Icon,
	ColorIndicator,
	ColorPicker,
} = wp.components;

function ColorPickerControl( {
	onChange, color,
} ) {
	const onChangeValue = ( changedValue ) => {
		onChange( changedValue );
	};

	/* eslint-disable jsx-a11y/no-onchange */
	return (
		<div className="components-jet-color-picker-control">
			<Dropdown
				className="jet-color-picker-control"
				contentClassName="jet-color-picker-control-content"
				popoverProps={{ placement: 'bottom-end' }}
				renderToggle={( { isOpen, onToggle } ) => (
					<div className="jet-color-picker-control-toggle"
						 onClick={onToggle}
						 aria-expanded={isOpen}
					>
						<ColorIndicator
							colorValue={ color }
						/>
						<span className="jet-color-picker-control-toggle-verbose">{ color }</span>
					</div>
				)}
				renderContent={() => (
					<BaseControl label={__( 'Color', 'jet-popup' )}>
						<ColorPicker
							color={ color }
							enableAlpha={ true }
							onChange={ ( value ) => {
								onChangeValue( value );
							}}
						/>
					</BaseControl>
				)}
			/>
		</div>
	);
	/* eslint-enable jsx-a11y/no-onchange */
}

export default withInstanceId( ColorPickerControl );