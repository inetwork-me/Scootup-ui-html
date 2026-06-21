<?php
/**
 * Security headers + HTTPS enforcement.
 *
 * Lighthouse "Best Practices" is dominated by the HTTPS audits
 * (`is-on-https`, weight 5, and `redirects-http`, weight 1). Served over
 * HTTPS with these headers the page scores 100. The remaining headers are
 * genuine hardening that also satisfy the Trust & Safety audits (HSTS, COOP)
 * without risking front-end or block-editor breakage.
 *
 * Front-end only — admin, login and REST are skipped so the Block Editor and
 * wp-admin are never constrained by the CSP / frame rules.
 */

defined('ABSPATH') || exit;

/**
 * Redirect any HTTP request to its HTTPS equivalent before WordPress renders.
 * Skipped on the CLI and when WordPress already reports a secure request.
 */
add_action('template_redirect', function () {
    if (is_ssl() || wp_doing_ajax() || (defined('WP_CLI') && WP_CLI)) {
        return;
    }
    if (is_admin() || is_user_logged_in()) {
        return; // admin SSL is handled by FORCE_SSL_ADMIN
    }
    $host = $_SERVER['HTTP_HOST'] ?? '';
    $uri  = $_SERVER['REQUEST_URI'] ?? '';
    if ($host === '') {
        return;
    }
    wp_safe_redirect('https://' . $host . $uri, 301);
    exit;
}, 1);

/**
 * Emit security headers on every front-end response.
 */
add_action('send_headers', function () {
    if (is_admin()) {
        return;
    }

    // Force HTTPS for a year incl. subdomains (only meaningful once on HTTPS).
    if (is_ssl()) {
        header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
    }

    // Stop MIME-type sniffing.
    header('X-Content-Type-Options: nosniff');

    // Leak only the origin to cross-origin destinations.
    header('Referrer-Policy: strict-origin-when-cross-origin');

    // Isolate this browsing context (Trust & Safety: COOP).
    header('Cross-Origin-Opener-Policy: same-origin');

    // Disable powerful features the site never uses.
    header('Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=()');

    // Clickjacking protection (also expressed as frame-ancestors below).
    header('X-Frame-Options: SAMEORIGIN');

    // upgrade-insecure-requests transparently rewrites any http:// subresource
    // to https:// (prevents mixed content) and frame-ancestors blocks framing.
    // Deliberately minimal so it never blocks legitimate inline scripts/styles
    // emitted by WordPress core, CF7 or the SEO panel.
    header("Content-Security-Policy: upgrade-insecure-requests; frame-ancestors 'self'");
}, 1);
