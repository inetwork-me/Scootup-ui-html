<?php
defined('ABSPATH') || exit;
$context = Timber::context();
Timber::render('404.twig', $context);
