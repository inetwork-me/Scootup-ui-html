<?php
defined('ABSPATH') || exit;

add_action('init', function () {
    $fields = [
        // SEO
        '_meta_title'          => 'string',
        '_meta_description'    => 'string',
        '_og_image'            => 'string',
        '_canonical_url'       => 'string',
        '_robots_directive'    => 'string',
        // AEO
        '_faq_items'           => 'string',
        '_speakable_selectors' => 'string',
        '_content_format'      => 'string',
        // GEO
        '_author_name'         => 'string',
        '_author_credentials'  => 'string',
        '_content_updated'     => 'string',
        '_entity_mentions'     => 'string',
    ];
    foreach ($fields as $key => $type) {
        register_post_meta('', $key, [
            'type'          => $type,
            'single'        => true,
            'show_in_rest'  => true,
            'auth_callback' => fn() => current_user_can('edit_posts'),
        ]);
    }
});
