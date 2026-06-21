<?php
defined('ABSPATH') || exit;
$context = Timber::context();
foreach ($attributes as $k => $v) {
    $context[$k] = $v;
}
Timber::render('blocks/meta-bar/meta-bar.twig', $context);
