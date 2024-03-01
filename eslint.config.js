import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: ['src-tauri/target'],
  javascript: {
    overrides: {
      'no-undef': [0],
    },
  },
})
