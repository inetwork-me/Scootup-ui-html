import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import ServerSideRender from '@wordpress/server-side-render';
import { PanelBody, TextControl, TextareaControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function Edit( { attributes, setAttributes } ) {
	const bp = useBlockProps();
	const { number, title, description } = attributes;

	return (
		<div { ...bp }>
			<InspectorControls>
				<PanelBody title={ __( 'Feature Card', 'scootup' ) }>
					<TextControl
						label={ __( 'Number (e.g. 01)', 'scootup' ) }
						value={ number }
						onChange={ ( v ) => setAttributes( { number: v } ) }
					/>
					<TextControl
						label={ __( 'Title', 'scootup' ) }
						value={ title }
						onChange={ ( v ) => setAttributes( { title: v } ) }
					/>
					<TextareaControl
						label={ __( 'Description', 'scootup' ) }
						value={ description }
						onChange={ ( v ) => setAttributes( { description: v } ) }
					/>
				</PanelBody>
			</InspectorControls>
			<ServerSideRender block="scootup/feature-card" attributes={ attributes } />
		</div>
	);
}
