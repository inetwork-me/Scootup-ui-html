import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl, SelectControl, ToggleControl, Button } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import { __ } from '@wordpress/i18n';

const ICON_OPTIONS = [
	{ label: 'Users', value: 'users' },
	{ label: 'Pencil', value: 'pencil' },
	{ label: 'Play', value: 'play' },
	{ label: 'Chart', value: 'chart' },
	{ label: 'Phone', value: 'phone' },
	{ label: 'Check (default)', value: '' },
];

export default function Edit( { attributes, setAttributes } ) {
	const bp = useBlockProps();
	const { steps } = attributes;
	const list = steps || [];

	const update = ( i, key, value ) => {
		const next = list.map( ( s, idx ) =>
			idx === i ? { ...s, [ key ]: value } : s
		);
		setAttributes( { steps: next } );
	};

	const addStep = () =>
		setAttributes( {
			steps: [ ...list, { number: '', icon: '', title: '', description: '' } ],
		} );

	const removeStep = ( i ) =>
		setAttributes( { steps: list.filter( ( _, idx ) => idx !== i ) } );

	return (
		<div { ...bp }>
			<InspectorControls>
				<PanelBody title={ __( 'Process Steps', 'scootup' ) }>
					{ list.map( ( s, i ) => (
						<div
							key={ i }
							style={ {
								borderBottom: '1px solid #e0e0e0',
								paddingBottom: '0.75rem',
								marginBottom: '0.75rem',
							} }
						>
							<TextControl
								label={ __( 'Number', 'scootup' ) }
								value={ s.number }
								onChange={ ( v ) => update( i, 'number', v ) }
							/>
							<SelectControl
								label={ __( 'Icon', 'scootup' ) }
								value={ s.icon || '' }
								options={ ICON_OPTIONS }
								onChange={ ( v ) => update( i, 'icon', v ) }
							/>
							<TextControl
								label={ __( 'Title', 'scootup' ) }
								value={ s.title }
								onChange={ ( v ) => update( i, 'title', v ) }
							/>
							<TextareaControl
								label={ __( 'Description', 'scootup' ) }
								value={ s.description }
								onChange={ ( v ) => update( i, 'description', v ) }
							/>
							<ToggleControl
								label={ __( 'CTA end-card', 'scootup' ) }
								checked={ !! s.cta }
								onChange={ ( v ) => update( i, 'cta', v ) }
							/>
							{ s.cta && (
								<>
									<TextControl
										label={ __( 'CTA label', 'scootup' ) }
										value={ s.ctaLabel || '' }
										onChange={ ( v ) => update( i, 'ctaLabel', v ) }
									/>
									<TextControl
										label={ __( 'CTA URL', 'scootup' ) }
										value={ s.ctaUrl || '' }
										onChange={ ( v ) => update( i, 'ctaUrl', v ) }
									/>
								</>
							) }
							<Button
								isDestructive
								variant="link"
								onClick={ () => removeStep( i ) }
							>
								{ __( 'Remove step', 'scootup' ) }
							</Button>
						</div>
					) ) }
					<Button variant="secondary" onClick={ addStep }>
						{ __( 'Add step', 'scootup' ) }
					</Button>
				</PanelBody>
			</InspectorControls>

			<ServerSideRender block="scootup/process-timeline" attributes={ attributes } />
		</div>
	);
}
