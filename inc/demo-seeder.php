<?php
/**
 * Demo content seeder for the Scootup theme.
 *
 * Creates the site's Pages (+ template assignments + front page), the primary
 * nav menu, the `service` taxonomy terms, and sample `project` / `reel` /
 * `testimonial` posts so every designed template renders with real content.
 *
 * Idempotent: each item is matched by slug/title and skipped/updated if it
 * already exists. Run via WP-CLI (`wp scootup seed`) or Tools → Seed Demo Content.
 */

defined('ABSPATH') || exit;

/**
 * Read a page's pre-authored block content from inc/page-content/{slug}.html.
 */
function scootup_seed_page_content(string $slug): string {
    $file = __DIR__ . '/page-content/' . $slug . '.html';
    return is_readable($file) ? (string) file_get_contents($file) : '';
}

/**
 * Serialize a self-closing dynamic block comment: `<!-- wp:name {attrs} /-->`.
 * Used to seed CPT posts with the same editable blocks the editor produces.
 */
function scootup_block(string $name, array $attrs = []): string {
    $json = $attrs ? ' ' . wp_json_encode($attrs, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) : '';
    return "<!-- wp:{$name}{$json} /-->";
}

/**
 * Build a full block-based project page (project-hero + meta-bar + body +
 * image-grid + post-nav) so the single project is edited entirely as blocks.
 */
function scootup_build_project_content(array $p): string {
    // $p: client, role, year, deliverables, hero, gallery[], body_html, back_url, next_label, next_url
    // body_html is block markup (core/paragraph, core/heading…) edited inside the
    // scootup/prose InnerBlocks container — no Custom HTML block.
    $body = "<!-- wp:scootup/prose -->\n{$p['body_html']}\n<!-- /wp:scootup/prose -->";
    $gallery = array_map(fn($url) => ['url' => $url, 'alt' => $p['client']], $p['gallery']);

    return implode("\n\n", [
        scootup_block('scootup/project-hero', [
            'title'       => $p['client'],
            'imageUrl'    => $p['hero'],
            'overlayText' => $p['role'],
        ]),
        scootup_block('scootup/meta-bar', ['items' => [
            ['label' => 'Client',       'value' => $p['client']],
            ['label' => 'Service',      'value' => $p['role']],
            ['label' => 'Year',         'value' => $p['year']],
            ['label' => 'Deliverables', 'value' => $p['deliverables']],
        ]]),
        $body,
        scootup_block('scootup/image-grid', ['label' => 'Project Images', 'images' => $gallery]),
        scootup_block('scootup/post-nav', [
            'backLabel' => 'Back to ' . $p['role'],
            'backUrl'   => $p['back_url'],
            'nextLabel' => $p['next_label'],
            'nextUrl'   => $p['next_url'],
        ]),
    ]);
}

/**
 * Find a page by slug or create it.
 */
function scootup_seed_page(string $slug, string $title, string $template = '', string $content = '', array $meta = []): int {
    $existing = get_page_by_path($slug);
    $args = [
        'post_type'    => 'page',
        'post_title'   => $title,
        'post_name'    => $slug,
        'post_status'  => 'publish',
        'post_content' => $content,
    ];
    // Block content is trusted, theme-authored markup. Bypass KSES so block
    // comment delimiters / inline HTML aren't mangled when seeding from CLI
    // (no authenticated user) or any context lacking the unfiltered_html cap.
    kses_remove_filters();
    if ($existing) {
        $args['ID'] = $existing->ID;
        $id = wp_update_post($args);
    } else {
        $id = wp_insert_post($args);
    }
    kses_init_filters();
    if (is_wp_error($id) || !$id) {
        return 0;
    }
    if ($template) {
        update_post_meta($id, '_wp_page_template', $template);
    }
    foreach ($meta as $k => $v) {
        update_post_meta($id, $k, $v);
    }
    return (int) $id;
}

/**
 * Find a CPT post by title or create it.
 */
function scootup_seed_post(string $type, string $title, array $args = []): int {
    $found = get_posts([
        'post_type'      => $type,
        'title'          => $title,
        'posts_per_page' => 1,
        'post_status'    => 'any',
        'fields'         => 'ids',
    ]);
    $base = [
        'post_type'    => $type,
        'post_title'   => $title,
        'post_status'  => 'publish',
        'post_content' => $args['content']  ?? '',
        'post_excerpt' => $args['excerpt']  ?? '',
    ];
    // Block content is trusted, theme-authored markup. Bypass KSES so block
    // comment delimiters / inline HTML survive when seeding from CLI (no
    // authenticated user) or any context lacking the unfiltered_html cap.
    kses_remove_filters();
    if (!empty($found)) {
        $base['ID'] = $found[0];
        $id = wp_update_post($base);
    } else {
        $id = wp_insert_post($base);
    }
    kses_init_filters();
    if (is_wp_error($id) || !$id) {
        return 0;
    }
    foreach (($args['meta'] ?? []) as $k => $v) {
        update_post_meta($id, $k, $v);
    }
    if (!empty($args['service'])) {
        wp_set_object_terms($id, $args['service'], 'service');
    }
    return (int) $id;
}

/**
 * Main seeder. Returns a human-readable report.
 */
function scootup_seed_demo_content(): array {
    $report = [];

    /* ---- Service taxonomy terms ---------------------------------------- */
    $services = [
        // slug => [name, tagline, icon (no "i-" prefix), order, display count]
        'reels-social-video'  => ['Reels & Social Video', 'Short-form content engineered to stop the scroll.', 'video',    1, 12],
        'social-media-design' => ['Social Media Design',  'Feed-stopping visuals for every platform.',         'post',     2, 18],
        'branding-identity'   => ['Branding & Identity',  'Logos, systems and full brand worlds.',             'layers',   3, 9],
        'media-buying'        => ['Media Buying',          'Paid campaigns that actually convert.',            'trending', 4, 7],
        'web-app-development' => ['Web & App Development', 'Fast, beautiful products built to scale.',          'monitor',  5, 6],
        'graphic-design'      => ['Graphic Design',        'Print, digital and everything in between.',         'palette',  6, 11],
    ];
    $term_ids = [];
    foreach ($services as $slug => [$name, $tagline, $icon, $order, $disp_count]) {
        $term = term_exists($slug, 'service');
        if (!$term) {
            $term = wp_insert_term($name, 'service', ['slug' => $slug]);
        }
        if (!is_wp_error($term)) {
            $tid = (int) $term['term_id'];
            $term_ids[$slug] = $tid;
            // Keep the term name in sync with the mockup on reseed.
            wp_update_term($tid, 'service', ['name' => $name]);
            update_term_meta($tid, '_service_tagline', $tagline);
            update_term_meta($tid, '_service_icon', $icon);
            update_term_meta($tid, '_service_order', $order);
            // Marketing display figure shown on the work cards (editable per term).
            update_term_meta($tid, '_service_count', $disp_count);
        }
    }
    $report[] = 'Services: ' . count($term_ids) . ' terms';

    /* ---- Projects ------------------------------------------------------- */
    // Each project single is composed entirely of editable Gutenberg blocks
    // (project-hero, meta-bar, image-grid, post-nav) + an HTML body block, so
    // it's edited like a page. No per-field post meta / ACF.
    $hero_pool = [
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fm=webp&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fm=webp&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fm=webp&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fm=webp&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fm=webp&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fm=webp&fit=crop&w=1600&q=80',
    ];
    $gallery_pool = [
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fm=webp&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fm=webp&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fm=webp&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fm=webp&fit=crop&w=1000&q=80',
    ];
    $projects = [
        ['Saffron Kitchen',  'reels-social-video',  'Saffron Kitchen',  '2024', '8 Reels, Strategy, Edit',  'Reels & Social Video'],
        ['Bloom Beauty',     'social-media-design', 'Bloom Beauty',     '2024', 'Feed design, Stories',   'Social Media Design'],
        ['GreenRoot Organics','branding-identity',  'GreenRoot Organics','2023','Logo, Guidelines',       'Branding & Identity'],
        ['TechVault SaaS',   'web-app-development',  'TechVault',        '2024', 'Web app, UI/UX',         'Web & App Development'],
        ['Verde Botanicals', 'branding-identity',   'Verde Botanicals', '2023', 'Brand, Packaging',       'Branding & Identity'],
        ['Atlas Media Buy',  'media-buying',        'Atlas Co.',        '2024', 'Paid social, ROAS',      'Media Buying'],
    ];
    $project_base = home_url('/work/project/');
    $pcount = 0;
    foreach ($projects as $i => [$title, $svc_slug, $client, $year, $deliverables, $role]) {
        $proj_slug = sanitize_title($title);
        // Use hand-authored case-study HTML when a matching file exists
        // (inc/page-content/project-{slug}.html), else a one-line overview.
        $body_html = scootup_seed_page_content('project-' . $proj_slug)
            ?: "<!-- wp:paragraph {\"className\":\"body-text\"} -->\n<p class=\"body-text\">A $role engagement delivered for $client in $year.</p>\n<!-- /wp:paragraph -->";
        // Next project wraps around the list.
        $next = $projects[($i + 1) % count($projects)];

        $content = scootup_build_project_content([
            'client'       => $client,
            'role'         => $role,
            'year'         => $year,
            'deliverables' => $deliverables,
            'hero'         => $hero_pool[$i % count($hero_pool)],
            'gallery'      => $gallery_pool,
            'body_html'    => $body_html,
            'back_url'     => home_url('/work/' . $svc_slug),
            'next_label'   => $next[0],
            'next_url'     => $project_base . sanitize_title($next[0]) . '/',
        ]);

        $id = scootup_seed_post('project', $title, [
            'excerpt' => "$role project for $client.",
            'content' => $content,
            'service' => isset($term_ids[$svc_slug]) ? [$term_ids[$svc_slug]] : [],
        ]);
        if ($id) {
            $pcount++;
        }
    }
    $report[] = "Projects: $pcount";

    /* ---- Reels ---------------------------------------------------------- */
    // Each reel is edited as a single scootup/reel-card block in its content.
    $reel_covers = [
        'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=560&q=80&auto=format&fm=webp&fit=crop',
        'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=560&q=80&auto=format&fm=webp&fit=crop',
        'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=560&q=80&auto=format&fm=webp&fit=crop',
        'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=560&q=80&auto=format&fm=webp&fit=crop',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=560&q=80&auto=format&fm=webp&fit=crop',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=560&q=80&auto=format&fm=webp&fit=crop',
    ];
    $reels = [
        ['Saffron Kitchen Launch', 'instagram', '@saffronkitchen', 'Recipe reel that hit 1.2M views'],
        ['Bloom Beauty GRWM',      'tiktok',    '@bloombeauty',    'GRWM series, 480K views'],
        ['GreenRoot Unboxing',     'youtube',   '@greenroot',      'Shorts unboxing, 220K views'],
        ['TechVault Demo',         'instagram', '@techvault',      'Product demo reel'],
        ['Verde Story',            'facebook',  '@verdebotanicals','Brand story reel'],
        ['Atlas Promo',            'tiktok',    '@atlasco',        'Promo cut, 90K views'],
    ];
    $rcount = 0;
    foreach ($reels as $i => [$title, $platform, $handle, $caption]) {
        $content = scootup_block('scootup/reel-card', [
            'imageUrl' => $reel_covers[$i % count($reel_covers)],
            'imageAlt' => $caption,
            'caption'  => $caption,
            'handle'   => $handle,
            'platform' => $platform,
        ]);
        $id = scootup_seed_post('reel', $title, ['content' => $content]);
        if ($id) {
            $rcount++;
        }
    }
    $report[] = "Reels: $rcount";

    /* ---- Testimonials --------------------------------------------------- */
    $testimonials = [
        ['Saffron Kitchen', 'Owner', 'instagram', 5, 'Scoot Up tripled our reach in two months.'],
        ['Bloom Beauty',    'CMO',   'tiktok',    5, 'The most creative team we have worked with.'],
        ['GreenRoot',       'Founder','youtube',  5, 'Our brand finally feels premium.'],
        ['TechVault',       'CEO',   'instagram', 5, 'They shipped a beautiful app on time.'],
        ['Verde',           'Director','facebook',5, 'ROAS up 4x since we started.'],
        ['Atlas Co.',       'Head of Growth','tiktok',5,'Numbers do not lie — these folks deliver.'],
    ];
    $tcount = 0;
    foreach ($testimonials as [$author, $role, $platform, $rating, $quote]) {
        // Edited as a single scootup/testimonial-card block.
        $content = scootup_block('scootup/testimonial-card', [
            'quote'    => $quote,
            'rating'   => $rating,
            'author'   => $author,
            'role'     => $role,
            'platform' => $platform,
        ]);
        $id = scootup_seed_post('testimonial', "$author — $role", ['content' => $content]);
        if ($id) {
            $tcount++;
        }
    }
    $report[] = "Testimonials: $tcount";

    /* ---- Pages ---------------------------------------------------------- */
    $home = scootup_seed_page('home', 'Home', '', scootup_seed_page_content('home'), [
        '_meta_title'       => 'Scoot Up — Creative growth studio',
        '_meta_description' => 'A growth studio moving brands up and to the right — reels, design, branding, media buying, and web.',
        '_content_format'   => 'article',
    ]);
    $about = scootup_seed_page('about', 'About', 'page-about.php', scootup_seed_page_content('about'), [
        '_meta_title'       => 'About — Scoot Up',
        '_meta_description' => 'Meet the studio behind the growth: strategy, platform-native creative, and results ownership.',
        '_content_format'   => 'article',
    ]);
    $work = scootup_seed_page('work', 'Our Work', 'page-work.php', scootup_seed_page_content('work'), [
        '_meta_title'       => 'Our Work — Scoot Up',
        '_meta_description' => 'Selected projects across reels, social design, branding, media buying and web.',
        '_content_format'   => 'article',
    ]);
    $reels_pg = scootup_seed_page('reels', 'Reels', 'page-reels.php', scootup_seed_page_content('reels'), [
        '_meta_title'       => 'Reels — Scoot Up',
        '_meta_description' => 'Short-form content that performs across Instagram, TikTok, YouTube and Facebook.',
        '_content_format'   => 'article',
    ]);
    $contact = scootup_seed_page('contact', 'Contact', 'page-contact.php', scootup_seed_page_content('contact'), [
        '_meta_title'       => 'Contact — Scoot Up',
        '_meta_description' => "Let's build something that moves. Start a project with Scoot Up.",
        '_content_format'   => 'article',
    ]);
    $report[] = 'Pages: home/about/work/reels/contact created';

    /* ---- Front page ----------------------------------------------------- */
    if ($home) {
        update_option('show_on_front', 'page');
        update_option('page_on_front', $home);
        $report[] = "Front page set to Home (#$home)";
    }

    /* ---- Primary nav menu ----------------------------------------------- */
    $menu_name = 'Primary';
    $menu = wp_get_nav_menu_object($menu_name);
    $menu_id = $menu ? $menu->term_id : wp_create_nav_menu($menu_name);
    if (!is_wp_error($menu_id)) {
        // Clear existing items to stay idempotent.
        foreach (wp_get_nav_menu_items($menu_id) ?: [] as $item) {
            wp_delete_post($item->ID, true);
        }
        $nav = [
            ['Home', $home],
            ['Reels', $reels_pg],
            ['Our Work', $work],
            ['About', $about],
            ['Contact', $contact],
        ];
        foreach ($nav as $i => [$label, $pid]) {
            if (!$pid) {
                continue;
            }
            wp_update_nav_menu_item($menu_id, 0, [
                'menu-item-title'     => $label,
                'menu-item-object'    => 'page',
                'menu-item-object-id' => $pid,
                'menu-item-type'      => 'post_type',
                'menu-item-status'    => 'publish',
                'menu-item-position'  => $i + 1,
            ]);
        }
        // NOTE: intentionally NOT assigning this menu to the `primary` location.
        // The header is bespoke chrome (mockup parity): 2 highlight pills
        // (Reels, Our Work) + a "Let's Talk" CTA, with the full nav in the burger
        // dropdown. header.twig renders that faithful structure when no menu is
        // assigned. The "Primary" menu is still created for optional customisation.
        $report[] = 'Primary menu created (header uses bespoke nav; assign manually to override)';
    }

    // Refresh rewrite rules for CPT/taxonomy slugs.
    flush_rewrite_rules();
    $report[] = 'Rewrite rules flushed';

    update_option('scootup_seeded', current_time('mysql'));
    return $report;
}

/* -------------------------------------------------------------------------
 * Triggers: WP-CLI command + Tools admin page button.
 * ---------------------------------------------------------------------- */
if (defined('WP_CLI') && WP_CLI) {
    WP_CLI::add_command('scootup seed', function () {
        foreach (scootup_seed_demo_content() as $line) {
            WP_CLI::log('✓ ' . $line);
        }
        WP_CLI::success('Scootup demo content seeded.');
    });
}

add_action('admin_menu', function () {
    add_management_page('Seed Scootup Demo', 'Seed Demo Content', 'manage_options', 'scootup-seed', function () {
        if (!current_user_can('manage_options')) {
            return;
        }
        echo '<div class="wrap"><h1>Seed Scootup Demo Content</h1>';
        if (isset($_POST['scootup_seed']) && check_admin_referer('scootup_seed')) {
            echo '<ul style="list-style:disc;margin-left:1.5rem">';
            foreach (scootup_seed_demo_content() as $line) {
                echo '<li>' . esc_html($line) . '</li>';
            }
            echo '</ul><p><strong>Done.</strong></p>';
        }
        echo '<form method="post">';
        wp_nonce_field('scootup_seed');
        echo '<p>Creates Pages, nav menu, services, sample projects/reels/testimonials. Safe to run repeatedly.</p>';
        echo '<p><button class="button button-primary" name="scootup_seed" value="1">Seed demo content</button></p>';
        echo '</form></div>';
    });
});
