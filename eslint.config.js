import './eslint.polyfill.js';

const { default: ts } = await import('@typed-sigterm/eslint-config');

export default ts({
  ignores: ['src-tauri/target'],
});
