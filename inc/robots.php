<?php
defined('ABSPATH') || exit;

add_filter('robots_txt', function ($output, $public) {
    if (!$public) {
        return "User-agent: *\nDisallow: /\n";
    }
    $output .= "\nSitemap: " . home_url('/wp-sitemap.xml') . "\n";
    return $output;
}, 10, 2);
