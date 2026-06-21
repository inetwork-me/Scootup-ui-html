<?php
defined('ABSPATH') || exit;

// Timber
use Timber\Timber;
require_once __DIR__ . '/vendor/autoload.php';
Timber::init();

// Theme includes
require_once __DIR__ . '/inc/post-types.php';
require_once __DIR__ . '/inc/block-data.php';
require_once __DIR__ . '/inc/acf-fields.php';
require_once __DIR__ . '/inc/meta-fields.php';
require_once __DIR__ . '/inc/meta-context.php';
require_once __DIR__ . '/inc/security-headers.php';
require_once __DIR__ . '/inc/robots.php';
require_once __DIR__ . '/inc/sitemap.php';
require_once __DIR__ . '/inc/code-injection-options.php';
require_once __DIR__ . '/inc/demo-seeder.php';

// Timber view directories: `views/` for page templates & partials, and the
// theme root so block templates resolve as `blocks/{name}/{name}.twig`.
add_filter('timber/locations', function ($paths) {
    $paths[] = [__DIR__ . '/views'];
    $paths[] = [__DIR__];
    return $paths;
});

// Enqueue theme assets
add_action('wp_enqueue_scripts', function () {
    $dir = get_template_directory();
    $uri = get_template_directory_uri();
    // Version each asset by its file mtime so a rebuilt CSS/JS busts the browser
    // cache automatically (a fixed theme version would serve stale, broken CSS).
    $v = fn($rel) => file_exists($dir . $rel) ? (string) filemtime($dir . $rel) : wp_get_theme()->get('Version');

    wp_enqueue_style(
        'scootup-style',
        $uri . '/dist/index.css',
        [],
        $v('/dist/index.css')
    );

    wp_enqueue_script(
        'scootup-script',
        $uri . '/dist/index.js',
        [],
        $v('/dist/index.js'),
        ['strategy' => 'defer', 'in_footer' => true]
    );

    // Interaction + animation layer (theme switch, reveals, carousels, parallax).
    wp_enqueue_script(
        'scootup-interactions',
        $uri . '/assets/js/app.js',
        [],
        $v('/assets/js/app.js'),
        ['strategy' => 'defer', 'in_footer' => true]
    );
});

// Load the compiled Tailwind stylesheet INTO the block-editor canvas (the 6.3+
// iframe) so ServerSideRender block previews look identical to the front end.
// `enqueue_block_assets` fires for both the front end and the editor; styles
// enqueued here are injected into the editor iframe. Guard to admin so the front
// end keeps using its existing `scootup-style` handle (enqueued on wp_enqueue_scripts).
add_action('enqueue_block_assets', function () {
    if (!is_admin()) {
        return;
    }
    $dir = get_template_directory();
    $uri = get_template_directory_uri();
    $v   = file_exists($dir . '/dist/index.css')
        ? (string) filemtime($dir . '/dist/index.css')
        : wp_get_theme()->get('Version');
    wp_enqueue_style('scootup-style-editor', $uri . '/dist/index.css', [], $v);

    // The front-end JS (app.js) never runs inside the editor canvas, so the
    // scroll-reveal system never adds its `.is-in` / `*-loaded` classes — that
    // leaves [data-reveal] elements stuck at opacity:0 / clipped / translated and
    // their content invisible while editing. Force the revealed end-state in the
    // editor only so every block shows its full content.
    wp_add_inline_style('scootup-style-editor', <<<CSS
        [data-reveal='up'],[data-reveal='fade'],[data-reveal='clip']{opacity:1!important;transform:none!important;clip-path:none!important;}
        .rv-wi{opacity:1!important;transform:none!important;}
        [data-reveal='tag'] .hero-tag{opacity:1!important;transform:rotate(-0.6deg) translateY(0)!important;}
        .about-label{opacity:1!important;transform:rotate(-0.6deg) translateY(0)!important;}
        .about-grid .about-left,.about-grid .about-right{opacity:1!important;transform:none!important;}
        .svc-grid .svc-col-left,.svc-grid .svc-col-right{opacity:1!important;transform:none!important;}
        .svc-fading{opacity:1!important;transform:none!important;}
        .svc-img-wrap img{opacity:1!important;transform:none!important;}
        .process-step{opacity:1!important;transform:none!important;}
        .contact-left,.contact-right,.form-field{opacity:1!important;transform:none!important;}
    CSS);
});

// SEO/AEO/GEO Block Editor sidebar panel
add_action('enqueue_block_editor_assets', function () {
    $asset = include __DIR__ . '/dist/inc/seo-panel/index.asset.php';
    wp_enqueue_script(
        'scootup-seo-panel',
        get_template_directory_uri() . '/dist/inc/seo-panel/index.js',
        $asset['dependencies'] ?? ['wp-plugins', 'wp-editor', 'wp-element', 'wp-components', 'wp-core-data', 'wp-data'],
        $asset['version'] ?? wp_get_theme()->get('Version')
    );
});

// Register all blocks auto-discovered from blocks/ directory
add_action('init', function () {
    foreach (glob(__DIR__ . '/blocks/*/block.json') as $block_json) {
        register_block_type(dirname($block_json));
    }
});

// Theme supports
add_action('after_setup_theme', function () {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', ['comment-list', 'comment-form', 'search-form', 'gallery', 'caption', 'style', 'script']);
    add_theme_support('responsive-embeds');
    add_theme_support('editor-styles');
    add_theme_support('align-wide');

    register_nav_menus([
        'primary' => __('Primary Menu', 'scootup'),
        'footer'  => __('Footer Menu', 'scootup'),
    ]);
});
