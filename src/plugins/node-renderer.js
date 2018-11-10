import { Editor } from 'slate-react'
import React from 'react'

type Props = any

export default function NodeRenderer(options: any) {
   return ({
      /**
       * Render a Slate node.
       *
       * @param {Object} props
       * @return {Element}
       */

      renderNode: (props: Props, editor: Editor, next: any) => {
         const { attributes, children, node } = props

         switch (node.type) {
            case 'block-quote':
               return <blockquote {...attributes}>{children}</blockquote>
            case 'bulleted-list':
               return <ul {...attributes}>{children}</ul>
            case 'heading-one':
               return <h1 {...attributes}>{children}</h1>
            case 'heading-two':
               return <h2 {...attributes}>{children}</h2>
            case 'list-item':
               return <li {...attributes}>{children}</li>
            case 'numbered-list':
               return <ol {...attributes}>{children}</ol>
            default:
               return next()
         }
      }
   })
}
