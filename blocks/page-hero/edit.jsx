import {
	useBlockProps,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import ServerSideRender from '@wordpress/server-side-render';
import { PanelBody, TextControl, TextareaControl, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function Edit( { attributes, setAttributes } ) {
	const bp = useBlockProps();
	const {
		tag,
		heading,
		lead,
		primaryLabel,
		primaryUrl,
		secondaryLabel,
		secondaryUrl,
		imageUrl,
		imageAlt,
	} = attributes;

	return (
		<div { ...bp }>
			<InspectorControls>
				<PanelBody title={ __( 'Hero Content', 'scootup' ) }>
					<TextControl
						label={ __( 'Eyebrow tag', 'scootup' ) }
						value={ tag }
						onChange={ ( v ) => setAttributes( { tag: v } ) }
					/>
					<TextControl
						label={ __( 'Heading', 'scootup' ) }
						value={ heading }
						onChange={ ( v ) => setAttributes( { heading: v } ) }
					/>
					<TextareaControl
						label={ __( 'Lead paragraph', 'scootup' ) }
						value={ lead }
						onChange={ ( v ) => setAttributes( { lead: v } ) }
					/>
					<p style={ { fontSize: '12px', opacity: 0.7 } }>
						{ __(
							'Breadcrumb (crumbs) is set in the block markup as an array of { label, url }; the last item is the current page.',
							'scootup'
						) }
					</p>
				</PanelBody>
				<PanelBody title={ __( 'Primary CTA', 'scootup' ) } initialOpen={ false }>
					<TextControl
						label={ __( 'Label', 'scootup' ) }
						value={ primaryLabel }
						onChange={ ( v ) => setAttributes( { primaryLabel: v } ) }
					/>
					<TextControl
						label={ __( 'URL', 'scootup' ) }
						value={ primaryUrl }
						onChange={ ( v ) => setAttributes( { primaryUrl: v } ) }
					/>
				</PanelBody>
				<PanelBody title={ __( 'Secondary CTA', 'scootup' ) } initialOpen={ false }>
					<TextControl
						label={ __( 'Label', 'scootup' ) }
						value={ secondaryLabel }
						onChange={ ( v ) => setAttributes( { secondaryLabel: v } ) }
					/>
					<TextControl
						label={ __( 'URL', 'scootup' ) }
						value={ secondaryUrl }
						onChange={ ( v ) => setAttributes( { secondaryUrl: v } ) }
					/>
				</PanelBody>
				<PanelBody title={ __( 'Image', 'scootup' ) } initialOpen={ false }>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ ( m ) =>
								setAttributes( {
									imageUrl: m.url,
									imageAlt: m.alt || '',
								} )
							}
							allowedTypes={ [ 'image' ] }
							render={ ( { open } ) => (
								<Button variant="secondary" onClick={ open }>
									{ imageUrl
										? __( 'Replace image', 'scootup' )
										: __( 'Select image', 'scootup' ) }
								</Button>
							) }
						/>
					</MediaUploadCheck>
					<TextControl
						label={ __( 'Image alt text', 'scootup' ) }
						value={ imageAlt }
						onChange={ ( v ) => setAttributes( { imageAlt: v } ) }
					/>
				</PanelBody>
			</InspectorControls>

			{ /* Live front-end preview: renders this block's render.php / Twig so the
			     editor canvas matches the front end exactly. Edit fields via the
			     Inspector sidebar on the right. */ }
			<ServerSideRender
				block="scootup/page-hero"
				attributes={ attributes }
			/>
		</div>
	);
}
