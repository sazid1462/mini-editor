import React, { Component } from 'react'
import { Editor } from 'slate-react'
import imageExtensions from 'image-extensions'
import { Value, Block } from 'slate'

import initialValue from '../resources/value'
import { Button, Icon, Toolbar } from './components'
import KeyPressPlugin from '../plugins/keypress-plugin'
import NodeRenderer from '../plugins/node-renderer'
import MarkRenderer from '../plugins/mark-renderer'
import DropPastePlugin from '../plugins/drop-paste-plugin'
import MiniToolbar from './MiniToolbar'

type Props = any;
type State = {
   value: Value,
   oldJSONValue: Value,
   newJSONValue: Value,
   documentIsChanged: boolean,
   editor: Editor
};

// Define our editor...
export default class MiniEditor extends Component<Props, State> {
   editor: Editor = {}
   plugins = [
      KeyPressPlugin(),
      NodeRenderer(),
      MarkRenderer(),
      DropPastePlugin({ handlerType: 'onDrop', insertImage: this.insertImage }),
      DropPastePlugin({ handlerType: 'onPaste', insertImage: this.insertImage })
   ]
   
   constructor(props: Props) {
      super(props)
      let existingValue: any = localStorage.getItem('content')
      if (existingValue) {
         try {
            existingValue = JSON.parse(existingValue)
         } catch (e) {
            console.log('Corrupted local storage value!')
            existingValue = null
         }
      }
      // Set the initial value when the app is first constructed.
      let  value = Value.fromJSON(existingValue || initialValue)
      this.state = {
         oldJSONValue: existingValue || initialValue,
         newJSONValue: existingValue || initialValue,
         value: value,
         documentIsChanged: false,
         editor: {}
      }
   }

   reloadContent = () => {
      this.setState({value: Value.fromJSON(this.state.oldJSONValue), newJSONValue: this.state.oldJSONValue, documentIsChanged: false})
   }

   updateContent = (content: JSON) => {
      this.setState({oldJSONValue: content, newJSONValue: content, documentIsChanged: false})
   }

   /**
    * A change function to standardize inserting images.
    *
    * @param {Editor} editor
    * @param {String} src
    * @param {Range} target
    */
   insertImage = (editor: Editor, src: string, target: Range) => {
      if (target) {
         editor.select(target)
      }

      editor.insertBlock({
         type: 'image',
         data: { src },
      })
   }


   /**
    * Store a reference to the `editor`.
    *
    * @param {Editor} editor
    */
   ref = (editor: Editor) => {
      this.editor = editor
      this.setState({editor})
   }

   /**
    * Render.
    *
    * @return {Element}
    */
   render() {
      return (
         <div>
            <MiniToolbar editor={this.state.editor} context={this} documentIsChanged={this.state.documentIsChanged} />
            <Editor
               spellCheck
               autoFocus
               plugins={this.plugins}
               placeholder="Enter some rich text..."
               ref={this.ref}
               value={this.state.value}
               onChange={this.onChange}
            />
         </div>
      )
   }

   /**
    * On change, save the new `value`.
    *
    * @param {Editor} editor
    */
   onChange = ({ value }: { value: Value }) => {
      let newJSONValue = value.toJSON()
      let documentIsChanged = JSON.stringify(newJSONValue) != JSON.stringify(this.state.oldJSONValue)
      this.setState({ value: value, documentIsChanged: documentIsChanged, newJSONValue: newJSONValue })
   }
}