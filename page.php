<?php
defined('ABSPATH') || exit;
$context = Timber::context();
$context['post'] = Timber::get_post();
Timber::render(['page-' . $context['post']->slug . '.twig', 'page.twig'], $context);
