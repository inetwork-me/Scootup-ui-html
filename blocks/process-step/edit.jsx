import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl, SelectControl } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import { __ } from '@wordpress/i18n';

const ICON_OPTIONS = [
	{ label: 'Chat', value: 'chat' },
	{ label: 'Chart', value: 'chart' },
	{ label: 'Gear', value: 'gear' },
	{ label: 'Trend', value: 'trend' },
];

export default function Edit( { attributes, setAttributes } ) {
	const bp = useBlockProps();
	const { number, title, description, icon } = attributes;

	return (
		<div { ...bp }>
			<InspectorControls>
				<PanelBody title={ __( 'Process step', 'scootup' ) }>
					<TextControl label={ __( 'Number', 'scootup' ) } value={ number } onChange={ ( v ) => setAttributes( { number: v } ) } />
					<SelectControl label={ __( 'Icon', 'scootup' ) } value={ icon } options={ ICON_OPTIONS } onChange={ ( v ) => setAttributes( { icon: v } ) } />
					<TextControl label={ __( 'Title', 'scootup' ) } value={ title } onChange={ ( v ) => setAttributes( { title: v } ) } />
					<TextareaControl label={ __( 'Description', 'scootup' ) } value={ description } onChange={ ( v ) => setAttributes( { description: v } ) } />
				</PanelBody>
			</InspectorControls>

			<ServerSideRender block="scootup/process-step" attributes={ attributes } />
		</div>
	);
}
