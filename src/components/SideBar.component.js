import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { Icon } from 'react-icons-kit';
import { ic_home } from 'react-icons-kit/md/ic_home';
import { ic_add_box } from 'react-icons-kit/md/ic_add_box';
import { books as ic_books } from 'react-icons-kit/icomoon/books';
import Column from './Column.component';
import BlockButton from './BlockButton.component';

export const sideBarWidth = 40;

export default withRouter(function SideBar(props) {
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
  background-color: #555;
`;

const SidePanelButton = BlockButton.extend`
  width: 100%;
  padding: 0;
`;

const SidePanelLink = SidePanelButton.withComponent(NavLink).extend`

`;
