import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl, Button } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import { __ } from '@wordpress/i18n';

export default function Edit( { attributes, setAttributes } ) {
	const bp = useBlockProps();
	const { eyebrow, heading, body, ctaLabel, ctaUrl } = attributes;
	const platforms = attributes.platforms || [];

	const update = ( idx, key, value ) => {
		const next = platforms.map( ( p, i ) => ( i === idx ? { ...p, [ key ]: value } : p ) );
		setAttributes( { platforms: next } );
	};
	const remove = ( idx ) => setAttributes( { platforms: platforms.filter( ( _, i ) => i !== idx ) } );
	const add = () => setAttributes( { platforms: [ ...platforms, { name: '', icon: '' } ] } );

	return (
		<div { ...bp }>
			<InspectorControls>
				<PanelBody title={ __( 'Deliverables', 'scootup' ) }>
					<TextControl
						label={ __( 'Eyebrow', 'scootup' ) }
						value={ eyebrow }
						onChange={ ( v ) => setAttributes( { eyebrow: v } ) }
					/>
					<TextControl
						label={ __( 'Heading', 'scootup' ) }
						value={ heading }
						onChange={ ( v ) => setAttributes( { heading: v } ) }
					/>
					<TextareaControl
						label={ __( 'Body', 'scootup' ) }
						value={ body }
						onChange={ ( v ) => setAttributes( { body: v } ) }
					/>
					<TextControl
						label={ __( 'CTA label', 'scootup' ) }
						value={ ctaLabel }
						onChange={ ( v ) => setAttributes( { ctaLabel: v } ) }
					/>
					<TextControl
						label={ __( 'CTA URL', 'scootup' ) }
						value={ ctaUrl }
						onChange={ ( v ) => setAttributes( { ctaUrl: v } ) }
					/>
				</PanelBody>
				<PanelBody title={ __( 'Platforms', 'scootup' ) } initialOpen={ false }>
					{ platforms.map( ( p, i ) => (
						<div key={ i } style={ { marginBottom: '1rem' } }>
							<TextControl label={ __( 'Name', 'scootup' ) } value={ p.name } onChange={ ( v ) => update( i, 'name', v ) } />
							<TextControl label={ __( 'Icon key', 'scootup' ) } value={ p.icon } onChange={ ( v ) => update( i, 'icon', v ) } />
							<Button isDestructive variant="link" onClick={ () => remove( i ) }>{ __( 'Remove', 'scootup' ) }</Button>
						</div>
					) ) }
					<Button variant="secondary" onClick={ add }>{ __( 'Add platform', 'scootup' ) }</Button>
				</PanelBody>
			</InspectorControls>

			<ServerSideRender block="scootup/platform-stack" attributes={ attributes } />
		</div>
	);
}
