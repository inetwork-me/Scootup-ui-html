import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { PanelBody, TextControl, TextareaControl, SelectControl } from '@wordpress/components';
import { useEntityProp } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { registerPlugin } from '@wordpress/plugins';

function SeoPanel() {
  const postType = useSelect((select) => select('core/editor').getCurrentPostType(), []);
  const [meta, setMeta] = useEntityProp('postType', postType, 'meta');

  const update = (key) => (val) => setMeta({ ...meta, [key]: val });

  return (
    <PluginDocumentSettingPanel name="seo-panel" title="SEO / AEO / GEO" icon="search">

      <PanelBody title="SEO" initialOpen={true}>
        <TextControl
          label="Meta Title"
          value={meta._meta_title || ''}
          onChange={update('_meta_title')}
          help="Fallback: post title"
        />
        <TextareaControl
          label="Meta Description"
          value={meta._meta_description || ''}
          onChange={update('_meta_description')}
          rows={3}
        />
        <TextControl
          label="OG Image URL"
          value={meta._og_image || ''}
          onChange={update('_og_image')}
          help="Fallback: featured image"
        />
        <TextControl
          label="Canonical URL"
          value={meta._canonical_url || ''}
          onChange={update('_canonical_url')}
          help="Fallback: permalink"
        />
        <SelectControl
          label="Robots"
          value={meta._robots_directive || 'index,follow'}
          options={[
            { label: 'index, follow', value: 'index,follow' },
            { label: 'noindex, follow', value: 'noindex,follow' },
            { label: 'index, nofollow', value: 'index,nofollow' },
            { label: 'noindex, nofollow', value: 'noindex,nofollow' },
          ]}
          onChange={update('_robots_directive')}
        />
      </PanelBody>

      <PanelBody title="AEO — Answer Engine" initialOpen={false}>
        <SelectControl
          label="Content Format"
          value={meta._content_format || 'article'}
          options={[
            { label: 'Article', value: 'article' },
            { label: 'FAQ Page', value: 'faq' },
            { label: 'How-To', value: 'howto' },
            { label: 'Product', value: 'product' },
            { label: 'Default', value: 'default' },
          ]}
          onChange={update('_content_format')}
          help="Controls JSON-LD schema type"
        />
        <TextareaControl
          label="FAQ Items (JSON)"
          value={meta._faq_items || ''}
          onChange={update('_faq_items')}
          rows={5}
          help={'Format: [{"q":"Question?","a":"Answer."}]'}
        />
      </PanelBody>

      <PanelBody title="GEO — Generative Engine" initialOpen={false}>
        <TextControl
          label="Author Name"
          value={meta._author_name || ''}
          onChange={update('_author_name')}
          help="Fallback: post author"
        />
        <TextControl
          label="Author Credentials"
          value={meta._author_credentials || ''}
          onChange={update('_author_credentials')}
          help={'e.g. "PhD, 10 years experience"'}
        />
        <TextControl
          label="Last Updated (ISO date)"
          value={meta._content_updated || ''}
          onChange={update('_content_updated')}
          help="e.g. 2025-01-15. Fallback: post modified date"
        />
        <TextareaControl
          label="Entity Mentions (JSON)"
          value={meta._entity_mentions || ''}
          onChange={update('_entity_mentions')}
          rows={3}
          help={'Format: ["Entity A","Entity B"]'}
        />
      </PanelBody>

    </PluginDocumentSettingPanel>
  );
}

registerPlugin('theme-seo-panel', { render: SeoPanel });
