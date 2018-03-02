import React, { Component } from 'react';
import Item from './Item'

class Collection extends Component{
  constructor() {
    super();
    this.state = {
      tasks: [
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
      ]
    };
  }

  render() {
    const sortedTasks = this.state.tasks.sort((a, b) => a.order > b.order);

    return (<div>
      {sortedTasks.map((task, index) => 
        <Item
          key={task.text}
          count={sortedTasks.length}
          index={index}
          done={task.done}
          handleCheck={() => {
            task.done = true;
            let order = 0;
            for(let item of sortedTasks) {
              if (!item.done) {
                item.order = order++;
              } else if (item.done && item !== task) {
                task.order = order;
              }
            }
            this.setState({ tasks: sortedTasks });
          }}
          handleCross={() => {
            sortedTasks.splice(index, 1);
            let order = 0;
            for(let item of sortedTasks) {
              item.order = order++;
            }
            this.setState({ tasks: sortedTasks });
          }}
          handleUnCheck={() => {
            task.done = false;
            let order = 0, placed = false;
            for(let item of sortedTasks) {
              order++;
              if (item.done) {
                if (!placed) {
                  task.order = order;
                  placed = true;
                  order++
                }
                if (item !== task) {
                  item.order = order;
                }
              }
            }
            this.setState({ tasks: sortedTasks });
          }}
        >
          {task.text}
        </Item>
      )}
    </div>)
  }
}

export default Collection;