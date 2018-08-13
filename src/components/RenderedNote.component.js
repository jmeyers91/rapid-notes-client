import 'highlightjs/styles/hybrid.css';
import React, { Component } from 'react';
import { action } from 'mobx';
import { observer, inject } from 'mobx-react';
import styled from 'styled-components';
import { Link, withRouter } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import Column from './Column.component';
import Row from './Row.component';
import BlockButton from './BlockButton.component';
import { Highlight } from 'react-fast-highlight';
import highlightWorker from '../highlight.workerjs';

@withRouter
@inject('store')
@observer
export default class RenderedNote extends Component {
  componentDidMount() {
    const { note } = this.props;
    if(!note.contentLoaded) {
      this.loadNoteContent();
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
  async handleContentClick() {
    const { note, history } = this.props;
    history.push({
      pathname: note.routes.edit,
      state: { focus: 'content' }
    });
  }

  @action.bound
  async handleTitleClick() {
    const { note, history } = this.props;
    history.push({
      pathname: note.routes.edit,
      state: { focus: 'title' }
    });
  }

  render() {
    const { note } = this.props;

    return (
      <Root>
        <Header>
          <Title onDoubleClick={this.handleTitleClick}>{note.title}</Title>
          <EditButton to={note.routes.edit}>EDIT</EditButton>
        </Header>
        <Content onDoubleClick={this.handleContentClick}>
          <MarkdownRenderer source={note.content}/>
        </Content>
      </Root>
    );
  }
}

class MarkdownRenderer extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    // avoid potentially costly rerenders
    return (
      nextProps.source !== this.props.source
    );
  }

  render() {
    const { source } = this.props;
    const transformedSource = source ? source.replace(/\t/g, '  ') : source;
    return (
      <ReactMarkdown source={transformedSource} renderers={markdownRenderers} ref={this.handleRef}/>
    );
  }
}

const markdownRenderers = { code: codeWrapper };
function codeWrapper({ language, value }) {
  return (
    <Highlight languages={language ? [language] : null} worker={highlightWorker()}>
      {value}
    </Highlight>
  );
}

const Root = Column.extend`
  width: 100%;
  height: 100%;
  overflow: auto;
`;

const Header = Row.extend`
  height: 50px;
  padding: 10px 30px 10px 30px;
  flex-shrink: 0;
  border-bottom: 2px solid #CCC;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.div`
  font-size: 22px;
`;

const Content = Column.extend`
  overflow: auto;
  flex: 1 1 auto;
  padding: 34px;

  > div > *:first-child {
    margin-top: 0;
  }
`;

const EditButton = BlockButton.withComponent(Link).extend`
  flex-shrink: 0;
`;
