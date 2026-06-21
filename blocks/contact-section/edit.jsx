import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import ServerSideRender from '@wordpress/server-side-render';
import { PanelBody, TextControl, TextareaControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function Edit( { attributes, setAttributes } ) {
	const bp = useBlockProps();
	const {
		heading,
		intro,
		email,
		phone,
		location,
		instagram,
		linkedin,
		github,
		dribbble,
	} = attributes;

	return (
		<div { ...bp }>
			<InspectorControls>
				<PanelBody title={ __( 'Contact Section', 'scootup' ) }>
					<TextControl
						label={ __( 'Heading', 'scootup' ) }
						value={ heading }
						onChange={ ( v ) => setAttributes( { heading: v } ) }
					/>
					<TextareaControl
						label={ __( 'Intro', 'scootup' ) }
						value={ intro }
						onChange={ ( v ) => setAttributes( { intro: v } ) }
					/>
					<TextControl
						label={ __( 'Email', 'scootup' ) }
						value={ email }
						onChange={ ( v ) => setAttributes( { email: v } ) }
					/>
					<TextControl
						label={ __( 'Phone', 'scootup' ) }
						value={ phone }
						onChange={ ( v ) => setAttributes( { phone: v } ) }
					/>
					<TextControl
						label={ __( 'Location', 'scootup' ) }
						value={ location }
						onChange={ ( v ) => setAttributes( { location: v } ) }
					/>
				</PanelBody>
				<PanelBody title={ __( 'Social Links', 'scootup' ) } initialOpen={ false }>
					<TextControl
						label={ __( 'Instagram URL', 'scootup' ) }
						value={ instagram }
						onChange={ ( v ) => setAttributes( { instagram: v } ) }
					/>
					<TextControl
						label={ __( 'LinkedIn URL', 'scootup' ) }
						value={ linkedin }
						onChange={ ( v ) => setAttributes( { linkedin: v } ) }
					/>
					<TextControl
						label={ __( 'GitHub URL', 'scootup' ) }
						value={ github }
						onChange={ ( v ) => setAttributes( { github: v } ) }
					/>
					<TextControl
						label={ __( 'Dribbble URL', 'scootup' ) }
						value={ dribbble }
						onChange={ ( v ) => setAttributes( { dribbble: v } ) }
					/>
				</PanelBody>
			</InspectorControls>
			<ServerSideRender block="scootup/contact-section" attributes={ attributes } />
		</div>
	);
}
