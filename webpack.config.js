/**
 * Custom webpack config extending @wordpress/scripts.
 *
 * Enumerates entries explicitly (cross-platform — no shell glob expansion):
 *   - src/index.js               -> dist/index.js (+ dist/index.css)
 *   - inc/seo-panel/index.jsx    -> dist/inc/seo-panel/index.js
 *   - blocks/<name>/index.js     -> dist/blocks/<name>/index.js
 *
 * Each block.json's "editorScript" points at "../../dist/blocks/<name>/index.js"
 * so register_block_type() (registered from the source blocks/<name> dir, which
 * keeps block.json + render.php + the .twig) loads the compiled editor bundle
 * and its generated index.asset.php dependency list.
 */
const fs = require('fs');
const path = require('path');
const defaultConfig = require('@wordpress/scripts/config/webpack.config');

const entries = {
  index: path.resolve(__dirname, 'src/index.js'),
  'inc/seo-panel/index': path.resolve(__dirname, 'inc/seo-panel/index.jsx'),
};

const blocksDir = path.resolve(__dirname, 'blocks');
if (fs.existsSync(blocksDir)) {
  for (const name of fs.readdirSync(blocksDir)) {
    const entry = path.join(blocksDir, name, 'index.js');
    if (fs.existsSync(entry)) {
      entries[`blocks/${name}/index`] = entry;
    }
  }
}

module.exports = {
  ...defaultConfig,
  entry: entries,
  output: {
    ...defaultConfig.output,
    path: path.resolve(__dirname, 'dist'),
  },
};
