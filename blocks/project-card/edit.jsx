import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl, Button } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import { __ } from '@wordpress/i18n';

export default function Edit( { attributes, setAttributes } ) {
	const bp = useBlockProps( { className: 'proj-card' } );
	const { imageUrl, imageAlt, title, excerpt, url } = attributes;

	return (
		<div { ...bp }>
			<InspectorControls>
				<PanelBody title={ __( 'Project Card', 'scootup' ) }>
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
						label={ __( 'Title', 'scootup' ) }
						value={ title }
						onChange={ ( v ) => setAttributes( { title: v } ) }
					/>
					<TextareaControl
						label={ __( 'Excerpt', 'scootup' ) }
						value={ excerpt }
						onChange={ ( v ) => setAttributes( { excerpt: v } ) }
					/>
					<TextControl
						label={ __( 'Link URL', 'scootup' ) }
						value={ url }
						onChange={ ( v ) => setAttributes( { url: v } ) }
					/>
				</PanelBody>
			</InspectorControls>

			<ServerSideRender block="scootup/project-card" attributes={ attributes } />
		</div>
	);
}
