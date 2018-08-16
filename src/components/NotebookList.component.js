import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Link, withRouter } from 'react-router-dom';
import styled from 'styled-components';
import ReactList from 'react-list';
import Column from './Column.component';
import Row from './Row.component';
import withQuery from '../utils/withQuery';

@withRouter
@withQuery
@observer
class NotebookList extends Component {
  constructor(props) {
    super(props);
    this.renderItem = this.renderItem.bind(this);
  }

  renderItem(index, key) {
    const { query } = this.props;
    const { location, notebooks } = this.props;
    const notebook = notebooks[index];
    const active = query.notebook && ((+query.notebook) === notebook.id);

    return (
      <NotebookListItem key={key} className={active ? 'active' : null}     to={{
        pathname: location.pathname,
        search: `?notebook=${notebook.id}`
      }}>
        {notebook.name}
      </NotebookListItem>
    );
  }

  render() {
    const { notebooks, header, footer, query, ...rest } = this.props;
    return (
      <Root {...rest}>
        <StickyRow>{header}</StickyRow>
        <Notebooks>
          <ObserverReactList
            itemRenderer={this.renderItem}
            length={notebooks.length}
            type="uniform"
          />
        </Notebooks>
        <StickyRow>{footer}</StickyRow>
      </Root>
    );
  }
}

export default styled(NotebookList)``;

const Root = Column.extend`
  height: 100%;
  max-width: 100%;
  flex-shrink: 0;
`;

const StickyRow = Row.extend``;

const Notebooks = Column.extend`
  flex: 1;
  overflow: auto;
`;

const NotebookListItem = Row.withComponent(Link).extend`
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
