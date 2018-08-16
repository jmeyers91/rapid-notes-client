import React from 'react';
import styled from 'styled-components';
import Column from './Column.component';
import Spinner from './Spinner.component';
import { fadeIn } from '../animations';

export default styled(props => {
  return (
    <Column {...props}>
      <Spinner/>
    </Column>
  );
})`
  flex: 1 1 auto;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.4s linear 1;
`;


