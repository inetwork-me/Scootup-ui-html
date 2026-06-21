import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl, Button } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import { __ } from '@wordpress/i18n';

export default function Edit( { attributes, setAttributes } ) {
	const bp = useBlockProps( { className: 'proj-hero' } );
	const { imageUrl, imageAlt, title, overlayText } = attributes;

	return (
		<div { ...bp }>
			<InspectorControls>
				<PanelBody title={ __( 'Project Hero', 'scootup' ) }>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ ( m ) => setAttributes( { imageUrl: m.url, imageAlt: m.alt || '' } ) }
							allowedTypes={ [ 'image' ] }
							render={ ( { open } ) => (
								<Button variant="secondary" onClick={ open }>
									{ imageUrl ? __( 'Replace image', 'scootup' ) : __( 'Select image', 'scootup' ) }
								</Button>
							) }
						/>
					</MediaUploadCheck>
					<TextControl
						label={ __( 'Image alt text', 'scootup' ) }
						value={ imageAlt }
						onChange={ ( v ) => setAttributes( { imageAlt: v } ) }
					/>
					<TextControl
						label={ __( 'Project title', 'scootup' ) }
						value={ title }
						onChange={ ( v ) => setAttributes( { title: v } ) }
					/>
					<TextareaControl
						label={ __( 'Overlay sub-text', 'scootup' ) }
						value={ overlayText }
						onChange={ ( v ) => setAttributes( { overlayText: v } ) }
					/>
				</PanelBody>
			</InspectorControls>

			<ServerSideRender block="scootup/project-hero" attributes={ attributes } />
		</div>
	);
}
