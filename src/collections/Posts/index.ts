import type { CollectionConfig } from 'payload/types'
import payload from 'payload'
import { MediaBlock } from '../../blocks/MediaBlock'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      admin: {
        position: 'sidebar',
      },
      required: true,
    },
    {
      name: 'publishedOn',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              required: true,
              blocks: [MediaBlock],
            },
          ],
        },
      ],
    },
  ],
  endpoints: [
    {
      path: "/videos/stream",
      method: "get",
      handler: async (req, res, next) => {
        const page : any = req.query.page || 1; 
        const itemsPerPage = 1;

        const category = await payload.find({
          collection: 'categories',
          where: {title: {equals:"Short Videos"}},
        })
        if (category) {
          const post = await payload.find({
            collection: 'posts',
            pagination: true,
            page: page,
            limit: itemsPerPage, // Set the limit to the number of items per page
            where: { 'categories': { equals: [category.docs[0].id] } },
          })
          res.status(200).send({ posts: post.docs });
        } else {
          res.status(404).send({ error: "not found" });
        }
      },
    },
  ],
}
