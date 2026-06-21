import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import ServerSideRender from '@wordpress/server-side-render';
import { PanelBody, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function Edit( { attributes, setAttributes } ) {
	const bp = useBlockProps();
	const { icon, label, value, subtext, url } = attributes;

	return (
		<div { ...bp }>
			<InspectorControls>
				<PanelBody title={ __( 'Contact Info Item', 'scootup' ) }>
					<TextControl
						label={ __( 'Icon (phone | email | location)', 'scootup' ) }
						value={ icon }
						onChange={ ( v ) => setAttributes( { icon: v } ) }
					/>
					<TextControl
						label={ __( 'Label', 'scootup' ) }
						value={ label }
						onChange={ ( v ) => setAttributes( { label: v } ) }
					/>
					<TextControl
						label={ __( 'Value', 'scootup' ) }
						value={ value }
						onChange={ ( v ) => setAttributes( { value: v } ) }
					/>
					<TextControl
						label={ __( 'Subtext', 'scootup' ) }
						value={ subtext }
						onChange={ ( v ) => setAttributes( { subtext: v } ) }
					/>
					<TextControl
						label={ __( 'Link URL (e.g. tel:… or mailto:…)', 'scootup' ) }
						value={ url }
						onChange={ ( v ) => setAttributes( { url: v } ) }
					/>
				</PanelBody>
			</InspectorControls>
			<ServerSideRender block="scootup/contact-info-item" attributes={ attributes } />
		</div>
	);
}
