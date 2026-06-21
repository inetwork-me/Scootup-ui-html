import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import { __ } from '@wordpress/i18n';

export default function Edit( { attributes, setAttributes } ) {
	const bp = useBlockProps( { className: 'flex items-center justify-between flex-wrap gap-6 pt-10 border-t border-line' } );
	const { backLabel, backUrl, nextLabel, nextUrl } = attributes;

	return (
		<div { ...bp }>
			<InspectorControls>
				<PanelBody title={ __( 'Navigation', 'scootup' ) }>
					<TextControl
						label={ __( 'Back label', 'scootup' ) }
						value={ backLabel }
						onChange={ ( v ) => setAttributes( { backLabel: v } ) }
					/>
					<TextControl
						label={ __( 'Back URL', 'scootup' ) }
						value={ backUrl }
						onChange={ ( v ) => setAttributes( { backUrl: v } ) }
					/>
					<TextControl
						label={ __( 'Next label', 'scootup' ) }
						value={ nextLabel }
						onChange={ ( v ) => setAttributes( { nextLabel: v } ) }
					/>
					<TextControl
						label={ __( 'Next URL', 'scootup' ) }
						value={ nextUrl }
						onChange={ ( v ) => setAttributes( { nextUrl: v } ) }
					/>
				</PanelBody>
			</InspectorControls>
			<ServerSideRender block="scootup/post-nav" attributes={ attributes } />
		</div>
	);
}
