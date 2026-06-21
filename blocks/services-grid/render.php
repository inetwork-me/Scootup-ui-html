<?php
defined('ABSPATH') || exit;
$context = Timber::context();

$context['heading'] = $attributes['heading'] ?? 'What we do';
$context['intro']   = $attributes['intro']   ?? '';
$context['count']   = $attributes['count']   ?? 6;

$context['terms'] = Timber::get_terms([
    'taxonomy'   => 'service',
    'hide_empty' => false,
    'number'     => $attributes['count'] ?? 6,
    // Order by the curated _service_order meta. meta_query with EXISTS keeps the
    // ordering stable; terms without the meta still appear (NOT EXISTS branch).
    'orderby'    => 'meta_value_num',
    'order'      => 'ASC',
    'meta_query' => [
        'relation' => 'OR',
        ['key' => '_service_order', 'compare' => 'EXISTS'],
        ['key' => '_service_order', 'compare' => 'NOT EXISTS'],
    ],
]);

Timber::render('blocks/services-grid/services-grid.twig', $context);
