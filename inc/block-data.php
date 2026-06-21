<?php
/**
 * Block-sourced data helpers.
 *
 * Projects, reels and testimonials are edited as Gutenberg blocks (their fields
 * live in the post's block markup, not in post meta / ACF). Aggregator templates
 * — the reels slider, the testimonials marquee, the service archive cards — need
 * to read those field values out of the block markup. These helpers parse a
 * post's content once and return a matching block's attributes.
 */

defined('ABSPATH') || exit;

/**
 * Return the attributes of the first block of $block_name in $post_id's content.
 *
 * @param int|\WP_Post|\Timber\Post $post_id    Post (or id) to scan.
 * @param string                    $block_name e.g. 'scootup/reel-card'.
 * @return array Attribute map (empty when the block isn't present).
 */
function scootup_first_block_attrs($post_id, string $block_name): array {
    $id = is_object($post_id) ? ($post_id->ID ?? 0) : (int) $post_id;
    if (!$id) {
        return [];
    }
    $post = get_post($id);
    if (!$post) {
        return [];
    }
    foreach (parse_blocks($post->post_content) as $block) {
        if (($block['blockName'] ?? '') === $block_name) {
            return $block['attrs'] ?? [];
        }
    }
    return [];
}

/**
 * Pull a single value out of a project's meta-bar block by its label
 * (e.g. "Service", "Year"). Used by the service archive cards.
 */
function scootup_meta_bar_value($post_id, string $label): string {
    $attrs = scootup_first_block_attrs($post_id, 'scootup/meta-bar');
    foreach (($attrs['items'] ?? []) as $item) {
        if (($item['label'] ?? '') === $label) {
            return (string) ($item['value'] ?? '');
        }
    }
    return '';
}

/* Expose both helpers to Twig. */
add_filter('timber/twig', function ($twig) {
    $twig->addFunction(new \Twig\TwigFunction('block_attrs', 'scootup_first_block_attrs'));
    $twig->addFunction(new \Twig\TwigFunction('meta_bar_value', 'scootup_meta_bar_value'));
    return $twig;
});
