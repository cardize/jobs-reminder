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
        <div className="list-job">
          <h2>List Job</h2>
        </div>
      </div>
      <div className="footer-container">
        <h3>Footer</h3>
      </div>
    </div>
  )
}

export default App
