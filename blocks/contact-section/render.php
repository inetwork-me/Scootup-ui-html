<?php
defined('ABSPATH') || exit;
$context = Timber::context();
foreach ($attributes as $k => $v) {
    $context[$k] = $v;
}
$context['cf7_contact_id'] = get_post_meta(get_the_ID(), '_cf7_contact_id', true) ?: '';
Timber::render('blocks/contact-section/contact-section.twig', $context);
