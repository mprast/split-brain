import React, { Component, PropTypes } from "react";

const SplitBrain = {
    Chunk: class Chunk extends Component {
        render() {
            const error = `You instantiated SplitBrain.Chunk directly, which shouldn't happen. Usually 
                           babel-plugin-split-brain replaces SplitBrain.Chunk with 
                           SplitBrain.Chunk_Intermediate. Please double check that the Split-Brain 
                           babel plugin is added to your babel config.`;
            throw new Error(error);
        }
    },

    Chunk_Intermediate: class Chunk_Intermediate extends Component {
        constructor(props) {
            super(props);
            this.state = {child: null}
        }

        render() {
            if(this.state.child) {
                if (this.state.child.length() != 1) {
                    throw new Error("A Chunk element should have exactly one child.");
                }
                return React.Children.only(this.state.child);
            }

            // this.props.children will have a Promise that will 
            // lazy-load the children with webpack (since 
            // we used babel-plugin-split-brain to wrap the 
            // actual children in a call to require.ensure)
            const loadChildren = this.props.children;

            // the babel plugin ensures that SplitBrain.Chunk 
            // has only one child component
            loadChildren.then((newChild) => {
                this.setState({child: newChild})
            }); 

            return null;
        }
    },
    Passthrough: class Passthrough extends Component {
        render() {
            if (this.state.child.length != 1) {
                throw new Error("A Chunk element should have exactly one child.");
            }
            return React.Children.only(this.state.child);
        }
    }
}

export { SplitBrain };
