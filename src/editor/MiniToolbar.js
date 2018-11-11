import React, { Component } from 'react'
import { Editor } from 'slate-react'
import imageExtensions from 'image-extensions'
import { Value, Block } from 'slate'

import initialValue from '../resources/value'
import { Button, Icon, Toolbar, Input } from './components'
import MiniEditor from './Editor'


/**
 * Define the default node type.
 */
const DEFAULT_NODE = 'paragraph'

type Props = any
type State = any

export default class MiniToolbar extends Component<Props, State> {
   editor: Editor = null
   insertImage = null

   componentDidUpdate(){
      this.editor = this.props.editor
      this.insertImage = this.props.context.insertImage
   }

   render() {
      return <Toolbar>
         {this.renderMarkButton('bold', 'format_bold')}
         {this.renderMarkButton('italic', 'format_italic')}
         {this.renderMarkButton('underlined', 'format_underlined')}
         {this.renderMarkButton('code', 'code')}
         {this.renderBlockButton('title', 'title')}
         {this.renderBlockButton('heading-one', 'looks_one')}
         {this.renderBlockButton('heading-two', 'looks_two')}
         {this.renderBlockButton('block-quote', 'format_quote')}
         {this.renderBlockButton('numbered-list', 'format_list_numbered')}
         {this.renderBlockButton('bulleted-list', 'format_list_bulleted')}
         <Button onMouseDown={this.onClickImage}>
            <Icon>image</Icon>
         </Button>
         <Button onMouseDown={this.onClickUpload}>
            <Icon>cloud_upload</Icon>
            <input ref="fileInput" type="file" id="file-input" onChange={this.onFileSelect} accept="image/*" multiple />
         </Button>
         <Button active={this.props.documentIsChanged && this.props.documentIsValid}
            onMouseDown={this.onClickSave}>
            <Icon>save</Icon>
         </Button>
         <Button active={this.props.documentIsChanged}
            onMouseDown={this.onClickRevertChanges}>
            <Icon>cancel</Icon>
         </Button>
         <span><label>Blocks Limit:<Input type='checkbox' active={this.props.isLimit} onChange={this.onClickLimit} checked={this.props.isLimit}
            onMouseDown={this.onClickRevertChanges} style={{height: '15px', width: '20px', marginLeft: '5px'}}/></label></span>
         {this.renderBlocksLimitInputBox()}
      </Toolbar>
   }

   /**
    * Check if the current selection has a mark with `type` in it.
    *
    * @return {Boolean}
    */
   hasMark = (type: string) => {
      const { value } = this.props.context.state
      return value.activeMarks.some(mark => mark.type == type)
   }

   /**
    * Check if the any of the currently selected blocks are of `type`.
    *
    * @return {Boolean}
    */
   hasBlock = (type: string) => {
      const { value } = this.props.context.state
      return value.blocks.some(node => node.type == type)
   }

   /**
    * Render the input box to set the maximum number of allowed top level blocks
    */
   renderBlocksLimitInputBox = () => {
      if (this.props.isLimit) {
         return <span><label>Maximum Blocks:<Input type='number' min={1} value={this.props.blocksLimit} onChange={this.onBlocksLimitChange}
            style={{position: 'absolute', padding: '10px', marginLeft: '5px', height: '20px', width: '100px'}}/></label></span>
      } else {
         // return <span style={{position: 'absolute', width: '200px'}}></span>
         return null
      }
   }

   /**
   * Render a mark-toggling toolbar button.
   *
   * @return {Element}
   */
   renderMarkButton = (type: string, icon: string) => {
      const isActive = this.hasMark(type)

      return (
         <Button
            active={isActive}
            onMouseDown={event => this.onClickMark(event, type)}
         >
            <Icon>{icon}</Icon>
         </Button>
      )
   }

   /**
    * Render a block-toggling toolbar button.
    *
    * @return {Element}
    */
   renderBlockButton = (type: string, icon: string) => {
      let isActive = this.hasBlock(type)

      if (['numbered-list', 'bulleted-list'].includes(type)) {
         const { value } = this.props.context.state
         const parent = value.blocks.first() ? value.document.getParent(value.blocks.first().key) : null
         isActive = this.hasBlock('list-item') && parent && parent.type === type
      }

      return (
         <Button
            active={isActive}
            onMouseDown={event => this.onClickBlock(event, type)}
         >
            <Icon>{icon}</Icon>
         </Button>
      )
   }

   /**
    * On file select from the file browser
    */
   onFileSelect = () => {
      for (const file of this.refs.fileInput.files) {
         const reader = new FileReader()
         const [mime] = file.type.split('/')
         if (mime !== 'image') continue

         reader.addEventListener('load', () => {
            this.editor.command(this.insertImage, reader.result)
         })

         reader.readAsDataURL(file)
      }
   }

   /**
    * On clicking the checkbox to set whether to limit the allowed number of top level blocks
    */
   onClickLimit = (event: any) => {
      this.props.context.setIsBlocksLimit(event.target.checked)
   }

   /**
    * On changing the maximum allowed number of top level blocks
    */
   onBlocksLimitChange = (event: any) => {
      this.props.context.setBlocksLimit(event.target.value)
   }

   /**
    * On clicking the save button to save the content in local store
    */
   onClickSave = (event: Event) => {
      if (!this.props.documentIsValid) return
      event.preventDefault()
      const contentJSON = this.props.context.state.value.toJSON()
      const content = JSON.stringify({blocksLimit: this.props.blocksLimit, isLimit: this.props.isLimit, value: contentJSON})
      localStorage.setItem('content', content)
      this.props.context.updateContent({blocksLimit: this.props.blocksLimit, isLimit: this.props.isLimit, value: contentJSON})
   }

   /**
    * On clicking the discard changes button
    */
   onClickRevertChanges = (event: Event) => {
      event.preventDefault()
      this.props.context.reloadContent()
   }

   /**
   * On clicking the image button, prompt for an image and insert it.
   */
   onClickImage = (event: Event) => {
      event.preventDefault()
      const src = window.prompt('Enter the URL of the image:')
      if (!src) return
      console.log(src)
      this.editor.command(this.insertImage, src)
   }

   /**
   * On clicking the upload button, open the file browser.
   */
   onClickUpload = (event: Event) => {
      event.preventDefault()
      let fileInput = this.refs.fileInput
      fileInput.click()
   }

   /**
    * When a mark button is clicked, toggle the current mark.
    */
   onClickMark = (event: Event, type: string) => {
      event.preventDefault()
      console.log(this)
      this.editor.toggleMark(type)
   }

   /**
    * When a block button is clicked, toggle the block type.
    */
   onClickBlock = (event: Event, type: string) => {
      event.preventDefault()

      const { editor } = this
      const { value } = editor
      const { document } = value

      // Handle everything but list buttons.
      if (type != 'bulleted-list' && type != 'numbered-list') {
         const isActive = this.hasBlock(type)
         const isList = this.hasBlock('list-item')

         if (isList) {
            editor
               .setBlocks(isActive ? DEFAULT_NODE : type)
               .unwrapBlock('bulleted-list')
               .unwrapBlock('numbered-list')
         } else {
            editor.setBlocks(isActive ? DEFAULT_NODE : type)
         }
      } else {
         // Handle the extra wrapping required for list buttons.
         const isList = this.hasBlock('list-item')
         const isType = value.blocks.some(block => {
            return !!document.getClosest(block.key, parent => parent.type == type)
         })

         if (isList && isType) {
            editor
               .setBlocks(DEFAULT_NODE)
               .unwrapBlock('bulleted-list')
               .unwrapBlock('numbered-list')
         } else if (isList) {
            editor
               .unwrapBlock(
                  type == 'bulleted-list' ? 'numbered-list' : 'bulleted-list'
               )
               .wrapBlock(type)
         } else {
            editor.setBlocks('list-item').wrapBlock(type)
         }
      }
   }
}