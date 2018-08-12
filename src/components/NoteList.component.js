import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { NavLink, withRouter } from 'react-router-dom';
import styled from 'styled-components';
import ReactList from 'react-list';
import Column from './Column.component';
import Row from './Row.component';

@withRouter
@observer
class NoteList extends Component {
  constructor(props) {
    super(props);
    this.renderItem = this.renderItem.bind(this);
  }

  renderItem(index, key) {
    const { notes } = this.props;
    const note = notes[index];

    return (
      <NoteListItem key={key} to={`/note/${note.id}`} activeClassName="active">
        {note.title}
      </NoteListItem>
    );
  }

  render() {
    const { notes, header, footer, ...rest } = this.props;

    return (
      <Root {...rest}>
        <StickyRow>{header}</StickyRow>
        <Notes>
          <ObserverReactList
            itemRenderer={this.renderItem}
            length={notes.length}
            type="uniform"
          />
        </Notes>
        <StickyRow>{footer}</StickyRow>
      </Root>
    );
  }
}

export default styled(NoteList)``;

const Root = Column.extend`
  height: 100%;
  max-width: 100%;
  flex-shrink: 0;
`;

const StickyRow = Row.extend``;

const Notes = Column.extend`
  flex: 1;
  overflow: auto;
`;

const NoteListItem = Row.withComponent(NavLink).extend`
  height: 100px;
  border-bottom: 1px solid #AAA;
  padding: 20px;
  text-decoration: none;
  color: black;
  flex: 0 0 auto;

  &.active {
    background-color: #CCC;
  }
`;

const ObserverReactList = observer(ReactList);
