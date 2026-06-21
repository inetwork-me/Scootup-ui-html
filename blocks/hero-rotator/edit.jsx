import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import ServerSideRender from '@wordpress/server-side-render';
import { PanelBody, TextControl, TextareaControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function Edit( { attributes, setAttributes } ) {
	const bp = useBlockProps();
	const {
		tagline,
		headingPrefix,
		rotatingWords,
		headingSuffix,
		lead,
		ctaLabel,
		ctaUrl,
		secondaryLabel,
		secondaryUrl,
	} = attributes;

	return (
		<div { ...bp }>
			<InspectorControls>
				<PanelBody title={ __( 'Hero Content', 'scootup' ) }>
					<TextControl
						label={ __( 'Tagline', 'scootup' ) }
						value={ tagline }
						onChange={ ( v ) => setAttributes( { tagline: v } ) }
					/>
					<TextControl
						label={ __( 'Heading prefix', 'scootup' ) }
						value={ headingPrefix }
						onChange={ ( v ) => setAttributes( { headingPrefix: v } ) }
					/>
					<TextareaControl
						label={ __( 'Rotating words (one per line)', 'scootup' ) }
						value={ ( rotatingWords || [] ).join( '\n' ) }
						onChange={ ( v ) =>
							setAttributes( {
								rotatingWords: v.split( '\n' ).map( ( w ) => w.trim() ).filter( Boolean ),
							} )
						}
					/>
					<TextControl
						label={ __( 'Heading suffix', 'scootup' ) }
						value={ headingSuffix }
						onChange={ ( v ) => setAttributes( { headingSuffix: v } ) }
					/>
					<TextareaControl
						label={ __( 'Lead paragraph', 'scootup' ) }
						value={ lead }
						onChange={ ( v ) => setAttributes( { lead: v } ) }
					/>
				</PanelBody>
				<PanelBody title={ __( 'Call to action', 'scootup' ) } initialOpen={ false }>
					<TextControl
						label={ __( 'Primary CTA label', 'scootup' ) }
						value={ ctaLabel }
						onChange={ ( v ) => setAttributes( { ctaLabel: v } ) }
					/>
					<TextControl
						label={ __( 'Primary CTA URL', 'scootup' ) }
						value={ ctaUrl }
						onChange={ ( v ) => setAttributes( { ctaUrl: v } ) }
					/>
					<TextControl
						label={ __( 'Secondary CTA label', 'scootup' ) }
						value={ secondaryLabel }
						onChange={ ( v ) => setAttributes( { secondaryLabel: v } ) }
					/>
					<TextControl
						label={ __( 'Secondary CTA URL', 'scootup' ) }
						value={ secondaryUrl }
						onChange={ ( v ) => setAttributes( { secondaryUrl: v } ) }
					/>
				</PanelBody>
			</InspectorControls>

			<ServerSideRender block="scootup/hero-rotator" attributes={ attributes } />
		</div>
	);
}
