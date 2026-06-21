<?php
defined('ABSPATH') || exit;
$context = Timber::context();

$context['heading']   = $attributes['heading']   ?? '';
$context['eyebrow']   = $attributes['eyebrow']   ?? '';
$context['subtitle']  = $attributes['subtitle']  ?? '';
$context['cta_label'] = $attributes['ctaLabel']  ?? '';
$context['cta_url']   = $attributes['ctaUrl']    ?? '';
$context['count']     = $attributes['count']     ?? 8;

// Each reel post is edited as a single scootup/reel-card block; read its fields
// out of the block markup (no post meta / ACF). Featured image is the fallback
// cover. Twig falls back to the static mockup set when this list is empty.
$reels = [];
foreach (get_posts(['post_type' => 'reel', 'numberposts' => $attributes['count'] ?? 8]) as $reel) {
    $a = scootup_first_block_attrs($reel->ID, 'scootup/reel-card');
    $reels[] = [
        'src'     => $a['imageUrl'] ?: (get_the_post_thumbnail_url($reel->ID, 'large') ?: ''),
        'handle'  => $a['handle']  ?? $reel->post_title,
        'caption' => $a['caption'] ?? '',
    ];
}
$context['reels'] = $reels;

Timber::render('blocks/reels-gallery/reels-gallery.twig', $context);
