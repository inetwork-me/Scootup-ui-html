<?php
defined('ABSPATH') || exit;

// Remove media attachment pages from sitemap
add_filter('wp_sitemaps_post_types', function ($types) {
    unset($types['attachment']);
    return $types;
});

// Add featured image data to sitemap entries
add_filter('wp_sitemaps_posts_entry', function ($entry, $post) {
    $thumb = get_the_post_thumbnail_url($post->ID, 'full');
    if ($thumb) {
        $entry['images'] = [['loc' => $thumb]];
    }
    return $entry;
}, 10, 2);
