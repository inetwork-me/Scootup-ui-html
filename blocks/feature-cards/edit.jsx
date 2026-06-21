import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import ServerSideRender from '@wordpress/server-side-render';
import { PanelBody, TextControl, TextareaControl, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function Edit( { attributes, setAttributes } ) {
	const bp = useBlockProps();
	const { heading } = attributes;
	const items = attributes.items || [];

	const update = ( i, key, val ) => {
		const next = items.map( ( it, idx ) => ( idx === i ? { ...it, [ key ]: val } : it ) );
		setAttributes( { items: next } );
	};
	const add = () =>
		setAttributes( { items: [ ...items, { number: '', title: '', description: '' } ] } );
	const remove = ( i ) => setAttributes( { items: items.filter( ( _, idx ) => idx !== i ) } );

	return (
		<div { ...bp }>
			<InspectorControls>
				<PanelBody title={ __( 'Section', 'scootup' ) }>
					<TextControl
						label={ __( 'Heading', 'scootup' ) }
						value={ heading }
						onChange={ ( v ) => setAttributes( { heading: v } ) }
					/>
				</PanelBody>
				<PanelBody title={ __( 'Cards', 'scootup' ) }>
					{ items.map( ( it, i ) => (
						<div key={ i } style={ { borderBottom: '1px solid #ddd', marginBottom: 12, paddingBottom: 8 } }>
							<TextControl label={ __( 'Number', 'scootup' ) } value={ it.number } onChange={ ( v ) => update( i, 'number', v ) } />
							<TextControl label={ __( 'Title', 'scootup' ) } value={ it.title } onChange={ ( v ) => update( i, 'title', v ) } />
							<TextareaControl label={ __( 'Description', 'scootup' ) } value={ it.description } onChange={ ( v ) => update( i, 'description', v ) } />
							<Button isDestructive variant="link" onClick={ () => remove( i ) }>{ __( 'Remove', 'scootup' ) }</Button>
						</div>
					) ) }
					<Button variant="primary" onClick={ add }>{ __( 'Add card', 'scootup' ) }</Button>
				</PanelBody>
			</InspectorControls>

			<ServerSideRender block="scootup/feature-cards" attributes={ attributes } />
		</div>
	);
}
