<?php
/**
 * Template Name: About
 *
 * Ports the about.html mockup: hero (tag + H1 + dual CTA + image),
 * orange marquee, 6-card services grid, 3 numbered value/feature cards,
 * and the mid-page parallax CTA band.
 */

defined('ABSPATH') || exit;

$context         = Timber::context();
$context['post'] = Timber::get_post();

Timber::render(['page-about.twig', 'page.twig'], $context);
