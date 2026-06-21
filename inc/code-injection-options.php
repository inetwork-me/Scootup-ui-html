<?php
defined('ABSPATH') || exit;

add_action('admin_menu', function () {
    add_options_page(
        'Theme Code Injection',
        'Code Injection',
        'manage_options',
        'theme-code-injection',
        'theme_code_injection_page'
    );
});

add_action('admin_init', function () {
    foreach (['theme_code_head', 'theme_code_body_open', 'theme_code_body_close', 'theme_code_after_footer'] as $opt) {
        register_setting('theme_code_injection', $opt, ['sanitize_callback' => 'wp_kses_post']);
    }
});

function theme_code_injection_page(): void {
    if (!current_user_can('manage_options')) {
        return;
    }
    ?>
    <div class="wrap">
      <h1>Theme Code Injection</h1>
      <form method="post" action="options.php">
        <?php settings_fields('theme_code_injection'); ?>
        <?php foreach ([
            'theme_code_head'         => 'Before &lt;/head&gt; (GTM script, custom head tags)',
            'theme_code_body_open'    => 'After &lt;body&gt; open (GTM noscript, pixels)',
            'theme_code_body_close'   => 'Before &lt;/body&gt; (deferred scripts)',
            'theme_code_after_footer' => 'After &lt;/footer&gt; (additional scripts)',
        ] as $key => $label): ?>
          <h2><?= esc_html($label) ?></h2>
          <textarea name="<?= esc_attr($key) ?>" rows="6" style="width:100%;font-family:monospace"><?= esc_textarea(get_option($key, '')) ?></textarea>
        <?php endforeach; ?>
        <?php submit_button(); ?>
      </form>
    </div>
    <?php
}
