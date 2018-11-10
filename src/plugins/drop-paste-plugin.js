import { Editor, getEventRange, getEventTransfer } from 'slate-react'
import isUrl from 'is-url'
import React from 'react'
import styled from 'react-emotion'
import imageExtensions from 'image-extensions'

type Props = any

export default function DropPastePlugin(options: any) {

   const Image = styled('img')`
      display: block;
      max-width: 100%;
      max-height: 20em;
      box-shadow: ${props => (props.selected ? '0 0 0 2px blue;' : 'none')};
   `

   /**
    * A function to determine whether a URL has an image extension.
    *
    * @param {String} url
    * @return {Boolean}
    */
   let isImage = (url: string) => {
      return !!imageExtensions.find(url.endsWith)
   }

   let insertImage = options.insertImage

   /**
   * On drop, insert the image wherever it is dropped.
   *
   * @param {Event} event
   * @param {Editor} editor
   * @param {Function} next
   */
   let onDropOrPaste = (event: Event, editor: Editor, next: any) => {
      const target = getEventRange(event, editor)
      if (!target && event.type === 'drop') return next()

      const transfer = getEventTransfer(event)
      const { type, text, files } = transfer

      if (type === 'files') {
         for (const file of files) {
            const reader = new FileReader()
            const [mime] = file.type.split('/')
            if (mime !== 'image') continue

            reader.addEventListener('load', () => {
               editor.command(insertImage, reader.result, target)
            })

            reader.readAsDataURL(file)
         }
         return
      }

      if (type === 'text') {
         if (isUrl(text)) return next()
         if (!isImage(text)) return next()
         editor.command(insertImage, text, target)
         return
      }

      next()
   }

   return ({
      [options.handlerType]: (event: Event, editor: Editor, next: any) => {
         onDropOrPaste(event, editor, next)
      }
   })
}
