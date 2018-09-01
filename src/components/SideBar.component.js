import React from 'react';
import { NavLink } from 'react-router-dom';
import { Icon } from 'react-icons-kit';
import { ic_home } from 'react-icons-kit/md/ic_home';
import { ic_add_box } from 'react-icons-kit/md/ic_add_box';
import { books as ic_books } from 'react-icons-kit/icomoon/books';
import Column from './Column.component';
import BlockButton from './BlockButton.component';
import withQuery from '../utils/withQuery';

export const sideBarWidth = 80;

export default withQuery(function SideBar(props) {
  return (
    <Root>
      <SidePanelLink to="/">
        <Icon icon={ic_home} size={25}/>
      </SidePanelLink>
      <SidePanelLink to="/note/new">
        <Icon icon={ic_add_box} size={25}/>
      </SidePanelLink>
      <SidePanelLink to={{
        pathname: props.location.pathname,
        search: 'list=notebooks'
      }}>
        <Icon icon={ic_books} size={25}/>
      </SidePanelLink>
    </Root>
  );
});

const Root = Column.extend`
  width: ${sideBarWidth}px;
  background-color: #DFDFDF;
  align-items: center;
  padding-top: 30px;
`;

const SidePanelButton = BlockButton.extend`
  width: ${sideBarWidth * 0.5}px;
  height: ${sideBarWidth * 0.5}px;
  padding: 0;
  border: 1px solid #DFDFDF;
  border-radius: 50%;
  transition: background-color 0.2s, color 0.2s, border-color 0.2s;
  background-color: white;
  color: #623dd3;

  &:hover {
    background-color: #623dd3;
    border-color: #623dd3;
    color: white;
  }

  & + & {
    margin-top: 12px;
  }
`;

const SidePanelLink = SidePanelButton.withComponent(NavLink).extend`

`;
