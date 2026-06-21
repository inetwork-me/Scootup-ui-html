import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, TextControl, SelectControl, Button } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import { __ } from '@wordpress/i18n';

const PLATFORM_OPTIONS = [
	{ label: 'Instagram', value: 'instagram' },
	{ label: 'TikTok', value: 'tiktok' },
	{ label: 'YouTube', value: 'youtube' },
	{ label: 'Facebook', value: 'facebook' },
];

export default function Edit( { attributes, setAttributes } ) {
	const bp = useBlockProps();
	const { imageUrl, imageAlt, caption, handle, platform, videoUrl } = attributes;

	return (
		<div { ...bp }>
			<InspectorControls>
				<PanelBody title={ __( 'Reel card', 'scootup' ) }>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ ( m ) => setAttributes( { imageUrl: m.url, imageAlt: m.alt || imageAlt } ) }
							allowedTypes={ [ 'image' ] }
							render={ ( { open } ) => (
								<Button variant="secondary" onClick={ open }>
									{ imageUrl ? __( 'Replace cover', 'scootup' ) : __( 'Select cover', 'scootup' ) }
								</Button>
							) }
						/>
					</MediaUploadCheck>
					<TextControl label={ __( 'Image alt', 'scootup' ) } value={ imageAlt } onChange={ ( v ) => setAttributes( { imageAlt: v } ) } />
					<TextControl label={ __( 'Handle', 'scootup' ) } value={ handle } onChange={ ( v ) => setAttributes( { handle: v } ) } />
					<TextControl label={ __( 'Caption', 'scootup' ) } value={ caption } onChange={ ( v ) => setAttributes( { caption: v } ) } />
					<SelectControl label={ __( 'Platform', 'scootup' ) } value={ platform } options={ PLATFORM_OPTIONS } onChange={ ( v ) => setAttributes( { platform: v } ) } />
					<TextControl label={ __( 'Video URL', 'scootup' ) } value={ videoUrl } onChange={ ( v ) => setAttributes( { videoUrl: v } ) } />
				</PanelBody>
			</InspectorControls>

			<ServerSideRender block="scootup/reel-card" attributes={ attributes } />
		</div>
	);
}
