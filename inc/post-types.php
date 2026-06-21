<?php
/**
 * Custom post types & taxonomies for the Scootup theme.
 *
 * Content model
 * -------------
 *  project       CPT  — portfolio items (single = work-project.html)
 *  service       tax  — hierarchical, on `project` (term archive = work-service.html,
 *                       term listing/grid = work.html)
 *  reel          CPT  — short-form video showcases (reels.html)
 *  testimonial   CPT  — client quotes (reels.html marquee)
 *
 * Content fields for project/reel/testimonial are edited as Gutenberg blocks
 * (seeded into post.content), not post meta or ACF. SEO meta is in meta-fields.php.
 */

defined('ABSPATH') || exit;

add_action('init', function () {

    /* ---------------------------------------------------------------------
     * Taxonomy: service (attached to project)
     * ------------------------------------------------------------------- */
    register_taxonomy('service', ['project'], [
        'labels' => [
            'name'          => __('Services', 'scootup'),
            'singular_name' => __('Service', 'scootup'),
            'menu_name'     => __('Services', 'scootup'),
            'add_new_item'  => __('Add New Service', 'scootup'),
            'edit_item'     => __('Edit Service', 'scootup'),
        ],
        'public'            => true,
        'hierarchical'      => true,
        'show_in_rest'      => true,
        'show_admin_column' => true,
        'rewrite'           => ['slug' => 'work', 'with_front' => false],
    ]);

    /* ---------------------------------------------------------------------
     * CPT: project
     * ------------------------------------------------------------------- */
    register_post_type('project', [
        'labels' => [
            'name'          => __('Projects', 'scootup'),
            'singular_name' => __('Project', 'scootup'),
            'menu_name'     => __('Work', 'scootup'),
            'add_new_item'  => __('Add New Project', 'scootup'),
            'edit_item'     => __('Edit Project', 'scootup'),
        ],
        'public'       => true,
        'has_archive'  => true,
        'menu_icon'    => 'dashicons-portfolio',
        'menu_position'=> 20,
        'supports'     => ['title', 'editor', 'excerpt', 'thumbnail', 'custom-fields', 'revisions'],
        'taxonomies'   => ['service'],
        'show_in_rest' => true,
        'rewrite'      => ['slug' => 'work/project', 'with_front' => false],
    ]);

    /* ---------------------------------------------------------------------
     * CPT: reel
     * ------------------------------------------------------------------- */
    register_post_type('reel', [
        'labels' => [
            'name'          => __('Reels', 'scootup'),
            'singular_name' => __('Reel', 'scootup'),
            'menu_name'     => __('Reels', 'scootup'),
            'add_new_item'  => __('Add New Reel', 'scootup'),
            'edit_item'     => __('Edit Reel', 'scootup'),
        ],
        'public'       => true,
        // NOTE: `has_archive`/slug must NOT be 'reels' — that collides with the
        // designed Reels *page* (slug `reels`), which renders the landing and
        // queries reel posts itself. Singles live at /reel/{name}/.
        'has_archive'  => false,
        'menu_icon'    => 'dashicons-video-alt3',
        'menu_position'=> 21,
        'supports'     => ['title', 'editor', 'thumbnail', 'custom-fields'],
        'show_in_rest' => true,
        'rewrite'      => ['slug' => 'reel', 'with_front' => false],
    ]);

    /* ---------------------------------------------------------------------
     * CPT: testimonial
     * ------------------------------------------------------------------- */
    register_post_type('testimonial', [
        'labels' => [
            'name'          => __('Testimonials', 'scootup'),
            'singular_name' => __('Testimonial', 'scootup'),
            'menu_name'     => __('Testimonials', 'scootup'),
            'add_new_item'  => __('Add New Testimonial', 'scootup'),
            'edit_item'     => __('Edit Testimonial', 'scootup'),
        ],
        'public'       => false,
        'show_ui'      => true,
        'has_archive'  => false,
        'menu_icon'    => 'dashicons-format-quote',
        'menu_position'=> 22,
        'supports'     => ['title', 'editor', 'thumbnail', 'custom-fields'],
        'show_in_rest' => true,
    ]);

    /* ---------------------------------------------------------------------
     * Project / reel / testimonial CONTENT fields are edited as Gutenberg
     * blocks (scootup/meta-bar, reel-card, testimonial-card) seeded into each
     * post's content — there is no per-field post meta. Aggregator templates
     * read the values back out of the block markup via scootup_first_block_attrs()
     * (see inc/block-data.php). SEO/AEO/GEO meta still lives in inc/meta-fields.php.
     * ------------------------------------------------------------------- */
});

/**
 * Term meta for the `service` taxonomy (icon + tagline used by the work grid).
 */
add_action('init', function () {
    foreach (['_service_icon', '_service_tagline'] as $key) {
        register_term_meta('service', $key, [
            'type'          => 'string',
            'single'        => true,
            'show_in_rest'  => true,
            'auth_callback' => fn() => current_user_can('manage_categories'),
        ]);
    }
});
