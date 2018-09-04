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
    const { side='left', width=300, open, children } = this.props;
    let renderedChildren;
    let DrawerComponent;

    if(typeof children === 'function')  {
      if(open) {
        renderedChildren = children();
      } else {
        renderedChildren = null;
      }
    } else {
      renderedChildren = children;
    }

    if(side === 'left') DrawerComponent = LeftDrawer;
    else if(side === 'right') DrawerComponent = RightDrawer;
    else throw new Error(`Invalid drawer side "${side}"`);

    return (
      <DrawerComponent {...this.props} onClick={this.handleClick} width={width}>
        {renderedChildren}
      </DrawerComponent>
    );
  }
}

function LeftDrawer(props) {
  const { open, width, children } = props;

  return (
    <Root {...props}>
      <LeftWindow open={open} width={width}>
        {children}
      </LeftWindow>
    </Root>
  );
}

function RightDrawer(props) {
  const { open, width, children } = props;

  return (
    <Root {...props}>
      <RightWindow open={open} width={width}>
        {children}
      </RightWindow>
    </Root>
  );
}

export default styled(Drawer)``;

const Root = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  transition: background-color 0.2s;
  z-index: 900;
  background-color: ${props => props.open ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0)'};
  pointer-events: ${props => props.open ? 'auto' : 'none'};
`;

const Window = Column.extend`
  pointer-events: ${props => props.open ? 'auto' : 'none'};
  width: ${props => props.width}px;
  position: absolute;
  top: 0;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  background-color: white;
  overflow: auto;
`;

const LeftWindow = Window.extend`
  left: ${props => props.open ? '0' : ('-' + props.width)}px;
  transition: left 0.2s;
  box-shadow: 3px 0px 10px rgba(0,0,0,0.15);
`;

const RightWindow = Window.extend`
  right: ${props => props.open ? '0' : ('-' + props.width)}px;
  transition: right 0.2s;
  box-shadow: -3px 0px 10px rgba(0,0,0,0.15);
`;
