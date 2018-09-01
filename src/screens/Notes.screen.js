import React, { Component } from 'react';
import { observable, action, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Switch, Route, Redirect } from 'react-router-dom';
import qs from 'query-string';
import Screen from '../components/Screen.component';
import NoteList from '../components/NoteList.component';
import NotebookList from '../components/NotebookList.component';
import Column from '../components/Column.component';
import SideBar, { sideBarWidth } from '../components/SideBar.component';
import NoteListSearchHeader from '../components/NoteListSearchHeader.component';
import CreateNoteForm from '../components/CreateNoteForm.component';
import EditNoteForm from '../components/EditNoteForm.component';
import RenderedNote from '../components/RenderedNote.component';
import Drawer from '../components/Drawer.component';
import withQuery from '../utils/withQuery';


@withQuery
@inject('store')
@observer
export default class Notes extends Component {
  @observable searchText = '';

  @computed get normalizedSearchText() {
    return this.searchText.toLowerCase().trim();
  }

  @computed get notebook() {
    const { store, query } = this.props;
    if(!query.notebook) return null;
    const notebookId = +query.notebook;
    return store.getNotebookById(notebookId);
  }

  @computed get searchedNotes() {
    const { normalizedSearchText, notebook } = this;
    const { store } = this.props;
    const { notes } = store;

    return (notebook || (normalizedSearchText && normalizedSearchText.length))
      ? notes.filter(note => {
        if(notebook && notebook.id !== note.notebookId) {
          return false;
        }
        return note.matchesSearch(normalizedSearchText);
      })
      : notes;
  }

  @action.bound
  handleSearchChange(event) {
    this.searchText = event.target.value;
  }

  @action.bound
  handleCloseNotebookDrawer() {
    const { location, history, query } = this.props;
    const { list, ...newQuery } = query;

    history.push({
      pathname: location.pathname,
      search: qs.stringify(newQuery),
    });
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

  renderNotebookList = () => {
    const { notebooks } = this.props.store;
    return (
      <NotebookList notebooks={notebooks}/>
    )
  }

  renderNoteList = () => {
    const { searchedNotes, searchText } = this;

    return (
      <StyledNoteList
        notes={searchedNotes}
        header={
          <NoteListSearchHeader
            searchValue={searchText}
            onSearchChange={this.handleSearchChange}
          />
        }
      />
    );
  };

  render() {
    const { query } = this.props;
    const showingNotebookDrawer = query.list === 'notebooks';

    return (
      <Root>
        <SideBar/>
        <ListContainer>{this.renderNoteList()}</ListContainer>
        <Drawer open={showingNotebookDrawer} onClickOutside={this.handleCloseNotebookDrawer}>
          {this.renderNotebookList}
        </Drawer>
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

const listWidth = 400;
const Root = Screen.extend`
  flex-direction: row;
`;

const ListContainer = Column.extend`
  width: ${listWidth}px;
  flex-shrink: 0;
  border-right: 2px solid #CCC;
`;

const StyledNoteList = NoteList.extend`
  width: 100%;
`;

const RouteContainer = Column.extend`
  flex: 1 0 auto;
  height: 100%;
  max-width: calc(100% - ${sideBarWidth + listWidth}px);
`;

function MissingNoteRedirect(props) {
  return (<Redirect to="/notes"/>);
}
