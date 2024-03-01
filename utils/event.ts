import mitt from 'mitt'

export const bus = mitt<{
  'group:add': string
  'group:remove': string
}>()
