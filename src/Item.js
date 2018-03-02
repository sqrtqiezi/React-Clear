import React, { Component } from 'react';
import styled from 'styled-components';
import { ITEM_HEIGHT, ACTIONS } from './constants'

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

const StyledItem = styled.div.attrs({
  style: ({ position }) => ({
    transform: `translate3d(0px, ${position}px, 0px)`
  })
})`
  position: absolute;
  width: 100%;
`;

const ItemSlider = styled.div.attrs({
  style: ({ movingDistance, color }) => ({
    transform: `translate3d(${movingDistance}px, 0px, 0px)`
  })
})`
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  color: ${props => props.done && props.opacity < 1 ? '#989898' : 'white'};
  width: 100%;
  background-color: ${props => props.bgColor};
  padding: 15px;
`;

const ItemText = styled.span`
  position: relative;
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    width: ${props => (props.done ? 1-props.opacity : props.opacity) * 100}%;
    border-bottom: 2px solid ${props => props.done ? '#989898' : 'white'};
  }
`

const ItemOperator = styled.img.attrs({
  style: ({ opacity, movingDistance }) => ({
    opacity,
    transform: `translate3d(${movingDistance}px, 0px, 0px)`
  })
})`
  position: absolute;
  z-index: 0;
  top: 0;
  width: ${props => props.width}px;
  height: ${props => props.width}px;
`;

const ItemCheck = ItemOperator.extend.attrs({
  src: 'img/check.png'
})`
  left: 0;
`;

const ItemCross = ItemOperator.extend.attrs({
  src: 'img/cross.png'
})`
  right: 0;
`;

class Item extends Component {
  constructor() {
    super();
    this.state = {
      isMoving: false,
      movingStart: 0,
      sliderDistance: 0,
      checkDistance: 0,
      crossDistance: 0,
      checkOpacity: 0,
      crossOpacity: 0,
      placed: false,
      action: ACTIONS.NOOP
    }
    this.handlStart = this.handlStart.bind(this);
    this.handlMove = this.handlMove.bind(this);
    this.handleEnd = this.handleEnd.bind(this);
  }

  handlStart(e) {
    this.setState({ 
      isMoving: true,
      movingStart: e.changedTouches[0].pageX
    });
  }

  handlMove(e) {
    const bound = ITEM_HEIGHT;

    if(this.state.isMoving) {
      let sliderDistance = e.touches[0].pageX - this.state.movingStart;
      let { checkOpacity, checkDistance, crossOpacity, crossDistance, action } = this.state;

      if (sliderDistance > 0) {
        // right move : check
        if (sliderDistance > bound) {
          checkDistance = (sliderDistance - bound) / 3;
          sliderDistance = bound + checkDistance;
          checkOpacity = 1;
          if (this.props.done) {
            action = ACTIONS.UNCHECK;
          } else {
            action = ACTIONS.CHECK;
          }
        } else {
          checkOpacity = sliderDistance / bound;
          action = ACTIONS.NOOP;
        }
      } else {
        // left move : cross
        if (Math.abs(sliderDistance) > bound) {
          crossDistance = (sliderDistance + bound) / 3;
          sliderDistance =  crossDistance - bound;
          crossOpacity = 1;
          action = ACTIONS.CROSS;
        } else {
          crossOpacity = Math.abs(sliderDistance / bound);
          action = ACTIONS.NOOP;
        }
      }
      this.setState({
        action,
        checkOpacity, 
        crossOpacity,
        sliderDistance,
        checkDistance,
        crossDistance
      });
    }
  }

  handleEnd(e) {
    if (this.state.isMoving) {
      switch(this.state.action) {
        case ACTIONS.CHECK:
          this.props.handleCheck();
          break;
        case ACTIONS.CROSS:
          this.props.handleCross();
          break;
        case ACTIONS.UNCHECK:
          this.props.handleUnCheck();
          break;
        default:
          break;
      }

      this.setState({
        isMoving: false,
        sliderDistance: 0,
        checkOpacity: 0,
        action: ACTIONS.NOOP
      });
    }
  }

  _calcBgColor(done, opacity) {
    const startColor = '#E30621';
    const endColor = '#EFAF37';
    const greenColor = '#01AA3F';

    if (done) {
      if (opacity < 1) {
        return '#000000';
      } else {
        return endColor
      }
    } else {
      if (opacity < 1) {
        return _gradient(startColor, endColor, this.props.index, this.props.count);
      } else {
        return greenColor;
      }
    }
  }

  render() {
    const { done, position } = this.props;
    const { checkOpacity, sliderDistance, checkDistance, crossDistance } = this.state;
    const bgColor = this._calcBgColor(done, checkOpacity);

    return (
      <StyledItem position={position}>
        <ItemSlider
          bgColor={bgColor}
          done={done}
          opacity={checkOpacity}
          movingDistance={sliderDistance}
          onTouchStart={this.handlStart}
          onTouchMove={this.handlMove}
          onTouchEnd={this.handleEnd}
        >
          <ItemText done={done} opacity={checkOpacity}>{this.props.children}</ItemText>
        </ItemSlider>
        <ItemCheck
          width={ITEM_HEIGHT} 
          movingDistance={checkDistance}
          opacity={this.state.checkOpacity}
        />
        <ItemCross
          width={ITEM_HEIGHT}
          movingDistance={crossDistance}
          opacity={this.state.crossOpacity}
        />
      </StyledItem>
    );
  }
}

export default Item;
