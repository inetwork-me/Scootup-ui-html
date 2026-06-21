<?php
defined('ABSPATH') || exit;

$context             = Timber::context();
$context['post']     = Timber::get_post();
$context['projects'] = Timber::get_posts([
    'post_type'      => 'project',
    'posts_per_page' => 6,
]);

Timber::render('front-page.twig', $context);
