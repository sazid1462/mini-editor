import { Editor } from 'slate-react'
import React from 'react'
import styled from 'react-emotion'

type Props = any

export default function NodeRenderer(options: any) {

   const Image = styled('img')`
      display: block;
      max-width: 100%;
      max-height: 20em;
      box-shadow: ${props => (props.selected ? '0 0 0 2px blue;' : 'none')};
   `
   return ({
      /**
       * Render a Slate node.
       *
       * @param {Object} props
       * @return {Element}
       */

      renderNode: (props: Props, editor: Editor, next: any) => {
         const { attributes, children, node, isFocused } = props

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
            case 'image': {
               const src = node.data.get('src')
               return <Image src={src} selected={isFocused} {...attributes} />
            }
            default:
               return next()
         }
      }
   })
}
