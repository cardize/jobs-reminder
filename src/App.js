import React from 'react'
import './styles.scss'
import logo from './images/logo.svg'

function App() {
  return (
    <div className="main-container">
      <div className="header-container">
        <img className="logo" src={logo} alt="Google Logo" />
        <h1>Jobs Reminder</h1>
      </div>
      <div className="body-container">
        <div className="create-job">
          <h2>Create New Job</h2>
          <div className="create-job-elements">
            <div className="create-job-element">
              <h4>Job Name</h4>
              <input className="job-input"></input>
            </div>
            <div className="create-job-element">
              <h4>Job Priority</h4>
              <select
                className="select-priority"
                name="priority"
                id="priority"
                form="priorityform"
              >
                <option>Choose</option>
                <option value="urgent">Urgent</option>
                <option value="regular">Regular</option>
                <option value="trivial">Trivial</option>
              </select>
            </div>
            <button className="job-button">
              <span className="plus-button">+ </span>Create
            </button>
          </div>
        </div>
        <div className="search-job">
          <div className="search-title">
            <h2>Jobs List</h2>
            <h2>3/3</h2>
          </div>
          <div className="search-job-elements">
            <div className="search-job-element">
              <h4>Job Name</h4>
              <input className="job-input-2"></input>
            </div>
            <div className="search-job-element">
              <h4>Job Priority</h4>
              <select
                className="select-priority-2"
                name="priority"
                id="priority"
                form="priorityform"
              >
                <option>Priority (All)</option>
                <option value="urgent">Urgent</option>
                <option value="regular">Regular</option>
                <option value="trivial">Trivial</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-container">
        <h3>Footer</h3>
      </div>
    </div>
  )
}

export default App
