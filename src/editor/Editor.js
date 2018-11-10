import React, { Component } from 'react'
import { Editor } from 'slate-react'
import { Value } from 'slate'
import initialValue from '../resources/value'
import { Button, Icon, Toolbar } from './components'
import TextStylePlugin from '../plugins/text-style-plugin'
import NodeRenderer from '../plugins/node-renderer'
import MarkRenderer from '../plugins/mark-renderer'

/**
 * Define the default node type.
 *
 * @type {String}
 */
const DEFAULT_NODE = 'paragraph'

type Props = any;
type State = {
   value: Value
};

// Define our editor...
export default class MiniEditor extends Component<Props, State> {
   // Set the initial value when the app is first constructed.
   state = {
      value: Value.fromJSON(initialValue),
   };
   editor = {}
   plugins = [
      TextStylePlugin(),
      NodeRenderer(),
      MarkRenderer()
   ]

   /**
   * Check if the current selection has a mark with `type` in it.
   *
   * @param {String} type
   * @return {Boolean}
   */
   hasMark = (type: string) => {
      const { value } = this.state
      return value.activeMarks.some(mark => mark.type == type)
   }

   /**
    * Check if the any of the currently selected blocks are of `type`.
    *
    * @param {String} type
    * @return {Boolean}
    */
   hasBlock = (type: string) => {
      const { value } = this.state
      return value.blocks.some(node => node.type == type)
   }

   /**
    * Store a reference to the `editor`.
    *
    * @param {Editor} editor
    */
   ref = (editor: Editor) => {
      this.editor = editor
   }

   /**
    * Render.
    *
    * @return {Element}
    */
   render() {
      return (
         <div>
            <Toolbar>
               {this.renderMarkButton('bold', 'format_bold')}
               {this.renderMarkButton('italic', 'format_italic')}
               {this.renderMarkButton('underlined', 'format_underlined')}
               {this.renderMarkButton('code', 'code')}
               {this.renderBlockButton('heading-one', 'looks_one')}
               {this.renderBlockButton('heading-two', 'looks_two')}
               {this.renderBlockButton('block-quote', 'format_quote')}
               {this.renderBlockButton('numbered-list', 'format_list_numbered')}
               {this.renderBlockButton('bulleted-list', 'format_list_bulleted')}
            </Toolbar>
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
         const { value } = this.state
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
    * On change, save the new `value`.
    *
    * @param {Editor} editor
    */
   onChange = ({ value }:{ value: Value }) => {
      this.setState({ value })
   }

   /**
    * When a mark button is clicked, toggle the current mark.
    *
    * @param {Event} event
    * @param {String} type
    */
   onClickMark = (event: Event, type: string) => {
      event.preventDefault()
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