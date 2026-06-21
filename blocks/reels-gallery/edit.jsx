import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl, RangeControl } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import { __ } from '@wordpress/i18n';

export default function Edit( { attributes, setAttributes } ) {
	const bp = useBlockProps();
	const { heading, eyebrow, subtitle, ctaLabel, ctaUrl, count } = attributes;

	return (
		<div { ...bp }>
			<InspectorControls>
				<PanelBody title={ __( 'Reels Gallery', 'scootup' ) }>
					<TextControl
						label={ __( 'Eyebrow', 'scootup' ) }
						value={ eyebrow }
						onChange={ ( v ) => setAttributes( { eyebrow: v } ) }
					/>
					<TextControl
						label={ __( 'Heading', 'scootup' ) }
						value={ heading }
						onChange={ ( v ) => setAttributes( { heading: v } ) }
					/>
					<TextareaControl
						label={ __( 'Subtitle', 'scootup' ) }
						value={ subtitle }
						onChange={ ( v ) => setAttributes( { subtitle: v } ) }
					/>
					<TextControl
						label={ __( 'CTA label', 'scootup' ) }
						value={ ctaLabel }
						onChange={ ( v ) => setAttributes( { ctaLabel: v } ) }
					/>
					<TextControl
						label={ __( 'CTA URL', 'scootup' ) }
						value={ ctaUrl }
						onChange={ ( v ) => setAttributes( { ctaUrl: v } ) }
					/>
					<RangeControl
						label={ __( 'Number of reels', 'scootup' ) }
						value={ count }
						min={ 1 }
						max={ 24 }
						onChange={ ( v ) => setAttributes( { count: v } ) }
					/>
				</PanelBody>
			</InspectorControls>

			<ServerSideRender block="scootup/reels-gallery" attributes={ attributes } />
		</div>
	);
}
