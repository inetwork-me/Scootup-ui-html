<?php
defined('ABSPATH') || exit;

add_filter('timber/context', function ($ctx) {
    // Primary navigation menu (header.twig falls back to static links if empty).
    $primary = Timber::get_menu('primary');
    if ($primary) {
        $ctx['menu'] = $primary;
    }

    // Site-wide code injection (available on every request).
    $ctx['injection'] = [
        'head'         => get_option('theme_code_head',         ''),
        'body_open'    => get_option('theme_code_body_open',    ''),
        'body_close'   => get_option('theme_code_body_close',   ''),
        'after_footer' => get_option('theme_code_after_footer', ''),
    ];

    $id = get_the_ID();
    if (!$id) {
        // Non-singular (archives, 404): provide safe SEO defaults.
        $ctx['meta_title']       = wp_get_document_title();
        $ctx['meta_description'] = get_bloginfo('description');
        $ctx['canonical_url']    = home_url(add_query_arg([], $GLOBALS['wp']->request ?? ''));
        $ctx['robots_directive'] = 'index,follow';
        $ctx['og_type']          = 'website';
        $ctx['schema_json']      = wp_json_encode(theme_build_schema($ctx), JSON_UNESCAPED_SLASHES);
        return $ctx;
    }

    // SEO
    $ctx['meta_title']       = get_post_meta($id, '_meta_title', true)       ?: get_the_title();
    $ctx['meta_description'] = get_post_meta($id, '_meta_description', true) ?: '';
    $ctx['og_image']         = get_post_meta($id, '_og_image', true)         ?: get_the_post_thumbnail_url($id, 'large') ?: get_template_directory_uri() . '/assets/logo.webp';
    $ctx['canonical_url']    = get_post_meta($id, '_canonical_url', true)    ?: get_permalink($id);
    $ctx['robots_directive'] = get_post_meta($id, '_robots_directive', true) ?: 'index,follow';
    $ctx['og_type']          = is_singular('post') ? 'article' : 'website';

    // AEO
    $ctx['faq_items']      = json_decode(get_post_meta($id, '_faq_items', true) ?: '[]', true);
    $ctx['content_format'] = get_post_meta($id, '_content_format', true) ?: 'article';

    // GEO / E-E-A-T
    $ctx['author_name']        = get_post_meta($id, '_author_name', true)
                                 ?: get_the_author_meta('display_name', (int) get_post_field('post_author', $id));
    $ctx['author_credentials'] = get_post_meta($id, '_author_credentials', true) ?: '';
    $ctx['content_updated']    = get_post_meta($id, '_content_updated', true)    ?: get_the_modified_date('c', $id);
    $ctx['entity_mentions']    = json_decode(get_post_meta($id, '_entity_mentions', true) ?: '[]', true);

    // JSON-LD
    $ctx['schema_json'] = wp_json_encode(theme_build_schema($ctx), JSON_UNESCAPED_SLASHES);

    return $ctx;
});

function theme_build_schema(array $ctx): array {
    $site_name = get_bloginfo('name');
    $site_url  = home_url('/');

    $org = [
        '@type'  => 'Organization',
        'name'   => $site_name,
        'url'    => $site_url,
        'sameAs' => [],
    ];

    $breadcrumb = [
        '@type'           => 'BreadcrumbList',
        'itemListElement' => [
            ['@type' => 'ListItem', 'position' => 1, 'name' => $site_name, 'item' => $site_url],
        ],
    ];

    $base = [
        '@context' => 'https://schema.org',
        '@graph'   => [$org, $breadcrumb],
    ];

    $webpage = [
        '@type'        => 'WebPage',
        'url'          => $ctx['canonical_url']    ?? $site_url,
        'name'         => $ctx['meta_title']       ?? '',
        'description'  => $ctx['meta_description'] ?? '',
        'dateModified' => $ctx['content_updated']  ?? '',
        'author'       => [
            '@type'       => 'Person',
            'name'        => $ctx['author_name']        ?? '',
            'description' => $ctx['author_credentials'] ?? '',
        ],
        'publisher'    => $org,
    ];

    if (!empty($ctx['entity_mentions'])) {
        $webpage['mentions'] = array_map(fn($e) => ['@type' => 'Thing', 'name' => $e], $ctx['entity_mentions']);
    }

    switch ($ctx['content_format'] ?? 'article') {
        case 'faq':
            $faq_entities = array_map(fn($item) => [
                '@type'          => 'Question',
                'name'           => $item['q'] ?? '',
                'acceptedAnswer' => ['@type' => 'Answer', 'text' => $item['a'] ?? ''],
            ], $ctx['faq_items'] ?? []);
            $base['@graph'][] = array_merge($webpage, ['@type' => 'FAQPage', 'mainEntity' => $faq_entities]);
            break;
        case 'howto':
            $steps = array_map(fn($item, $i) => [
                '@type'    => 'HowToStep',
                'position' => $i + 1,
                'name'     => $item['q'] ?? '',
                'text'     => $item['a'] ?? '',
            ], $ctx['faq_items'] ?? [], array_keys($ctx['faq_items'] ?? []));
            $base['@graph'][] = array_merge($webpage, ['@type' => 'HowTo', 'step' => $steps]);
            break;
        case 'product':
            $base['@graph'][] = array_merge($webpage, ['@type' => 'Product', 'name' => $ctx['meta_title'] ?? '']);
            break;
        case 'article':
            $base['@graph'][] = array_merge($webpage, ['@type' => 'Article']);
            break;
        default:
            $base['@graph'][] = $webpage;
    }

    return $base;
}
