import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import ServerSideRender from '@wordpress/server-side-render';
import { PanelBody, TextControl, TextareaControl, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function Edit( { attributes, setAttributes } ) {
	const bp = useBlockProps();
	const { eyebrow, heading, body, imageUrl, imageAlt } = attributes;
	const steps = attributes.steps || [];

	const update = ( i, key, val ) => {
		const next = steps.map( ( s, idx ) => ( idx === i ? { ...s, [ key ]: val } : s ) );
		setAttributes( { steps: next } );
	};
	const add = () => setAttributes( { steps: [ ...steps, { number: '', title: '', description: '' } ] } );
	const remove = ( i ) => setAttributes( { steps: steps.filter( ( _, idx ) => idx !== i ) } );

	return (
		<div { ...bp }>
			<InspectorControls>
				<PanelBody title={ __( 'About', 'scootup' ) }>
					<TextControl label={ __( 'Eyebrow', 'scootup' ) } value={ eyebrow } onChange={ ( v ) => setAttributes( { eyebrow: v } ) } />
					<TextControl label={ __( 'Heading', 'scootup' ) } value={ heading } onChange={ ( v ) => setAttributes( { heading: v } ) } />
					<TextareaControl label={ __( 'Body', 'scootup' ) } value={ body } onChange={ ( v ) => setAttributes( { body: v } ) } />
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ ( m ) => setAttributes( { imageUrl: m.url } ) }
							allowedTypes={ [ 'image' ] }
							render={ ( { open } ) => (
								<Button variant="secondary" onClick={ open }>
									{ imageUrl ? __( 'Change image', 'scootup' ) : __( 'Select image', 'scootup' ) }
								</Button>
							) }
						/>
					</MediaUploadCheck>
					<TextControl label={ __( 'Image alt', 'scootup' ) } value={ imageAlt } onChange={ ( v ) => setAttributes( { imageAlt: v } ) } />
				</PanelBody>
				<PanelBody title={ __( 'Process steps', 'scootup' ) } initialOpen={ false }>
					{ steps.map( ( s, i ) => (
						<div key={ i } style={ { borderBottom: '1px solid #ddd', marginBottom: 12, paddingBottom: 8 } }>
							<TextControl label={ __( 'Number', 'scootup' ) } value={ s.number } onChange={ ( v ) => update( i, 'number', v ) } />
							<TextControl label={ __( 'Title', 'scootup' ) } value={ s.title } onChange={ ( v ) => update( i, 'title', v ) } />
							<TextareaControl label={ __( 'Description', 'scootup' ) } value={ s.description } onChange={ ( v ) => update( i, 'description', v ) } />
							<Button isDestructive variant="link" onClick={ () => remove( i ) }>{ __( 'Remove', 'scootup' ) }</Button>
						</div>
					) ) }
					<Button variant="primary" onClick={ add }>{ __( 'Add step', 'scootup' ) }</Button>
				</PanelBody>
			</InspectorControls>

			<ServerSideRender block="scootup/about-split" attributes={ attributes } />
		</div>
	);
}
