import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, TextControl, Button } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import { __ } from '@wordpress/i18n';

export default function Edit( { attributes, setAttributes } ) {
	const bp = useBlockProps();
	const { eyebrow, heading } = attributes;
	const slides = attributes.slides || [];

	const update = ( i, key, val ) => {
		const next = slides.map( ( s, idx ) => ( idx === i ? { ...s, [ key ]: val } : s ) );
		setAttributes( { slides: next } );
	};
	const add = () => setAttributes( { slides: [ ...slides, { imageUrl: '', imageAlt: '', title: '', url: '#' } ] } );
	const remove = ( i ) => setAttributes( { slides: slides.filter( ( _, idx ) => idx !== i ) } );

	return (
		<div { ...bp }>
			<InspectorControls>
				<PanelBody title={ __( 'Heading', 'scootup' ) }>
					<TextControl label={ __( 'Eyebrow', 'scootup' ) } value={ eyebrow } onChange={ ( v ) => setAttributes( { eyebrow: v } ) } />
					<TextControl label={ __( 'Heading', 'scootup' ) } value={ heading } onChange={ ( v ) => setAttributes( { heading: v } ) } />
				</PanelBody>
				<PanelBody title={ __( 'Slides', 'scootup' ) }>
					{ slides.map( ( s, i ) => (
						<div key={ i } style={ { borderBottom: '1px solid #ddd', marginBottom: 12, paddingBottom: 8 } }>
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
							<TextControl label={ __( 'Image alt', 'scootup' ) } value={ s.imageAlt } onChange={ ( v ) => update( i, 'imageAlt', v ) } />
							<TextControl label={ __( 'Title', 'scootup' ) } value={ s.title } onChange={ ( v ) => update( i, 'title', v ) } />
							<TextControl label={ __( 'URL', 'scootup' ) } value={ s.url } onChange={ ( v ) => update( i, 'url', v ) } />
							<Button isDestructive variant="link" onClick={ () => remove( i ) }>{ __( 'Remove', 'scootup' ) }</Button>
						</div>
					) ) }
					<Button variant="primary" onClick={ add }>{ __( 'Add slide', 'scootup' ) }</Button>
				</PanelBody>
			</InspectorControls>

			<ServerSideRender block="scootup/showcase-carousel" attributes={ attributes } />
		</div>
	);
}
