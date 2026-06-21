import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import { __ } from '@wordpress/i18n';

export default function Edit( { attributes, setAttributes } ) {
	const bp = useBlockProps( { className: 'work-card' } );
	const { icon, title, description, url, badge } = attributes;

	return (
		<div { ...bp }>
			<InspectorControls>
				<PanelBody title={ __( 'Service Card', 'scootup' ) }>
					<TextControl
						label={ __( 'Icon (sprite id, e.g. arrow-tr)', 'scootup' ) }
						value={ icon }
						onChange={ ( v ) => setAttributes( { icon: v } ) }
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
					<TextControl
						label={ __( 'Link URL', 'scootup' ) }
						value={ url }
						onChange={ ( v ) => setAttributes( { url: v } ) }
					/>
					<TextControl
						label={ __( 'Badge', 'scootup' ) }
						value={ badge }
						onChange={ ( v ) => setAttributes( { badge: v } ) }
					/>
				</PanelBody>
			</InspectorControls>

			<ServerSideRender block="scootup/service-card" attributes={ attributes } />
		</div>
	);
}
