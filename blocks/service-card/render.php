<?php
defined('ABSPATH') || exit;
$context = Timber::context();
foreach ($attributes as $k => $v) {
    $context[$k] = $v;
}
Timber::render('blocks/service-card/service-card.twig', $context);
