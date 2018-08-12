import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Switch, Route } from 'react-router-dom';
import Screen from '../components/Screen.component';
import NoteList from '../components/NoteList.component';
import Column from '../components/Column.component';
import EditNoteForm from '../components/EditNoteForm.component';
import RenderedNote from '../components/RenderedNote.component';

@inject('store')
@observer
export default class Notes extends Component {
  getNoteById(noteId) {
    return this.props.store.notes.find(note => note.id === noteId);
  }

  renderCreateNoteForm = props => {
    console.log('renderCreateNoteForm', 'TODO: create note form')
    return (
      null
    );
  };

  renderEditNoteForm = props => {
    const noteId = +props.match.params.noteId;
    const note = this.getNoteById(noteId);
    return (
      <EditNoteForm {...props} note={note}/>
    );
  };

  renderNote = props => {
    const noteId = +props.match.params.noteId;
    const note = this.getNoteById(noteId);
    return (
      <RenderedNote {...props} note={note}/>
    );
  };

  render() {
    const { store } = this.props;
    const { notes } = store;

    return (
      <Root>
        <NoteList notes={notes}/>
        <RouteContainer>
          <Switch>
            <Route path="/note/new" render={this.renderCreateNoteForm}/>
            <Route path="/note/:noteId/edit" render={this.renderEditNoteForm}/>
            <Route path="/note/:noteId" render={this.renderNote}/>
            <Route path="/" render={this.renderCreateNoteForm}/>
          </Switch>
        </RouteContainer>
      </Root>
    );
  }
}

const Root = Screen.extend`
  flex-direction: row;
`;

const RouteContainer = Column.extend`
  flex: 1 0 auto;
  height: 100%;
  // border: 1px solid red;
  max-width: calc(100% - 400px);
`;
