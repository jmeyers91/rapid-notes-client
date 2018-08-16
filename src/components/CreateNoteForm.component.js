import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Redirect } from 'react-router-dom';
import SpinnerFill from '../components/SpinnerFill.component';

@inject('store')
@observer
export default class CreateNoteForm extends Component {
  @observable note = null;

  @action
  async createNote() {
    const { store } = this.props;
    this.note = await store.createNote();
  }

  componentDidMount() {
    this.createNote();  
  }

  render() {
    const { note } = this;

    if(note) {
      return (
        <Redirect to={{
          pathname: note.routes.edit,
          state: {focus: 'title'}
        }}/>
      );
    }

    return (<SpinnerFill/>);
  }
}
