import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/gfm/gfm';
import 'codemirror/mode/javascript/javascript';
import React, { Component } from 'react';
import { observable, action, computed, runInAction } from 'mobx';
import { observer, inject } from 'mobx-react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import swal from 'sweetalert2';
import { Controlled as CodeMirror } from 'react-codemirror2';
import { ic_file_upload } from 'react-icons-kit/md/ic_file_upload';
import { ic_folder } from 'react-icons-kit/md/ic_folder';
import { Icon } from 'react-icons-kit';
import debounce from 'lodash/debounce';
import Column from './Column.component';
import Row from './Row.component';
import Input from './Input.component';
import BlockButton from './BlockButton.component';
import Drawer from './Drawer.component';
import FileListItem from './FileListItem.component';

@inject('store')
@observer
export default class EditNoteForm extends Component {
  fileInputRef = React.createRef();
  codeMirrorOptions = {
    mode: 'gfm',
    lineWrapping: true,
  };

  @observable stagedTitle = '';
  @observable stagedContent = '';
  @observable attachmentsOpen = false;
  @observable fileInputKey = 1;

  @computed get loadingContent() {
    return this.props.note.content == null;
  }

  constructor(props) {
    super(props);
    this.save = this.save.bind(this);
    this.debouncedSave = debounce(this.save, 500, {maxWait: 3000});
  }

  handleContentRef = contentRef => {
    this.contentRef = contentRef
  };

  handleTitleRef = titleRef => {
    this.titleRef = titleRef;
  };

  async componentDidMount() {
    const { note } = this.props;
    if(!note.contentLoaded) {
      await this.loadNoteContent();
    } else {
      this.stagedTitle = note.title;
      this.stagedContent = note.savedContent;
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

  componentDidUpdate(prevProps) {
    const { note } = this.props;
    if(!note.contentLoaded && !note.loadingContent) {
      this.loadNoteContent();
    } else if(prevProps.note.id !== note.id) {
      this.stagedTitle = note.title;
      this.stagedContent = note.savedContent;
    }
  }

  @action.bound
  handleContentChange(editor, data, value) {
    this.stagedContent = value.replace(/\t/g, '  ');
    this.debouncedSave();
  }

  @action.bound
  handleTitleChange(event) {
    this.stagedTitle = event.target.value;
    this.debouncedSave();
  }

  @action.bound
  async handleFileInputChange(event) {
    const { store, note } = this.props;
    const files = Array.from(event.target.files);

    await store.addNoteAttachments(note, files);
    this.fileInputKey += 1;
  }

  @action.bound
  async handleDeleteClick() {
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

  @action.bound
  async handleAttachmentsToggle() {
    this.attachmentsOpen = !this.attachmentsOpen;
  }

  @action.bound
  handleUploadClick() {
    this.fileInputRef.current.click();
  }

  @action
  async loadNoteContent() {
    const { note } = this.props;
    this.stagedTitle = note.title;
    await note.fetchContent();
    runInAction(() => {
      this.stagedContent = note.content;
    });
  }

  @action
  save() {
    const { note } = this.props;
    this.title = this.stagedTitle;
    note.setContent(this.stagedContent);
    note.save();
  }

  renderNoteAttachments = () => {
    const { note } = this.props;
    const { attachments } = note;
    if(!attachments) return null;

    return attachments.map(attachment =>
      <FileListItem
        key={attachment.id}
        file={attachment.file}
      />
    );
  };

  render() {
    const { note } = this.props;
    const {
      stagedTitle,
      stagedContent,
      fileInputRef,
      attachmentsOpen,
      fileInputKey,
    } = this;

    return (
      <Root>
        <Drawer open={attachmentsOpen} side="right" onClickOutside={this.handleAttachmentsToggle}>
          {this.renderNoteAttachments}
        </Drawer>
        <input multiple
          key={fileInputKey}
          style={{display: 'none'}}
          ref={fileInputRef}
          type="file"
          onChange={this.handleFileInputChange}
        />
        <Header>
          <TitleInput
            value={stagedTitle}
            onChange={this.handleTitleChange}
            innerRef={this.handleTitleRef}
          />
          <DeleteButton color="#C00" onClick={this.handleDeleteClick}>
            DELETE
          </DeleteButton>
          <ViewButton to={`/note/${note.id}`}>
            VIEW
          </ViewButton>
        </Header>
        <ContentContainer>
          <Toolbar>
            <ToolbarButton onClick={this.handleUploadClick}>
              <Icon icon={ic_file_upload} size={25}/>
            </ToolbarButton>
            <ToolbarButton onClick={this.handleAttachmentsToggle}>
              <Icon icon={ic_folder} size={25}/>
            </ToolbarButton>
          </Toolbar>
          {note.contentLoaded && 
            <ContentInput
              innerRef={this.handleContentRef}
              value={stagedContent}
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
  position: relative;
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

const Toolbar = Row.extend`
  height: 30px;
  border-bottom: 2px solid #CCC;
  align-items: center;
  justify-content: flex-end;
  padding: 0 20px 0 20px;
`;

const ToolbarButton = Column.extend`
  width: 30px;
  height: 100%;
  cursor: pointer;
  justify-content: center;
  align-items: center;

  & + & {
    margin-left: 10px;
  }
`;
