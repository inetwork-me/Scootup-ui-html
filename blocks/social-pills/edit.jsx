import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, Button } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import { __ } from '@wordpress/i18n';

export default function Edit( { attributes, setAttributes } ) {
	const bp = useBlockProps( { className: 'social-row' } );
	const links = attributes.links || [];

	const update = ( index, key, value ) => {
		const next = links.map( ( l, i ) =>
			i === index ? { ...l, [ key ]: value } : l
		);
		setAttributes( { links: next } );
	};
	const add = () =>
		setAttributes( { links: [ ...links, { network: '', url: '' } ] } );
	const remove = ( index ) =>
		setAttributes( { links: links.filter( ( l, i ) => i !== index ) } );

	return (
		<div { ...bp }>
			<InspectorControls>
				<PanelBody title={ __( 'Social Pills', 'scootup' ) }>
					{ links.map( ( l, i ) => (
						<div key={ i } style={ { marginBottom: '1rem' } }>
							<TextControl
								label={ __( 'Network (instagram | linkedin | github | dribbble)', 'scootup' ) }
								value={ l.network || '' }
								onChange={ ( v ) => update( i, 'network', v ) }
							/>
							<TextControl
								label={ __( 'URL', 'scootup' ) }
								value={ l.url || '' }
								onChange={ ( v ) => update( i, 'url', v ) }
							/>
							<Button isDestructive variant="secondary" onClick={ () => remove( i ) }>
								{ __( 'Remove', 'scootup' ) }
							</Button>
						</div>
					) ) }
					<Button variant="primary" onClick={ add }>
						{ __( 'Add link', 'scootup' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<ServerSideRender block="scootup/social-pills" attributes={ attributes } />
		</div>
	);
}
