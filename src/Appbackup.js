import React from 'react'
import './styles.scss'
import logo from './images/logo.svg'
import data from './data/mock-data.json'
import { useState, useMemo } from 'react'
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
  const [priorityNumber, setPriorityNumber] = useState('')
  const [isAdded, setIsAdded] = useState(false)

  const addJob = () => {
    setJobName(jobName)
    setJobPriority(jobPriority)
    const newJobs = JSON.parse(localStorage.getItem('jobs'))
    const job = {
      id: Date.now(),
      job_name: jobName,
      job_priority: jobPriority ? jobPriority : 'Regular',
      priority_number: priorityNumber ? priorityNumber : 2,
    }

    if (jobName !== '') {
      localStorage.setItem('jobs', JSON.stringify([...newJobs, job]))
      setIsAdded(true)
    } else {
      return alert('Job name is required')
    }
    setJobs(JSON.parse(localStorage.getItem('jobs')))
  }

  const filterJobsName = (value) => {
    setJobs(
      localJobs.filter((job) =>
        job.job_name.toLowerCase().includes(value.toLowerCase()),
      ),
    )
  }

  const filterJobsPriority = (value) => {
    setJobs(localJobs.filter((job) => job.job_priority === value))
  }

  const orderedJobs = useMemo(() => {
    return jobs.sort((a, b) => a.priority_number - b.priority_number)
  }, [jobs])

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * pageSize
    const lastPageIndex = firstPageIndex + pageSize
    return orderedJobs.slice(firstPageIndex, lastPageIndex)
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
              <input
                className="job-input-2"
                onChange={(event) => filterJobsName(event.target.value)}
              ></input>
            </div>
            <div className="sort-h">
              <div className="select-box">
                <div className="select-box__current" tabIndex="1">
                  <div className="select-box__value">
                    <input
                      className="select-box__input"
                      type="radio"
                      id="0"
                      name="Cardize"
                      defaultChecked="defaulChecked"
                      onChange={() => setJobs(localJobs)}
                    />
                    <p className="select-box__input-text">Priority (All)</p>
                  </div>
                  <div className="select-box__value">
                    <input
                      className="select-box__input"
                      type="radio"
                      id="1"
                      name="Cardize"
                      onChange={() => filterJobsPriority('Urgent')}
                    />
                    <p className="select-box__input-text">Urgent</p>
                  </div>
                  <div className="select-box__value">
                    <input
                      className="select-box__input"
                      type="radio"
                      id="2"
                      name="Cardize"
                      onChange={() => filterJobsPriority('Regular')}
                    />
                    <p className="select-box__input-text">Regular</p>
                  </div>
                  <div className="select-box__value">
                    <input
                      className="select-box__input"
                      type="radio"
                      id="3"
                      name="Cardize"
                      onChange={() => filterJobsPriority('Trivial')}
                    />
                    <p className="select-box__input-text">Trivial</p>
                  </div>
                </div>
                <ul className="select-box__list">
                  <li>
                    <label
                      className="select-box__option"
                      htmlFor="0"
                      aria-hidden="aria-hidden"
                    >
                      All
                    </label>
                  </li>
                  <li>
                    <label
                      className="select-box__option"
                      htmlFor="1"
                      aria-hidden="aria-hidden"
                    >
                      Urgent
                    </label>
                  </li>
                  <li>
                    <label
                      className="select-box__option"
                      htmlFor="2"
                      aria-hidden="aria-hidden"
                    >
                      Regular
                    </label>
                  </li>
                  <li>
                    <label
                      className="select-box__option"
                      htmlFor="3"
                      aria-hidden="aria-hidden"
                    >
                      Trivial
                    </label>
                  </li>
                </ul>
              </div>
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
