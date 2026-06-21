<?php
defined('ABSPATH') || exit;
$context = Timber::context();

$context['count'] = $attributes['count'] ?? 10;

// Each testimonial post is edited as a single scootup/testimonial-card block;
// read its fields out of the block markup (no post meta / ACF). Twig falls back
// to the static mockup set when this list is empty.
$testimonials = [];
foreach (get_posts(['post_type' => 'testimonial', 'numberposts' => $attributes['count'] ?? 10]) as $t) {
    $a = scootup_first_block_attrs($t->ID, 'scootup/testimonial-card');
    if (empty($a['quote']) && empty($a['author'])) {
        continue;
    }
    $testimonials[] = [
        'quote'    => $a['quote']    ?? '',
        'author'   => $a['author']   ?? $t->post_title,
        'role'     => $a['role']     ?? '',
        'platform' => $a['platform'] ?? 'instagram',
        'rating'   => $a['rating']   ?? 5,
    ];
}
$context['testimonials'] = $testimonials;

Timber::render('blocks/testimonials/testimonials.twig', $context);
