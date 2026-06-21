<?php
defined('ABSPATH') || exit;
$context = Timber::context();
// $content is the rendered inner blocks (paragraphs, headings, dividers…).
$context['content'] = $content ?? '';
Timber::render('blocks/prose/prose.twig', $context);
