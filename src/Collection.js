import React, { Component } from 'react';
import Item from './Item'
import { ITEM_HEIGHT } from './constants'

class Collection extends Component{
  constructor() {
    super();
    const tasks = [
      {
        order: 0,
        text: '任务1',
      },
      {
        order: 1,
        text: '任务2很长很长很长很长很长很长'
      },
      {
        order: 2,
        text: '任务3',
      },
      {
        order: 3,
        text: '任务4'
      },
      {
        order: 4,
        text: '任务5'
      },
      {
        order: 5,
        text: '任务6'
      },
      {
        order: 6,
        text:'任务7'
      },
      {
        order: 7,
        text: '任务8'
      }, 
      {
        order: 8,
        text: '任务9',
        done: true
      }
    ];

    for(let task of tasks) {
      task.position = task.order * ITEM_HEIGHT;
    }
    this.state = { tasks };
  }

  handleCheck(task) {
    const { tasks } = this.state;

    return () => {
      const prevOrder = task.order

      let i = task.order;
      for(; i<tasks.length; i++) {
        if (tasks[i].done) {
          task.order = --i;
          task.done = true;
          break;
        }
      }

      for(; i>prevOrder; i--) {
        tasks[i].order--;
      }

      this.setState({ tasks: tasks.sort((a, b) => a.order > b.order) });
      setTimeout(this.handlePositioning.bind(this), 0);
    }
  }

  handleCross(task) {
    const { tasks } = this.state;

    return () => {
      tasks.splice(task.order, 1);

      let order = 0;
      for(let item of tasks) {
        item.order = order++;
      }
      this.setState({ tasks });
      setTimeout(this.handlePositioning.bind(this), 0);
    }
  }

  handleUnCheck(task) {
    const { tasks } = this.state;

    return () => {
      let prevOrder = task.order;
      let i = 0;

      for (; i<tasks.length; i++) {
        if (tasks[i].done) {
          task.done = false;
          task.order = i;
          break;
        }
      }

      for (; i<prevOrder; i++) {
        tasks[i].order++;
      }

      this.setState({ tasks: tasks.sort((a, b) => a.order > b.order) });
      setTimeout(this.handlePositioning.bind(this), 0);
    }
  }

  handlePositioning() {
    const { tasks } = this.state;
    let count = 12;
    const steps = [];
    const positions = [];

    for(let task of tasks) {
      const nextPosition = ITEM_HEIGHT * task.order;
      positions.push(nextPosition);
      if (task.position !== nextPosition) {
        steps.push((nextPosition - task.position) / count) 
      } else {
        steps.push(0);
      }
    }

    console.dir(positions);
    console.dir(steps);

    const innerPositioning = () => {
      const { tasks } = this.state;

      requestAnimationFrame(() => {
        count--;
        for(let task of tasks) {
          task.position += steps[task.order];
        }

        if (count > 0) {
          innerPositioning();
        } else {
          for(let task of tasks) {
            task.position = positions[task.order]
          }
        }
        this.setState({ tasks });
      });
    };

    innerPositioning();
  }

  render() {
    const { tasks } = this.state;

    return (<div>
      {tasks.map((task, index) => 
        <Item
          key={task.text}
          count={tasks.length}
          index={index}
          position={task.position}
          done={task.done}
          handleCheck={this.handleCheck(task)}
          handleCross={this.handleCross(task)}
          handleUnCheck={this.handleUnCheck(task)}
        >
          {task.text}
        </Item>
      )}
    </div>)
  }
}

export default Collection;