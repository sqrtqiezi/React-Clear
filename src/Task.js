import React, { Component } from 'react';
import styled from 'styled-components';

// 均匀的计算颜色渐变
function _gradient(startColor, endColor, index, count) {
  count = count < 8 ? 8 : count;
  const result = []
  for(let i = 0; i < 3; i++) {
    const start = parseInt(startColor.substr(i*2+1, 2), 16);
    const end = parseInt(endColor.substr(i*2+1, 2), 16);
    const color = Math.floor(start + (end - start) * index / count).toString(16);
    result.push('00'.substr(0, 2-color.length) + color);
  }
  return `#${result.join('')}`;
}

const StyledTask = styled.div`
  box-sizing: border-box;
  color: white;
  width: 100%;
  background-color: ${props => props.color};
  text-align: left;
  padding: .8em;
`;

class Task extends Component {
  render() {
    const startColor = '#E30621';
    const endColor = '#EFAF37';
    const color = _gradient(startColor, endColor, this.props.index, this.props.count);

    return (
      <StyledTask color={color}>{this.props.children}</StyledTask>
    );
  }
}

export default Task;
