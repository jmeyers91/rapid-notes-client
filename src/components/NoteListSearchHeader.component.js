import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Input from './Input.component';
import Row from './Row.component';

export default styled(props => {
  const { searchValue, onSearchChange } = props;

  return (
    <Row {...props}>
      <SearchInput value={searchValue} onChange={onSearchChange}/>
      <CreateLink to="/note/new">Create</CreateLink>
    </Row>
  );
})`
  height: 50px;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  padding: 0 20px 0 20px;
`;

const SearchInput = Input.extend`
  flex: 1;
  font-size: 20px;
`;

const CreateLink = styled(Link)`
  flex-shrink: 0;
  margin-left: 20px;
`;
