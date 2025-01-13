import type {StructureResolver} from 'sanity/structure'
import { startup } from './schemaTypes/startup'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Blog')
    .items([     
      S.documentTypeListItem('author').title('Authors'),
      S.documentTypeListItem('startup').title('Startups'),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => item.getId() && !['post', 'category', 'author','startup'].includes(item.getId()!),
      ),
    ])
