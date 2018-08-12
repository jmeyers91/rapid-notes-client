import styled from 'styled-components';

export default styled.button`
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 16px;
  color: ${props => props.textColor || 'white'};
  background-color: ${props => props.color || '#555555'};
  padding: 0 20px 0 20px;
  text-decoration: none;
  cursor: pointer;
`;
