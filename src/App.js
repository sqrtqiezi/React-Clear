import React, { Component } from 'react';
import Task from './Task'
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      tasks: ['任务1', '任务2', '任务3', '任务4', '任务5', '任务6', '任务7', '任务8', '任务9']
    }
  }
  render() {
    const tasks = this.state.tasks;
    const count = tasks.length;

    return (
      <div className="App">
        {tasks.map(
          (task, index) => 
            <Task key={task} count={count} index={index}>{task}</Task>
        )}
      </div>
    );
  }
}

export default App;
