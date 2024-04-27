import './styles.scss';
import '../blocks/action-button';

import {
    isEmptyValue
} from 'includes/utility';

import CustomControl from '../includes/controls/custom-control.js';

const { __ } = wp.i18n;

const { addFilter } = wp.hooks;

const { Fragment, useState } = wp.element;

const {
    InspectorAdvancedControls
} = wp.blockEditor;

const { createHigherOrderComponent } = wp.compose;

const {
    PanelBody,
    BaseControl,
    TextControl,
    SelectControl,
    __experimentalInputControl,
    __experimentalDivider,
} = wp.components;

let {
    InputControl,
    Divider,
} = wp.components;

InputControl = InputControl || __experimentalInputControl;
Divider = Divider || __experimentalDivider;

const notSupportedBlocks = window.JetPopupBlockEditorConfig.notSupportedBlocks || {};

class JetPopupBlockEditor {

    constructor() {
        const self = this;

        this.addAdvancedControls();
    }

    getExtraControls() {
        return Object.values( window.JetPopupBlockEditorConfig.dataAttributes );
    }

    getBlockAttrs() {
        
        const attrs = {};

        for ( const attr in window.JetPopupBlockEditorConfig.dataAttributes ) {
            attrs[ attr ] = {
                type: window.JetPopupBlockEditorConfig.dataAttributes[ attr ].dataType,
                default: window.JetPopupBlockEditorConfig.dataAttributes[ attr ].default,
            }
        }

        return attrs;

    }

    getExtraProps( blockAttrs ) {
        const props = {};

        for ( const attr in window.JetPopupBlockEditorConfig.dataAttributes ) {
            let value = window.JetPopupBlockEditorConfig.dataAttributes[ attr ].default;

            if ( undefined !== blockAttrs[ attr ] ) {
                value = blockAttrs[ attr ];
            }

            if ( isEmptyValue( value ) ) {
                continue;
            }

            props[ window.JetPopupBlockEditorConfig.dataAttributes[ attr ].dataAttr ] = value;

        }

        return props;

    }

    addAdvancedControls() {
        addFilter(
            'blocks.registerBlockType',
            'jet-popup/add-attached-instance-attr',
            ( settings, name ) => {

                if ( notSupportedBlocks.includes( name ) ) {
                    return settings;
                }

                if ( settings.attributes ) {
                    return _.assign( {}, settings, {
                        attributes: _.assign( {}, settings.attributes, this.getBlockAttrs() ),
                    } );
                }

                return settings;
            }
        );

        wp.hooks.addFilter(
            'blocks.getSaveContent.extraProps',
            'jet-popup/add-extra-props',
            ( props, block, attributes ) => {

                if ( notSupportedBlocks.includes( block.name ) ) {
                    return props;
                }

                if ( ! attributes.hasOwnProperty( 'jetPopupInstance' ) || 'none' === attributes['jetPopupInstance'] ) {
                    return props;
                }

                return Object.assign( {}, props, this.getExtraProps( attributes ) );

            }
        );

        addFilter(
            'editor.BlockEdit',
            'jet-popup/add-attached-instance-attr',
            ( BlockEdit ) => {
                return ( props ) => {
                    return (
                        <Fragment>
                            <BlockEdit {...props} />
                            { props.isSelected && ! notSupportedBlocks.includes( props.name ) &&
                                <InspectorAdvancedControls key={ 'attached-instance-attr' }>
                                    <Divider />
                                    { this.getExtraControls().map( ( control ) => {

                                        return <CustomControl
                                            control={ control }
                                            value={ props.attributes[ control.name ] }
                                            getValue={ ( otherAttr, currentAttr, allAttrs ) => {
                                                return allAttrs[ otherAttr ] || '';
                                            } }
                                            condition={ control.condition }
                                            attr={ control.name }
                                            attributes={ props.attributes }
                                            onChange={ newValue => {
                                                props.setAttributes( { [control.name]: newValue } );
                                            } }
                                        />
                                    } ) }
                                    <Divider />
                                </InspectorAdvancedControls>
                            }
                        </Fragment>
                    );
                };
            }
        );
    }
}

new JetPopupBlockEditor;
