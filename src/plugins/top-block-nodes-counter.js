import React from 'react'
import { Editor } from 'slate-react'
import styled from 'react-emotion'

const TopBlocksCounter = styled('span')`
   margin-top: 10px;
   padding: 12px;
   padding-right: 17px;
   background-color: #dadada;
   display: block;
   text-align: right;
`
type Props = any;

export default function TopBlocksCount(options: any) {
   let totalBlocksCount = 0
   return {
      renderEditor(props: Props, editor: Editor, next: any) {
         const children = next()
         const blocksCount = props.value.document.nodes
            .reduce((memo, b) => memo + (b.object=='block' ? 1 : 0), 0)
         totalBlocksCount = blocksCount
         editor.getBlocksCount = () => {
            return totalBlocksCount
         }
         return (
            <div>
               <div>{children}</div>
               <TopBlocksCounter>Top Blocks: {blocksCount}</TopBlocksCounter>
            </div>
         )
      }
   }
}