'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Pane from './Pane';
import Resizer from './Resizer';
import VendorPrefix from 'react-vendor-prefix';


export default React.createClass({

    getInitialState() {
        return {
            active: false,
            resized: false
        };
    },


    getDefaultProps() {
        return {
            split: 'vertical',
            minSize: 0
        };
    },


    componentDidMount() {
        document.addEventListener('mouseup', this.onMouseUp);
        document.addEventListener('mousemove', this.onMouseMove);
        const ref = this.refs.pane1;
        if (ref && this.props.defaultSize && !this.state.resized) {
            ref.setState({
                size: this.props.defaultSize
            });
        }
    },


    componentWillUnmount() {
        document.removeEventListener('mouseup', this.onMouseUp);
        document.removeEventListener('mousemove', this.onMouseMove);
    },


    onMouseDown(event) {
        let position = this.props.split === 'vertical' ? event.clientX : event.clientY;
        this.setState({
            active: true,
            position: position
        });
    },


    onMouseMove(event) {
        if (this.state.active) {
            const ref = this.refs.pane1;
            if (ref) {
                const node = ReactDOM.findDOMNode(ref);
                if (node.getBoundingClientRect) {
                    const width = node.getBoundingClientRect().width;
                    const height = node.getBoundingClientRect().height;
                    const current = this.props.split === 'vertical' ? event.clientX : event.clientY;
                    const size = this.props.split === 'vertical' ? width : height;
                    const position = this.state.position;

                    const newSize = size - (position - current);
                    this.setState({
                        position: current,
                        resized: true
                    });

                    if (newSize >= this.props.minSize) {
                        if (this.props.onChange) {
                          this.props.onChange(newSize);
                        }
                        ref.setState({
                            size: newSize
                        });
                    }
                }
            }
        }
    },


    onMouseUp() {
        this.setState({
            active: false
        });
    },


    merge: function (into, obj) {
        for (let attr in obj) {
            into[attr] = obj[attr];
        }
    },


    render() {

        const {split, reverse} = this.props

        let style = {
            display: 'flex',
            flex: 1,
            position: 'relative',
            outline: 'none',
            overflow: 'hidden'
            //userSelect: 'none'
        };

        if (split === 'vertical') {
            this.merge(style, {
                flexDirection: 'row',
                height: '100%',
                position: 'absolute',
                left: 0,
                right: 0
            });
        } else {
            this.merge(style, {
                flexDirection: 'column',
                height: '100%',
                minHeight: '100%',
                position: 'absolute',
                top: 0,
                bottom: 0,
                width: '100%'
            });
        }

        const children = this.props.children;
        const {resizable, minSize} = this.props
        const classes = ['SplitPane', split];
        const prefixed = VendorPrefix.prefix({styles: style});

        const css = `
        .Resizer {
    background: #000;
    opacity: .2;
    z-index: 1;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    -moz-background-clip: padding;
    -webkit-background-clip: padding;
    background-clip: padding-box;
}

 .Resizer:hover {
    -webkit-transition: all 2s ease;
    transition: all 2s ease;
}

 .Resizer.horizontal {
    height: 11px;
    margin: -5px 0;
    border-top: 5px solid rgba(255, 255, 255, 0);
    border-bottom: 5px solid rgba(255, 255, 255, 0);
    cursor: row-resize;
    width: 100%;
}

.Resizer.horizontal:hover {
    border-top: 5px solid rgba(0, 0, 0, 0.5);
    border-bottom: 5px solid rgba(0, 0, 0, 0.5);
}

.Resizer.vertical {
    width: 11px;
    margin: 0 -5px;
    border-left: 5px solid rgba(255, 255, 255, 0);
    border-right: 5px solid rgba(255, 255, 255, 0);
    cursor: col-resize;
    height: 100%;
}

.Resizer.vertical:hover {
    border-left: 5px solid rgba(0, 0, 0, 0.5);
    border-right: 5px solid rgba(0, 0, 0, 0.5);
}
`

  const first = reverse ? children[1] : children[0]
  const second = reverse ? children[0] : children[1]

    // TODO: Dry this
    if (reverse){
      return (
        <div>
          {resizable ? <style>{css}</style> : ''}
          <div className={classes.join(' ')} style={prefixed.styles} ref="splitPane">
              <Pane ref="pane1" key="pane1" split={split}>{children[0]}</Pane>
              <Resizer ref="resizer" key="resizer" onMouseDown={this.onMouseDown} split={split} />
              <Pane ref="pane2" key="pane2" fixedHeight={minSize} split={split}>{children[1]}</Pane>
          </div>
        </div>
      )
    } else {
        return (
          <div>
            {resizable ? <style>{css}</style> : ''}
            <div className={classes.join(' ')} style={prefixed.styles} ref="splitPane">
                <Pane ref="pane1" key="pane1" fixedHeight={minSize} split={split}>{children[0]}</Pane>
                <Resizer ref="resizer" key="resizer" onMouseDown={this.onMouseDown} split={split} />
                <Pane ref="pane2" key="pane2" split={split}>{children[1]}</Pane>
            </div>
          </div>
        )
    }
  }

});
