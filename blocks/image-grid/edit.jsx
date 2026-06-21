import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, TextControl, Button } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import { __ } from '@wordpress/i18n';

export default function Edit( { attributes, setAttributes } ) {
	const bp = useBlockProps();
	const { label } = attributes;
	const images = attributes.images || [];

	const update = ( i, key, val ) => {
		const next = images.map( ( img, idx ) => ( idx === i ? { ...img, [ key ]: val } : img ) );
		setAttributes( { images: next } );
	};
	const add = () => setAttributes( { images: [ ...images, { url: '', alt: '' } ] } );
	const remove = ( i ) => setAttributes( { images: images.filter( ( _, idx ) => idx !== i ) } );
	const move = ( i, dir ) => {
		const j = i + dir;
		if ( j < 0 || j >= images.length ) {
			return;
		}
		const next = images.slice();
		[ next[ i ], next[ j ] ] = [ next[ j ], next[ i ] ];
		setAttributes( { images: next } );
	};

	return (
		<div { ...bp }>
			<InspectorControls>
				<PanelBody title={ __( 'Section', 'scootup' ) }>
					<TextControl
						label={ __( 'Section label', 'scootup' ) }
						value={ label }
						onChange={ ( v ) => setAttributes( { label: v } ) }
					/>
				</PanelBody>
				<PanelBody title={ __( 'Images', 'scootup' ) }>
					{ images.map( ( img, i ) => (
						<div key={ i } style={ { borderBottom: '1px solid #ddd', marginBottom: 12, paddingBottom: 8 } }>
							<MediaUploadCheck>
								<MediaUpload
									onSelect={ ( m ) => update( i, 'url', m.url ) }
									allowedTypes={ [ 'image' ] }
									render={ ( { open } ) => (
										<Button variant="secondary" onClick={ open }>
											{ img.url ? __( 'Change image', 'scootup' ) : __( 'Select image', 'scootup' ) }
										</Button>
									) }
								/>
							</MediaUploadCheck>
							<TextControl label={ __( 'Image alt', 'scootup' ) } value={ img.alt } onChange={ ( v ) => update( i, 'alt', v ) } />
							<div style={ { display: 'flex', gap: 8, alignItems: 'center' } }>
								<Button variant="secondary" onClick={ () => move( i, -1 ) } disabled={ i === 0 }>{ __( 'Up', 'scootup' ) }</Button>
								<Button variant="secondary" onClick={ () => move( i, 1 ) } disabled={ i === images.length - 1 }>{ __( 'Down', 'scootup' ) }</Button>
								<Button isDestructive variant="link" onClick={ () => remove( i ) }>{ __( 'Remove', 'scootup' ) }</Button>
							</div>
						</div>
					) ) }
					<Button variant="primary" onClick={ add }>{ __( 'Add image', 'scootup' ) }</Button>
				</PanelBody>
			</InspectorControls>

			<ServerSideRender block="scootup/image-grid" attributes={ attributes } />
		</div>
	);
}
