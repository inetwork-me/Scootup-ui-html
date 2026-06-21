import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextareaControl, ToggleControl, TextControl } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import { __ } from '@wordpress/i18n';

export default function Edit( { attributes, setAttributes } ) {
	const bp = useBlockProps();
	const { items, reverse, dur, label, bordered, sectionId } = attributes;

	return (
		<div { ...bp }>
			<InspectorControls>
				<PanelBody title={ __( 'Marquee', 'scootup' ) }>
					<TextControl
						label={ __( 'Eyebrow label (optional)', 'scootup' ) }
						value={ label }
						onChange={ ( v ) => setAttributes( { label: v } ) }
					/>
					<TextareaControl
						label={ __( 'Items (one per line)', 'scootup' ) }
						value={ ( items || [] ).join( '\n' ) }
						onChange={ ( v ) =>
							setAttributes( {
								items: v
									.split( '\n' )
									.map( ( w ) => w.trim() )
									.filter( Boolean ),
							} )
						}
					/>
					<ToggleControl
						label={ __( 'Reverse direction', 'scootup' ) }
						checked={ !! reverse }
						onChange={ ( v ) => setAttributes( { reverse: v } ) }
					/>
					<ToggleControl
						label={ __( 'Top & bottom border', 'scootup' ) }
						checked={ !! bordered }
						onChange={ ( v ) => setAttributes( { bordered: v } ) }
					/>
					<TextControl
						label={ __( 'Duration (e.g. 38s)', 'scootup' ) }
						value={ dur }
						onChange={ ( v ) => setAttributes( { dur: v } ) }
					/>
					<TextControl
						label={ __( 'Section ID (optional)', 'scootup' ) }
						value={ sectionId }
						onChange={ ( v ) => setAttributes( { sectionId: v } ) }
					/>
				</PanelBody>
			</InspectorControls>

			<ServerSideRender block="scootup/marquee" attributes={ attributes } />
		</div>
	);
}
