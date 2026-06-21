import { InnerBlocks } from '@wordpress/block-editor';

// Dynamic block: only the inner blocks are persisted to post_content. render.php
// receives them as $content and wraps them in .content-section via Twig.
export default function save() {
	return <InnerBlocks.Content />;
}
