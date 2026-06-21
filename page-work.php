<?php
/**
 * Template Name: Work Landing
 *
 * The /work landing page: hero + intro + a grid of `service` taxonomy terms,
 * followed by the parallax CTA band. Each term carries its icon/tagline meta
 * and the count of projects assigned to it.
 *
 * Wired by page.php via the page-{slug}.twig lookup, but assigned explicitly
 * here so the services list is built regardless of the page slug.
 */

defined('ABSPATH') || exit;

$context         = Timber::context();
$context['post'] = Timber::get_post();

$context['services'] = Timber::get_terms([
    'taxonomy'   => 'service',
    'hide_empty' => false,
]);

Timber::render(['page-work.twig', 'page.twig'], $context);
