import { isKeyHotkey } from 'is-hotkey'
import { Editor } from 'slate-react'

/**
 * Define hotkey matchers.
 *
 * @type {Function}
 */
const isBoldHotkey = isKeyHotkey('mod+b')
const isItalicHotkey = isKeyHotkey('mod+i')
const isUnderlinedHotkey = isKeyHotkey('mod+u')
const isCodeHotkey = isKeyHotkey('mod+`')

export default function TextStylePlugin(options: any) {
   return ({
      /**
       * On key down, if it's a formatting command toggle a mark.
       *
       * @param {Event} event
       * @param {Editor} editor
       * @return {Change}
       */
      onKeyDown: (event: Event, editor: Editor, next: any) => {
         let mark

         if (isBoldHotkey(event)) {
            mark = 'bold'
         } else if (isItalicHotkey(event)) {
            mark = 'italic'
         } else if (isUnderlinedHotkey(event)) {
            mark = 'underlined'
         } else if (isCodeHotkey(event)) {
            mark = 'code'
         } else {
            return next()
         }

         event.preventDefault()
         editor.toggleMark(mark)
      }
   })
}
