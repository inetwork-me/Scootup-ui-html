<?php
defined('ABSPATH') || exit;
$context = Timber::context();
$context['post'] = Timber::get_post();

// The single hero image is the LCP element — preload it (Rule 5).
if ($context['post'] && ($thumb = get_the_post_thumbnail_url($context['post']->ID, 'large'))) {
    $context['lcp_image_url'] = $thumb;
}

Timber::render(['single-' . $context['post']->post_type . '.twig', 'single.twig'], $context);
