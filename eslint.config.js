import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: ['.nuxt', 'dist', 'src-tauri/target'],
})
