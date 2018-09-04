import React from 'react';
import styled from 'styled-components';
import Row from './Row.component';

export default styled(props => {
  const { file } = props;

  return (
    <Row {...props}>
      <div>{file.name}</div>
      {file.isImage &&
        <PreviewImage alt={file.name} src={file.url}/>
      }
    </Row>
  );
})`
  height: 100px;
  padding: 20px;
  border-bottom: 2px solid #CCC;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
`;

const PreviewImage = styled.img`
  max-height: 100%;
`;
