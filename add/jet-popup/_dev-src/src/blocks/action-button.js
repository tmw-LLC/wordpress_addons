import { actionButtonIcon } from 'includes/icons';
import TemplateRender from 'includes/templateRender';

const { __ } = wp.i18n;

const {
	PanelBody,
	BaseControl,
	Icon,
	Button,
	TextControl,
	SelectControl,
	ToggleControl,
	Flex,
	FlexBlock,
	FlexItem,
	__experimentalInputControl,
	__experimentalRadioGroup,
	__experimentalRadio,
} = wp.components;

let {
	InputControl,
	RadioGroup,
	Radio
} = wp.components;

InputControl = InputControl || __experimentalInputControl;
RadioGroup = RadioGroup || __experimentalRadioGroup;
Radio = Radio || __experimentalRadio;

const {
	registerBlockType
} = wp.blocks;

const {
	InspectorControls, MediaUpload, URLInput
} = wp.blockEditor;

const {
	RawHTML,
	useState
} = wp.element;

if ( 'jet-popup' === window.JetPopupBlockEditorConfig.postType ) {
	registerBlockType( 'jet-popup/action-button', {
		title: __( 'Popup Action Button' ),
		icon: actionButtonIcon,
		category: 'layout',
		className: 'jet-popup-action-button',
		supports: {
			html: false
		},
		attributes: JetPopupBlockEditorConfig.registeredBlockAttrs[ 'action-button' ] || {},
		example: {
			attributes: {
				blockPreview: true,
			},
			viewportWidth: 625
		},
		edit: class extends wp.element.Component {
			render() {
				const props = this.props;

				return [
					props.isSelected && (
						<InspectorControls key={ 'inspector' }>
							<PanelBody title={__( 'General' )}>
								<BaseControl label={ __( 'Action Type', 'jet-popup' ) } help={ __( 'Select action type for current popup', 'jet-popup' ) }>
									<SelectControl
										value={ props.attributes.actionType }
										options={ window.JetPopupBlockEditorConfig.actionsOptions || [] }
										onChange={ ( value ) => {
											props.setAttributes( { actionType: value } )
										} }
									/>
								</BaseControl>
								<BaseControl label={ __( 'Alignment', 'jet-popup' ) } className="jet-radio-group-control">
									<RadioGroup
										checked={ props.attributes.buttonAlignment }
										onChange={ ( value ) => {
											props.setAttributes( { buttonAlignment: value } )
										} }
										defaultChecked="center"
									>
										<Radio value="left"><Icon icon="editor-alignleft" /></Radio>
										<Radio value="center"><Icon icon="editor-aligncenter" /></Radio>
										<Radio value="right"><Icon icon="editor-alignright" /></Radio>
										<Radio value="justified"><Icon icon="editor-justify" /></Radio>
									</RadioGroup>
								</BaseControl>
								<BaseControl label={__( 'Button Text', 'jet-popup' )} >
									<InputControl
										value={ props.attributes.buttonText }
										onChange={ ( value ) => {
											props.setAttributes( { buttonText: value } )
										} }
									/>
								</BaseControl>
								<BaseControl label={ __( 'SVG Icon', 'jet-popup' ) }>
									<div className="components-base-control jet-media-control">
										<div className="jet-media-control__container">
											{ props.attributes.iconUrl &&
												<img className="jet-media-control__preview"
													 src={ props.attributes.iconUrl }
													 alt=""/>
											}
											<MediaUpload
												onSelect={ media => {
													props.setAttributes( { iconId: media.id } )
													props.setAttributes( { iconUrl: media.url } )
												} }
												allowedTypes={ [ 'image/svg+xml' ] }
												value={ props.attributes.iconId }
												render={ ( { open } ) => (
													<Button
														isSecondary
														icon="edit"
														onClick={open}
													>{ __( 'Select Icon' ) }</Button>
												)}
											/>
											{ props.attributes.iconUrl &&
												<Button
													onClick={ () => {
														props.setAttributes( { iconId: '' } )
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
								{ 'link' === props.attributes.actionType &&
									<BaseControl label={ __( 'Button Link', 'jet-popup' ) } className={ 'jet-popup-url-input'}>
										<URLInput
											value={ props.attributes.buttonLink }
											onChange={ ( url, post ) => {
												props.setAttributes( { buttonLink: url } );
											} }
										/>

										<Flex>
											<FlexItem>
												<ToggleControl
													checked={ props.attributes.buttonLinkBlank }
													onChange={ () => {
														props.setAttributes( { buttonLinkBlank: ! props.attributes.buttonLinkBlank } );
													}}
												/>
											</FlexItem>
											<FlexBlock>{ __( 'Open in new window', 'jet-popup' ) }</FlexBlock>
										</Flex>
										<Flex>
											<FlexItem>
												<ToggleControl
													checked={ props.attributes.buttonLinkNofollow }
													onChange={ () => {
														props.setAttributes( { buttonLinkNofollow: ! props.attributes.buttonLinkNofollow } );
													}}
												/>
											</FlexItem>
											<FlexBlock>{ __( 'Add nofollow', 'jet-popup' ) }</FlexBlock>
										</Flex>
									</BaseControl>
								}
							</PanelBody>
						</InspectorControls>
					),
					<div className="jet-popup-block-holder">
						<TemplateRender
							block="jet-popup/action-button"
							attributes={ props.attributes }
						/>
					</div>
				];
			}

		},
		save: () => {
			return null;
		}
	});
}
