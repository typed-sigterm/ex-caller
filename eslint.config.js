import ts from '@typed-sigterm/eslint-config';

export default ts({
  ignores: ['src-tauri/target'],
  typescript: true,
  vue: true,
});
