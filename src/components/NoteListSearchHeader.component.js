import React from 'react';
import styled from 'styled-components';
import Input from './Input.component';
import Row from './Row.component';

export default styled(props => {
  const { searchValue, onSearchChange } = props;
  return (
    <Row {...props}>
      <SearchInput
        value={searchValue}
        onChange={onSearchChange}
        placeholder="Search"
      />
    </Row>
  );
})`
  height: 50px;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  border-bottom: 2px solid #CCC;
`;

const SearchInput = Input.extend`
  flex: 1;
  font-size: 20px;
  border: none;
  outline: none;
`;
