<?php
/**
 * Template Name: Social Reels
 *
 * The /reels landing page: vertical reel hero slider, accent marquee, platform
 * deliverables card stack, sticky 48h process timeline, dual testimonial
 * marquees, and the parallax CTA band.
 *
 * The hero slider loops `reel` posts and the testimonial rows loop
 * `testimonial` posts — each with the static mockup content as fallback.
 */

defined('ABSPATH') || exit;

$context                 = Timber::context();
$context['post']         = Timber::get_post();
$context['reels']        = Timber::get_posts(['post_type' => 'reel', 'posts_per_page' => 8]);
$context['testimonials'] = Timber::get_posts(['post_type' => 'testimonial', 'posts_per_page' => 10]);

Timber::render(['page-reels.twig', 'page.twig'], $context);
