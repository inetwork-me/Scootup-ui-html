<?php
defined('ABSPATH') || exit;
$context = Timber::context();
$context['heading'] = $attributes['heading'] ?? '';
$context['items']   = $attributes['items']   ?? [];
Timber::render('blocks/feature-cards/feature-cards.twig', $context);
