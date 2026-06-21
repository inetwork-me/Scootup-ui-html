<?php
/**
 * Template Name: Contact
 *
 * Ports the contact.html mockup: intro (breadcrumb + H1 + subtext) and a
 * two-column layout — Contact Form 7 form (left) and contact-info + social
 * pills (right), with a client-side success state.
 *
 * Set `_cf7_contact_id` post meta (or the cf7_contact_id context var) to the
 * Contact Form 7 form id so the editor can wire the live form.
 */

defined('ABSPATH') || exit;

$context         = Timber::context();
$context['post'] = Timber::get_post();

$context['cf7_contact_id'] = get_post_meta(get_the_ID(), '_cf7_contact_id', true) ?: 'CHANGE_ME';

Timber::render(['page-contact.twig', 'page.twig'], $context);
