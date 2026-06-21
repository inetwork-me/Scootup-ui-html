import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, Button } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import { __ } from '@wordpress/i18n';

export default function Edit( { attributes, setAttributes } ) {
	const bp = useBlockProps( { className: 'meta-bar' } );
	const items = attributes.items || [];

	const update = ( index, key, value ) => {
		const next = items.map( ( it, i ) => ( i === index ? { ...it, [ key ]: value } : it ) );
		setAttributes( { items: next } );
	};
	const add = () => setAttributes( { items: [ ...items, { label: '', value: '' } ] } );
	const remove = ( index ) => setAttributes( { items: items.filter( ( _, i ) => i !== index ) } );

	return (
		<div { ...bp }>
			<InspectorControls>
				<PanelBody title={ __( 'Meta items', 'scootup' ) }>
					{ items.map( ( it, i ) => (
						<div key={ i } style={ { borderBottom: '1px solid #ddd', marginBottom: '8px', paddingBottom: '8px' } }>
							<TextControl
								label={ __( 'Label', 'scootup' ) }
								value={ it.label || '' }
								onChange={ ( v ) => update( i, 'label', v ) }
							/>
							<TextControl
								label={ __( 'Value', 'scootup' ) }
								value={ it.value || '' }
								onChange={ ( v ) => update( i, 'value', v ) }
							/>
							<Button isDestructive variant="link" onClick={ () => remove( i ) }>
								{ __( 'Remove', 'scootup' ) }
							</Button>
						</div>
					) ) }
					<Button variant="secondary" onClick={ add }>
						{ __( 'Add item', 'scootup' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<ServerSideRender block="scootup/meta-bar" attributes={ attributes } />
		</div>
	);
}
