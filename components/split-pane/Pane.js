'use strict';

import React from 'react';
import VendorPrefix from 'react-vendor-prefix';


export default React.createClass({


    getInitialState() {
        return {};
    },


    render() {
        const {split, fixedHeight} = this.props;
        const classes = ['Pane', split];

        let style = {
            position: 'relative',
            outline: 'none',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto'
        }

        if (fixedHeight){
          if (split === 'horizontal') {
              style.height = fixedHeight
          } else if (split === 'vertical'){
              style.width = fixedHeight
          }
        } else {
          style.flex = 1
        }

        if (this.state.size) {
            if (split === 'vertical') {
                style.width = this.state.size;
            } else {
                style.height = this.state.size;
                style.display = 'flex';
            }
            style.flex = 'none';
        }
        const prefixed = VendorPrefix.prefix({styles: style});
        return (<div className={classes.join(' ')} style={prefixed.styles}>{this.props.children}</div>);
    }
});
