import React, { Component } from 'react';
import styled from 'styled-components';
import { action } from 'mobx';
import Column from './Column.component';

class Drawer extends Component {
  @action.bound
  handleClick(event) {
    const { open, onClickOutside } = this.props;
    if (open && onClickOutside && event.target === event.currentTarget) {
      onClickOutside();
    }
  }

  render() {
    const { open, children } = this.props;
    let renderedChildren;

    if(typeof children === 'function')  {
      if(open) {
        renderedChildren = children();
      } else {
        renderedChildren = null;
      }
    } else {
      renderedChildren = children;
    }

    return (
      <Root {...this.props} onClick={this.handleClick}>
        <Window open={open}>
          {renderedChildren}
        </Window>
      </Root>
    );
  }
}

export default styled(Drawer)``;

const Root = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: ${props => props.open ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0)'};
  transition: background-color 0.2s;
  pointer-events: ${props => props.open ? 'auto' : 'none'};
  z-index: 900;
`;

const Window = Column.extend`
  width: 250px;
  max-width: 100vw;
  height: 100vh;
  background-color: red;
  transition: transform 0.2s;
  transform: translate(${props => (props.open ? '0' : '-250px')}, 0);
  pointer-events: ${props => (props.open ? 'auto' : 'none')};
`;
