import type { Block } from 'payload/types'

export const MediaBlock: Block = {
  slug: 'mediaBlock',
  fields: [
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
  ],
}
