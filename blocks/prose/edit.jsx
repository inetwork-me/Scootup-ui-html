import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

const ALLOWED = [
	'core/paragraph',
	'core/heading',
	'core/separator',
	'core/list',
	'core/quote',
	'core/image',
	'core/buttons',
	'core/group',
];

const TEMPLATE = [ [ 'core/paragraph', { className: 'body-text' } ] ];

export default function Edit() {
	// .content-section mirrors the front-end wrapper added by render.php so the
	// reading width matches the live page. The wrapper itself is NOT saved —
	// save() emits only InnerBlocks.Content and render.php re-wraps via Twig.
	const bp = useBlockProps( { className: 'content-section' } );

	return (
		<div { ...bp }>
			<InnerBlocks allowedBlocks={ ALLOWED } template={ TEMPLATE } />
		</div>
	);
}
