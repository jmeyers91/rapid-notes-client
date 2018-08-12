import Box from './Box.component';

export default Box.withComponent('ul').extend`
  list-style: none;
  padding: 0;
  margin: 0;
  flex-direction: column;
`;
