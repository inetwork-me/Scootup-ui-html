<?php
/**
 * ACF integration.
 *
 * Project / reel / testimonial content fields are NO LONGER managed in ACF —
 * they are edited as Gutenberg blocks (scootup/project-hero, meta-bar,
 * image-grid, post-nav, reel-card, testimonial-card) seeded into each post's
 * content, the same block-driven editing experience as the site's Pages.
 *
 * The old acf_add_local_field_group() panels were intentionally removed so there
 * is a single place to edit each record (the block editor) and no double-edit
 * confusion. SEO/AEO/GEO meta stays on native register_post_meta (inc/meta-fields.php).
 *
 * The get_field() Twig shim below is kept (harmless) so any template can call
 * get_field() safely even with ACF deactivated — it simply returns null then.
 */

defined('ABSPATH') || exit;

add_filter('timber/twig', function ($twig) {
    $twig->addFunction(new \Twig\TwigFunction('get_field', function ($selector, $post_id = false) {
        return function_exists('get_field') ? get_field($selector, $post_id) : null;
    }));
    return $twig;
});
