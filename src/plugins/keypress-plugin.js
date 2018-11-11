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
const isTabKey = isKeyHotkey('tab')
const isShiftTabKey = isKeyHotkey('shift+tab')

export default function KeyPressPlugin(options: any) {
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
         } else if (isTabKey(event) || isShiftTabKey(event)) {
            let type = editor.value.focusBlock.type
            if (type == 'list-item') {
               const { value } = editor
               const { document } = value
               const parentType = document.getClosest(editor.value.focusBlock.key, parent => 
                  (parent.type=='bulleted-list' || parent.type=='numbered-list')).type
               console.log(parentType)
               event.preventDefault()
               if (isTabKey(event)) {
                  editor.wrapBlock(parentType)
               } else {
                  editor.unwrapBlock(parentType)
               }
               return
            } else {
               return next()
            }
         } else {
            return next()
         }

         event.preventDefault()
         editor.toggleMark(mark)
      }
   })
}