<?php
defined('ABSPATH') || exit;
$context = Timber::context();
$context['posts'] = Timber::get_posts();

$templates = ['archive.twig', 'index.twig'];
if (is_post_type_archive()) {
    array_unshift($templates, 'archive-' . get_post_type() . '.twig');
} elseif (is_tax() || is_category() || is_tag()) {
    $term = get_queried_object();
    array_unshift($templates, 'archive-' . $term->taxonomy . '.twig');
    $context['term'] = Timber::get_term($term);
}
Timber::render($templates, $context);
