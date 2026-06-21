import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl, Button } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import { __ } from '@wordpress/i18n';

export default function Edit( { attributes, setAttributes } ) {
	const bp = useBlockProps();
	const stats = attributes.stats || [];

	const update = ( i, key, val ) => {
		const next = stats.map( ( s, idx ) => ( idx === i ? { ...s, [ key ]: val } : s ) );
		setAttributes( { stats: next } );
	};
	const add = () =>
		setAttributes( { stats: [ ...stats, { value: '0', suffix: '+', label: '', isRating: false } ] } );
	const remove = ( i ) => setAttributes( { stats: stats.filter( ( _, idx ) => idx !== i ) } );

	return (
		<div { ...bp }>
			<InspectorControls>
				<PanelBody title={ __( 'Statistics', 'scootup' ) }>
					{ stats.map( ( s, i ) => (
						<div key={ i } style={ { borderBottom: '1px solid #ddd', marginBottom: 12, paddingBottom: 8 } }>
							<TextControl label={ __( 'Value', 'scootup' ) } value={ s.value } onChange={ ( v ) => update( i, 'value', v ) } />
							<TextControl label={ __( 'Suffix', 'scootup' ) } value={ s.suffix } onChange={ ( v ) => update( i, 'suffix', v ) } />
							<TextControl label={ __( 'Label', 'scootup' ) } value={ s.label } onChange={ ( v ) => update( i, 'label', v ) } />
							<ToggleControl label={ __( 'Show star (rating)', 'scootup' ) } checked={ !! s.isRating } onChange={ ( v ) => update( i, 'isRating', v ) } />
							<Button isDestructive variant="link" onClick={ () => remove( i ) }>{ __( 'Remove', 'scootup' ) }</Button>
						</div>
					) ) }
					<Button variant="primary" onClick={ add }>{ __( 'Add stat', 'scootup' ) }</Button>
				</PanelBody>
			</InspectorControls>

			<ServerSideRender block="scootup/stat-strip" attributes={ attributes } />
		</div>
	);
}
