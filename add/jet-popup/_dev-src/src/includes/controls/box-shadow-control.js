import {
	boxShadowStrToObj,
	objToBoxShadowStr,
} from 'includes/utility';

const { __ } = wp.i18n;

/**
 * External dependencies
 */
const { isEmpty } = window.lodash;

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
	ColorPicker,
	__experimentalUnitControl
} = wp.components;

let {
	Button,
	UnitControl,
} = wp.components;

UnitControl = UnitControl || __experimentalUnitControl;

function BoxShadowControl( {
	   help,
	   label,
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
			offsetX: '0px',
			offsetY: '0px',
			blurRadius: '0px',
			color: '#000',
		} );
	}

	/* eslint-disable jsx-a11y/no-onchange */
	return (
		<BaseControl label={ label } hideLabelFromVision={ hideLabelFromVision } help={ help } className={ className }>
			<div className="components-jet-box-shadow-control">
				<div className="components-jet-box-shadow-control__box" style={ { boxShadow: objToBoxShadowStr( value ) } }>
					<div className="components-jet-box-shadow-control__verbose-value">{ objToBoxShadowStr( value ) }</div>
					<div className="components-jet-box-shadow-control__toggle">
						<Dropdown
							className="jet-box-shadow-control"
							contentClassName="jet-box-shadow-control-content"
							popoverProps={ { placement: 'bottom-end' } }
							renderToggle={ ( { isOpen, onToggle } ) => (
								<Icon
									icon='edit'
									onClick={ onToggle }
									aria-expanded={ isOpen }
								/>
							) }
							renderContent={ () => (
								<div className='jet-box-shadow-control-content__controls'>
									<BaseControl label={ __( 'Offset X', 'jet-popup' ) }>
										<UnitControl
											onChange={ ( value ) => {
												const newValue = ! isEmpty( value ) ? { offsetX: value } : { offsetX: '0px' };

												onChangeValue( newValue );
											} }
											isUnitSelectTabbable
											value={ value.offsetX }
											units={ [
												{
													default: 0,
													label: 'px',
													value: 'px'
												},
											] }
										/>
									</BaseControl>
									<BaseControl label={ __( 'Offset Y', 'jet-popup' ) }>
										<UnitControl
											onChange={ ( value ) => {
												const newValue = ! isEmpty( value ) ? { offsetY: value } : { offsetY: '0px' };

												onChangeValue( newValue );
											} }
											isUnitSelectTabbable
											value={ value.offsetY }
											units={ [
												{
													default: 0,
													label: 'px',
													value: 'px'
												},
											] }
										/>
									</BaseControl>
									<BaseControl label={ __( 'Blur Radius', 'jet-popup' ) }>
										<UnitControl
											onChange={ ( value ) => {
												const newValue = ! isEmpty( value ) ? { blurRadius: value } : { blurRadius: '0px' };

												onChangeValue( newValue );
											} }
											isUnitSelectTabbable
											value={ value.blurRadius }
											units={ [
												{
													default: 0,
													label: 'px',
													value: 'px'
												},
											] }
										/>
									</BaseControl>
									<BaseControl label={ __( 'Color', 'jet-popup' ) }>
										<ColorPicker
											color={ value.color }
											enableAlpha={ true }
											onChange={ ( value ) => {
												onChangeValue( { color: value } );
											} }
										/>
									</BaseControl>
								</div>
							) }
						/>
					</div>
					<div className="components-jet-box-shadow-control__reset">
						<Icon
							icon='editor-removeformatting'
							onClick={ onReset }
						/>
					</div>
				</div>
			</div>

		</BaseControl>
	);
	/* eslint-enable jsx-a11y/no-onchange */
}

export default withInstanceId( BoxShadowControl );