import React, {Component} from 'react'
import { Editor } from 'slate-react'
import { Value } from 'slate'

// Create our initial value...
const initialValue = Value.fromJSON({
   document: {
      nodes: [
         {
            object: 'block',
            type: 'paragraph',
            nodes: [
               {
                  object: 'text',
                  leaves: [
                     {
                        text: 'A line of text in a paragraph.',
                     },
                  ],
               },
            ],
         },
      ],
   },
})

type Props = {};
type State = {
   value: Value
};

// Define our editor...
export default class MiniEditor extends Component<Props, State> {
   // Set the initial value when the app is first constructed.
   state = {
      value: initialValue,
   };

   // On change, update the app's React state with the new editor value.
   onChange = ({ value } : {value: Value}) => {
      this.setState({ value })
   }

   // Render the editor.
   render() {
      return <Editor value={this.state.value} onChange={this.onChange} />
   }
}