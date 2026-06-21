import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import { __ } from '@wordpress/i18n';

export default function Edit( { attributes, setAttributes } ) {
	const bp = useBlockProps( { className: 'mb-12' } );
	const { label, title, body } = attributes;

	return (
		<div { ...bp }>
			<InspectorControls>
				<PanelBody title={ __( 'Section', 'scootup' ) }>
					<TextControl
						label={ __( 'Eyebrow label', 'scootup' ) }
						value={ label }
						onChange={ ( v ) => setAttributes( { label: v } ) }
					/>
					<TextControl
						label={ __( 'Section title', 'scootup' ) }
						value={ title }
						onChange={ ( v ) => setAttributes( { title: v } ) }
					/>
					<TextareaControl
						label={ __( 'Body copy', 'scootup' ) }
						value={ body }
						onChange={ ( v ) => setAttributes( { body: v } ) }
					/>
				</PanelBody>
			</InspectorControls>

			<ServerSideRender block="scootup/section-with-label" attributes={ attributes } />
		</div>
	);
}
