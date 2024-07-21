import ts from '@typed-sigterm/eslint-config';

export default ts({
  ignores: ['src-tauri/target'],
  javascript: {
    overrides: {
      'no-undef': [0],
    },
  },
});
