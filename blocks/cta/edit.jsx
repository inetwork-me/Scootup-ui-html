import {
	useBlockProps,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import ServerSideRender from '@wordpress/server-side-render';
import { PanelBody, TextControl, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function Edit( { attributes, setAttributes } ) {
	const bp = useBlockProps();
	const { ctaLabel, ctaUrl, heading, images } = attributes;

	return (
		<div { ...bp }>
			<InspectorControls>
				<PanelBody title={ __( 'CTA Content', 'scootup' ) }>
					<TextControl
						label={ __( 'Heading', 'scootup' ) }
						value={ heading }
						onChange={ ( v ) => setAttributes( { heading: v } ) }
					/>
					<TextControl
						label={ __( 'Button label', 'scootup' ) }
						value={ ctaLabel }
						onChange={ ( v ) => setAttributes( { ctaLabel: v } ) }
					/>
					<TextControl
						label={ __( 'Button URL', 'scootup' ) }
						value={ ctaUrl }
						onChange={ ( v ) => setAttributes( { ctaUrl: v } ) }
					/>
				</PanelBody>
				<PanelBody title={ __( 'Parallax images', 'scootup' ) } initialOpen={ false }>
					<MediaUploadCheck>
						<MediaUpload
							multiple
							gallery
							onSelect={ ( media ) =>
								setAttributes( {
									images: ( media || [] ).map( ( m ) => m.url ),
								} )
							}
							render={ ( { open } ) => (
								<Button variant="secondary" onClick={ open }>
									{ images && images.length
										? __( 'Edit images', 'scootup' )
										: __( 'Select images', 'scootup' ) }
								</Button>
							) }
						/>
					</MediaUploadCheck>
				</PanelBody>
			</InspectorControls>

			<ServerSideRender block="scootup/cta" attributes={ attributes } />
		</div>
	);
}
