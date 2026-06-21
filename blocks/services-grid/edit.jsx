import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, RangeControl } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import { __ } from '@wordpress/i18n';

export default function Edit( { attributes, setAttributes } ) {
	const bp = useBlockProps();
	const { heading, intro, count } = attributes;

	return (
		<div { ...bp }>
			<InspectorControls>
				<PanelBody title={ __( 'Services Grid', 'scootup' ) }>
					<TextControl
						label={ __( 'Heading', 'scootup' ) }
						value={ heading }
						onChange={ ( v ) => setAttributes( { heading: v } ) }
					/>
					<TextControl
						label={ __( 'Intro', 'scootup' ) }
						value={ intro }
						onChange={ ( v ) => setAttributes( { intro: v } ) }
					/>
					<RangeControl
						label={ __( 'Number of services', 'scootup' ) }
						value={ count }
						min={ 1 }
						max={ 24 }
						onChange={ ( v ) => setAttributes( { count: v } ) }
					/>
				</PanelBody>
			</InspectorControls>

			<ServerSideRender block="scootup/services-grid" attributes={ attributes } />
		</div>
	);
}
