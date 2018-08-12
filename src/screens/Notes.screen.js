import React, { Component } from 'react';
import { observable, action, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Screen from '../components/Screen.component';
import NoteList from '../components/NoteList.component';
import Column from '../components/Column.component';
import NoteListSearchHeader from '../components/NoteListSearchHeader.component';
import CreateNoteForm from '../components/CreateNoteForm.component';
import EditNoteForm from '../components/EditNoteForm.component';
import RenderedNote from '../components/RenderedNote.component';

@inject('store')
@observer
export default class Notes extends Component {
  @observable searchText = '';

  @computed get normalizedSearchText() {
    return this.searchText.toLowerCase().trim();
  }

  @computed get searchedNotes() {
    const searchText = this.normalizedSearchText;
    const { notes } = this.props.store;

    return searchText && searchText.length 
      ? notes.filter(note => note.matchesSearch(searchText))
      : notes;
  }

  @action.bound
  handleSearchChange(event) {
    this.searchText = event.target.value;
  }

  getNoteById(noteId) {
    return this.props.store.notes.find(note => note.id === noteId);
  }

  renderCreateNote = props => {
    return (<CreateNoteForm {...props}/>);
  };

  renderEditNote = props => {
    const noteId = +props.match.params.noteId;
    const note = this.getNoteById(noteId);
    if(!note) {
      return (
        <MissingNoteRedirect/>
      );
    }
    return (
      <EditNoteForm {...props} note={note}/>
    );
  };

  renderNote = props => {
    const noteId = +props.match.params.noteId;
    const note = this.getNoteById(noteId);
    if(!note) {
      return (
        <MissingNoteRedirect/>
      );
    }
    return (
      <RenderedNote {...props} note={note}/>
    );
  };

  renderIndex = () => null;

  render() {
    const { searchedNotes, searchText } = this;

    return (
      <Root>
        <NoteList
          notes={searchedNotes}
          header={
            <NoteListSearchHeader
              searchValue={searchText}
              onSearchChange={this.handleSearchChange}
            />
          }
        />
        <RouteContainer>
          <Switch>
            <Route path="/note/new" render={this.renderCreateNote}/>
            <Route path="/note/:noteId/edit" render={this.renderEditNote}/>
            <Route path="/note/:noteId" render={this.renderNote}/>
            <Route path="/" render={this.renderIndex}/>
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
  max-width: calc(100% - 400px);
`;

function MissingNoteRedirect(props) {
  return (<Redirect to="/notes"/>);
}
