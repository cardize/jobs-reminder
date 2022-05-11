import React from 'react'
import './styles.scss'
import logo from './images/logo.svg'
import data from './data/mock-data.json'
import { useState, useEffect, useMemo } from 'react'
import Pagination from './Pagination'

let pageSize = 5

const App = () => {
  const [currentPage, setCurrentPage] = useState(1)

  let localJobs = JSON.parse(localStorage.getItem('jobs'))
  if (!localJobs) {
    localStorage.setItem('jobs', JSON.stringify(data))
    localJobs = data
  }

  const [jobs, setJobs] = useState(localJobs)
  const [jobName, setJobName] = useState('')
  const [jobPriority, setJobPriority] = useState('')
  const [isAdded, setIsAdded] = useState(false)

  const addJob = () => {
    console.log('add job')
    setJobName(jobName)
    setJobPriority(jobPriority)
    const newJobs = JSON.parse(localStorage.getItem('jobs'))
    const job = {
      id: Date.now(),
      job_name: jobName,
      job_priority: jobPriority ? jobPriority : 'Regular',
    }

    if (jobName !== '') {
      localStorage.setItem('jobs', JSON.stringify([...newJobs, job]))
      setIsAdded(true)
    } else {
      return alert('Job name is required')
    }
    setJobs(JSON.parse(localStorage.getItem('jobs')))
  }

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * pageSize
    const lastPageIndex = firstPageIndex + pageSize
    return jobs.slice(firstPageIndex, lastPageIndex)
  }, [jobs, currentPage])

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
              <input
                className="job-input"
                type="text"
                defaultValue={jobName}
                onChange={(e) => setJobName(e.target.value)}
                onInput={() => setIsAdded(false)}
              ></input>
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
            <button
              className="job-button"
              onClick={() => addJob(jobName)}
              disabled={isAdded}
              style={{
                cursor: isAdded ? '' : 'pointer',
                backgroundColor: isAdded ? '#ccc' : '#5978a9',
              }}
            >
              <span className="plus-button">+ </span>
              Create
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
              <input className="job-input-2"></input>
            </div>
            <div className="search-job-element">
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
          <div className="jobs-container">
            <div className="jobs-title">
              <h4>Name</h4>
              <h4>Priority</h4>
              <h4>Action</h4>
            </div>
            {currentTableData.map((item) => {
              return (
                <div className="jobs" key={item.id}>
                  <p>{item.job_name}</p>
                  <p>{item.job_priority}</p>
                  <button className="action-edit">Edit</button>
                  <button className="action-edit">Remove</button>
                </div>
              )
            })}
          </div>
        </div>
        <div>
          <Pagination
            className="pagination-bar"
            currentPage={currentPage}
            totalCount={jobs.length}
            pageSize={pageSize}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
      <div className="footer-container">
        <h3>Footer</h3>
      </div>
    </div>
  )
}

export default App
