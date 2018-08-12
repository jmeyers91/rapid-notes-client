import styled, { css } from 'styled-components';

export default styled.div`
  ${boxStyle}
  position: relative;
`;

export function boxStyle(props) {
  return css`
    display: ${props => props.inline ? 'inline-flex' : 'flex'};
    align-items: ${props.alignItems || 'normal'};
    align-self: ${props.alignSelf || 'auto'};
    align-content: ${props.alignContent || 'normal'};
    justify-content: ${props.justifyContent || 'normal'};
    flex-direction: ${props.direction || 'row'};
    flex-basis: ${props.basis || 'auto'};
    flex-wrap: ${getWrapValue(props.wrap)};
    flex-grow: ${getGrowValue(props.grow)};
    flex-shrink: ${getShrinkValue(props.shrink)};
  `;
}

function getWrapValue(input) {
  if(!input) return 'nowrap';
  if(input === 'reverse') return 'wrap-reverse';
  return 'wrap';
}

function getGrowValue(input) {
  if(!input) return 0;
  if(input === true) return 1;
  return input;
}

function getShrinkValue(input) {
  if(input == null || input === true) return 1;
  if(input === false) return 0;
  return input;
}
