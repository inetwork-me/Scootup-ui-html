import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl, RangeControl, SelectControl } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import { __ } from '@wordpress/i18n';

const PLATFORM_OPTIONS = [
	{ label: 'Instagram', value: 'instagram' },
	{ label: 'TikTok', value: 'tiktok' },
	{ label: 'YouTube', value: 'youtube' },
	{ label: 'LinkedIn', value: 'linkedin' },
];

export default function Edit( { attributes, setAttributes } ) {
	const bp = useBlockProps();
	const { quote, rating, author, role, platform } = attributes;

	return (
		<div { ...bp }>
			<InspectorControls>
				<PanelBody title={ __( 'Testimonial', 'scootup' ) }>
					<TextareaControl label={ __( 'Quote', 'scootup' ) } value={ quote } onChange={ ( v ) => setAttributes( { quote: v } ) } />
					<TextControl label={ __( 'Author', 'scootup' ) } value={ author } onChange={ ( v ) => setAttributes( { author: v } ) } />
					<TextControl label={ __( 'Role', 'scootup' ) } value={ role } onChange={ ( v ) => setAttributes( { role: v } ) } />
					<RangeControl label={ __( 'Rating', 'scootup' ) } value={ rating } min={ 1 } max={ 5 } onChange={ ( v ) => setAttributes( { rating: v } ) } />
					<SelectControl label={ __( 'Platform', 'scootup' ) } value={ platform } options={ PLATFORM_OPTIONS } onChange={ ( v ) => setAttributes( { platform: v } ) } />
				</PanelBody>
			</InspectorControls>

			<ServerSideRender block="scootup/testimonial-card" attributes={ attributes } />
		</div>
	);
}
