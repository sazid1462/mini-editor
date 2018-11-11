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
import TopBlocksCount from '../plugins/top-block-nodes-counter'
import MiniToolbar from './MiniToolbar'

type Props = any;
type State = {
   value: Value,
   isLimit: boolean,
   blocksLimit: number,
   oldJSONValue: Value,
   newJSONValue: Value,
   documentIsChanged: boolean,
   documentIsValid: boolean,
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
      DropPastePlugin({ handlerType: 'onPaste', insertImage: this.insertImage }),
      TopBlocksCount()
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
      let storedJSON = existingValue || initialValue
      // Set the initial value when the app is first constructed.
      let  value = Value.fromJSON(storedJSON.value)
      this.state = {
         oldJSONValue: storedJSON,
         newJSONValue: storedJSON,
         value: value,
         isLimit: storedJSON.isLimit,
         blocksLimit: storedJSON.blocksLimit,
         documentIsChanged: false,
         documentIsValid: true,
         editor: {}
      }
   }

   reloadContent = () => {
      this.setState({
         value: Value.fromJSON(this.state.oldJSONValue.value), 
         newJSONValue: this.state.oldJSONValue, 
         documentIsValid: true,
         isLimit: this.state.oldJSONValue.isLimit,
         blocksLimit: this.state.oldJSONValue.blocksLimit,
         documentIsChanged: false
      })
   }

   updateContent = (content: JSON) => {
      this.setState({oldJSONValue: content, newJSONValue: content, documentIsChanged: false})
   }

   setIsBlocksLimit = (isLimit: boolean) => {
      let newJSONValue = Object.assign({}, this.state.oldJSONValue, {isLimit: isLimit})
      let documentIsChanged = JSON.stringify(newJSONValue) != JSON.stringify(this.state.oldJSONValue)
      let documentIsValid = !(this.state.isLimit && (this.editor.getBlocksCount() > this.state.blocksLimit))
      this.setState({isLimit: isLimit, newJSONValue: newJSONValue, documentIsChanged: documentIsChanged, documentIsValid: documentIsValid})
   }

   setBlocksLimit = (limit: number) => {
      let newJSONValue = Object.assign({}, this.state.oldJSONValue, {blocksLimit: limit})
      let documentIsChanged = JSON.stringify(newJSONValue) != JSON.stringify(this.state.oldJSONValue)
      let documentIsValid = !(this.state.isLimit && (this.editor.getBlocksCount() > limit))
      this.setState({blocksLimit: limit, newJSONValue: newJSONValue, documentIsChanged: documentIsChanged, documentIsValid: documentIsValid})
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
            <MiniToolbar editor={this.state.editor} context={this} isLimit={this.state.isLimit} blocksLimit={this.state.blocksLimit}
               documentIsChanged={this.state.documentIsChanged} documentIsValid={this.state.documentIsValid} />
            <div style={{top: '40px', position: 'relative', overflowY: "auto", maxHeight: 'calc(100vh - 60px)', background: 'white'}}>
               <Editor style={{ padding: '20px', minHeight: 'calc(100vh - 100px)' }}
                  spellCheck
                  autoFocus
                  plugins={this.plugins}
                  placeholder="Enter some rich text..."
                  ref={this.ref}
                  value={this.state.value}
                  onChange={this.onChange}
               />
            </div>
         </div>
      )
   }

   /**
    * On change, save the new `value`.
    *
    * @param {Editor} editor
    */
   onChange = ({ value }: { value: Value }) => {
      let newJSONValue = {blocksLimit: this.state.blocksLimit, isLimit: this.state.isLimit, value: value.toJSON()}
      let documentIsChanged = JSON.stringify(newJSONValue) != JSON.stringify(this.state.oldJSONValue)
      let documentIsValid = !(this.state.isLimit && (this.editor.getBlocksCount() > this.state.blocksLimit))
      console.log(value.toJSON())
      this.setState({ value: value, documentIsChanged: documentIsChanged, newJSONValue: newJSONValue, documentIsValid: documentIsValid })
   }
}