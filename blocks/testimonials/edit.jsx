import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import { __ } from '@wordpress/i18n';

export default function Edit( { attributes, setAttributes } ) {
	const bp = useBlockProps();
	const { count } = attributes;

	return (
		<div { ...bp }>
			<InspectorControls>
				<PanelBody title={ __( 'Testimonials', 'scootup' ) }>
					<RangeControl
						label={ __( 'Number of testimonials', 'scootup' ) }
						value={ count }
						min={ 2 }
						max={ 40 }
						onChange={ ( v ) => setAttributes( { count: v } ) }
					/>
				</PanelBody>
			</InspectorControls>

			<ServerSideRender block="scootup/testimonials" attributes={ attributes } />
		</div>
	);
}
