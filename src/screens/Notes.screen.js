import React, { Component } from 'react';
import { observable, action, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Switch, Route, Redirect } from 'react-router-dom';
import debounce from 'lodash/debounce';
import Screen from '../components/Screen.component';
import NoteList from '../components/NoteList.component';
import Column from '../components/Column.component';
import SideBar, { sideBarWidth } from '../components/SideBar.component';
import NoteListSearchHeader from '../components/NoteListSearchHeader.component';
import CreateNoteForm from '../components/CreateNoteForm.component';
import EditNoteForm from '../components/EditNoteForm.component';
import RenderedNote from '../components/RenderedNote.component';

@inject('store')
@observer
export default class Notes extends Component {
  @observable searchText = '';
  @observable searchedNotes = [];

  constructor(props) {
    super(props);
    this.searchedNotes = props.store.notes;
    this.updateSearchedNotes = debounce(this.updateSearchedNotes.bind(this), 250, {maxWait: 1000});
  }

  @computed get normalizedSearchText() {
    return this.searchText.toLowerCase().trim();
  }

  updateSearchedNotes() {
    const { normalizedSearchText } = this;
    const { notes } = this.props.store;
    this.searchedNotes = normalizedSearchText && normalizedSearchText.length 
      ? notes.filter(note => note.matchesSearch(normalizedSearchText))
      : notes;
  }

  @action.bound
  handleSearchChange(event) {
    this.searchText = event.target.value;
    this.updateSearchedNotes();
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
        <SideBar/>
        <StyledNoteList
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

const noteListWidth = 400;
const Root = Screen.extend`
  flex-direction: row;
`;

const StyledNoteList = NoteList.extend`
  width: ${noteListWidth}px;
`;

const RouteContainer = Column.extend`
  flex: 1 0 auto;
  height: 100%;
  max-width: calc(100% - ${sideBarWidth + noteListWidth}px);
`;



function MissingNoteRedirect(props) {
  return (<Redirect to="/notes"/>);
}
