import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl, Button } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import { __ } from '@wordpress/i18n';

export default function Edit( { attributes, setAttributes } ) {
	const bp = useBlockProps();
	const { eyebrow, heading } = attributes;
	const services = attributes.services || [];

	const update = ( i, key, val ) => {
		const next = services.map( ( s, idx ) => ( idx === i ? { ...s, [ key ]: val } : s ) );
		setAttributes( { services: next } );
	};
	const add = () => setAttributes( { services: [ ...services, { title: '', description: '', imageUrl: '' } ] } );
	const remove = ( i ) => setAttributes( { services: services.filter( ( _, idx ) => idx !== i ) } );

	return (
		<div { ...bp }>
			<InspectorControls>
				<PanelBody title={ __( 'Heading', 'scootup' ) }>
					<TextControl label={ __( 'Eyebrow', 'scootup' ) } value={ eyebrow } onChange={ ( v ) => setAttributes( { eyebrow: v } ) } />
					<TextControl label={ __( 'Heading', 'scootup' ) } value={ heading } onChange={ ( v ) => setAttributes( { heading: v } ) } />
				</PanelBody>
				<PanelBody title={ __( 'Services', 'scootup' ) }>
					{ services.map( ( s, i ) => (
						<div key={ i } style={ { borderBottom: '1px solid #ddd', marginBottom: 12, paddingBottom: 8 } }>
							<TextControl label={ __( 'Title', 'scootup' ) } value={ s.title } onChange={ ( v ) => update( i, 'title', v ) } />
							<TextareaControl label={ __( 'Description', 'scootup' ) } value={ s.description } onChange={ ( v ) => update( i, 'description', v ) } />
							<MediaUploadCheck>
								<MediaUpload
									onSelect={ ( m ) => update( i, 'imageUrl', m.url ) }
									allowedTypes={ [ 'image' ] }
									render={ ( { open } ) => (
										<Button variant="secondary" onClick={ open }>
											{ s.imageUrl ? __( 'Change image', 'scootup' ) : __( 'Select image', 'scootup' ) }
										</Button>
									) }
								/>
							</MediaUploadCheck>
							<Button isDestructive variant="link" onClick={ () => remove( i ) }>{ __( 'Remove', 'scootup' ) }</Button>
						</div>
					) ) }
					<Button variant="primary" onClick={ add }>{ __( 'Add service', 'scootup' ) }</Button>
				</PanelBody>
				<PanelBody title={ __( 'CTA', 'scootup' ) } initialOpen={ false }>
					<TextControl label={ __( 'CTA URL', 'scootup' ) } value={ attributes.ctaUrl } onChange={ ( v ) => setAttributes( { ctaUrl: v } ) } />
				</PanelBody>
			</InspectorControls>

			<ServerSideRender block="scootup/services-accordion" attributes={ attributes } />
		</div>
	);
}
