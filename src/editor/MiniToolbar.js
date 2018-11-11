import React, { Component } from 'react'
import { Editor } from 'slate-react'
import imageExtensions from 'image-extensions'
import { Value, Block } from 'slate'

import initialValue from '../resources/value'
import { Button, Icon, Toolbar } from './components'
import MiniEditor from './Editor'


/**
 * Define the default node type.
 *
 * @type {String}
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
      // if (this.editor && this.editor.value)
      //    console.log(this.editor.value.document.text, this.props.context.state.value.document.text)
      // let isChanged = (this.editor && this.editor.value) ? this.editor.value.document.text != this.props.context.state.value.document.text : false
      return <Toolbar>
         {this.renderMarkButton('bold', 'format_bold')}
         {this.renderMarkButton('italic', 'format_italic')}
         {this.renderMarkButton('underlined', 'format_underlined')}
         {this.renderMarkButton('code', 'code')}
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
         <Button active={this.props.documentIsChanged}
            onMouseDown={this.onClickSave}>
            <Icon>save</Icon>
         </Button>
         <Button active={this.props.documentIsChanged}
            onMouseDown={this.onClickRevertChanges}>
            <Icon>cancel</Icon>
         </Button>
      </Toolbar>
   }

   /**
    * Check if the current selection has a mark with `type` in it.
    *
    * @param {String} type
    * @return {Boolean}
    */
   hasMark = (type: string) => {
      const { value } = this.props.context.state
      return value.activeMarks.some(mark => mark.type == type)
   }

   /**
    * Check if the any of the currently selected blocks are of `type`.
    *
    * @param {String} type
    * @return {Boolean}
    */
   hasBlock = (type: string) => {
      const { value } = this.props.context.state
      return value.blocks.some(node => node.type == type)
   }

   /**
   * Render a mark-toggling toolbar button.
   *
   * @param {String} type
   * @param {String} icon
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
    * @param {String} type
    * @param {String} icon
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

   onClickSave = (event: Event) => {
      event.preventDefault()
      const contentJSON = this.props.context.state.value.toJSON()
      const content = JSON.stringify(contentJSON)
      localStorage.setItem('content', content)
      this.props.context.updateContent(contentJSON)
   }

   onClickRevertChanges = (event: Event) => {
      event.preventDefault()
      this.props.context.reloadContent()
   }

   /**
   * On clicking the image button, prompt for an image and insert it.
   *
   * @param {Event} event
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
   *
   * @param {Event} event
   */
   onClickUpload = (event: Event) => {
      event.preventDefault()
      let fileInput = this.refs.fileInput
      fileInput.click()
   }

   /**
    * When a mark button is clicked, toggle the current mark.
    *
    * @param {Event} event
    * @param {String} type
    */
   onClickMark = (event: Event, type: string) => {
      event.preventDefault()
      console.log(this)
      this.editor.toggleMark(type)
   }

   /**
    * When a block button is clicked, toggle the block type.
    *
    * @param {Event} event
    * @param {String} type
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