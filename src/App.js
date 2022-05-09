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
          <h1>Create Job</h1>
        </div>

        <div className="list-job">
          <h1>List Job</h1>
        </div>
      </div>
      <div className="footer-container">
        <h1>Footer</h1>
      </div>
    </div>
  )
}

export default App
