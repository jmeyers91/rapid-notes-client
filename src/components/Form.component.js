import React, { Component } from 'react';
import styled from 'styled-components';

class Form extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const { onSubmit } = this.props;
    if(onSubmit) {
      onSubmit(event);
    }
  }

  render() {
    return (
      <form {...this.props} onSubmit={this.handleSubmit}/>
    );
  }
}

export default styled(Form)``;
