import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/gfm/gfm';
import 'codemirror/mode/javascript/javascript';
import React, { Component } from 'react';
import { action, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import swal from 'sweetalert2';
import { Controlled as CodeMirror } from 'react-codemirror2';
import debounce from 'lodash/debounce';
import Column from './Column.component';
import Row from './Row.component';
import Input from './Input.component';
import BlockButton from './BlockButton.component';

@inject('store')
@observer
export default class EditNoteForm extends Component {
  codeMirrorOptions = {
    mode: 'gfm',
    lineWrapping: true,
  };

  handleContentRef = contentRef => {
    this.contentRef = contentRef
  };

  handleTitleRef = titleRef => {
    this.titleRef = titleRef;
  };

  @computed get loadingContent() {
    return this.props.note.content == null;
  }

  constructor(props) {
    super(props);
    this.save = this.save.bind(this);
    this.debouncedSave = debounce(this.save, 500, {maxWait: 3000});
  }

  async componentDidMount() {
    const { note } = this.props;
    if(!note.contentLoaded) {
      await this.loadNoteContent();
    }

    const { contentRef, titleRef } = this;
    const { location } = this.props;
    const autofocusContent = location.state && location.state.focus === 'content';
    const autofocusTitle = location.state && location.state.focus === 'title';

    if(autofocusContent && contentRef && contentRef.editor) {
      contentRef.editor.focus();
      contentRef.editor.setCursor(0, 0);
    } else if(autofocusTitle && titleRef) {
      titleRef.focus();
    }
  }

  componentDidUpdate() {
    const { note } = this.props;
    if(!note.contentLoaded) {
      this.loadNoteContent();
    }
  }

  @action
  async loadNoteContent() {
    const { note } = this.props;
    await note.fetchContent();
  }

  @action.bound
  handleContentChange(editor, data, value) {
    const { note } = this.props;
    note.updateContent(value);
    this.debouncedSave();
  }

  @action.bound
  handleTitleChange(event) {
    const { note } = this.props;
    note.set({title: event.target.value});
    this.debouncedSave();
  }

  @action.bound
  async handleDeleteClick(event) {
    const { value : deleteConfirmed } = await swal({
      title: 'Are you sure?',
      text: 'This cannot be undone.',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    });

    if(!deleteConfirmed) return;
    
    const { store, note } = this.props;
    this.props.history.push('/notes');
    await store.deleteNote(note);
  }

  async save() {
    await this.props.note.save();
  }

  componentWillUnmount() {
    this.save();
  }

  render() {
    const { note } = this.props;

    return (
      <Root>
        <Header>
          <TitleInput value={note.title} onChange={this.handleTitleChange} innerRef={this.handleTitleRef}/>

          <DeleteButton color="#C00" onClick={this.handleDeleteClick}>
            DELETE
          </DeleteButton>
          <ViewButton to={`/note/${note.id}`}>
            VIEW
          </ViewButton>
        </Header>
        <ContentContainer>
          {note.contentLoaded && 
            <ContentInput
              innerRef={this.handleContentRef}
              value={note.content}
              options={this.codeMirrorOptions}
              onBeforeChange={this.handleContentChange}
            />
          }
        </ContentContainer>
      </Root>
    );
  }
}

const headerHeight = 50;
const Root = Column.extend`
  height: 100%;
`;

const Header = Row.extend`
  height: ${headerHeight}px;
  border-bottom: 2px solid #CCC;
  padding: 10px 30px 10px 0;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
`;

const TitleInput = Input.extend`
  height: 100%;
  width: 100%;
  border: none;
  padding-left: 30px;
  font-size: 22px;
`;

const ContentContainer = Column.extend`
  overflow: auto;
  flex: 1 0 auto;
`;

const ContentInput = styled(CodeMirror)`
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: stretch;

  .CodeMirror {
    height: calc(100vh - ${headerHeight}px);
    font-family: inherit;
    font-size: inherit;
    width: 100%;
  }

  .CodeMirror-lines {
    margin: 30px 30px 10px 30px;
  }

  .CodeMirror-scroll {
    cursor: text;
  }
`;

const ViewButton = BlockButton.withComponent(Link).extend`
  flex-shrink: 0;
`;

const DeleteButton = BlockButton.extend`
  flex-shrink: 0;
`;
