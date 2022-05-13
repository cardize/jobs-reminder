import React from 'react'
import './styles.scss'
import logo from './images/logo.svg'
import data from './data/mock-data.json'
import { useState, useMemo } from 'react'
import Pagination from './Pagination'
import { connect } from 'react-redux'

let pageSize = 5

const App = (props) => {
  const [currentPage, setCurrentPage] = useState(1)

  let localJobs = JSON.parse(localStorage.getItem('jobs'))
  if (!localJobs) {
    localStorage.setItem('jobs', JSON.stringify(data))
    localJobs = data
  }

  const [jobs, setJobs] = useState(localJobs)
  const [jobName, setJobName] = useState('')
  const [jobPriority, setJobPriority] = useState('')
  const [isRemoved, setIsRemoved] = useState(false)
  const [isEdited, setIsEdited] = useState(false)
  const [requestedId, setRequestedId] = useState()
  const [isAdded, setIsAdded] = useState(false)
  const [defaultName, setDefaultName] = useState('')
  const [currentId, setCurrentId] = useState()
  const [newName, setNewName] = useState('')
  const [newPriority, setNewPriority] = useState('')
  const [currentPriority, setCurrentPriority] = useState()

  const addJob = () => {
    setJobName(jobName)
    setJobPriority(jobPriority)
    const newJobs = JSON.parse(localStorage.getItem('jobs'))
    const job = {
      id: Date.now(),
      job_name: jobName,
      job_priority: jobPriority === '' ? currentPriority : jobPriority,
      priority_number:
        jobPriority === 'Urgent' ? 1 : jobPriority === 'Regular' ? 2 : 3,
    }

    if (jobName !== '') {
      localStorage.setItem('jobs', JSON.stringify([...newJobs, job]))
      setIsAdded(true)
    } else {
      return alert('Job name is required')
    }
    setJobs(JSON.parse(localStorage.getItem('jobs')))
  }

  const requestDelete = (id) => {
    setRequestedId(id)
    setIsRemoved(true)
  }

  const removeJob = () => {
    const newJobs = jobs.filter((job) => job.id !== requestedId)
    localStorage.setItem('jobs', JSON.stringify(newJobs))
    setJobs(newJobs)
    setIsRemoved(false)
  }

  const requestEdit = (id, job_name, job_priority) => {
    setCurrentId(id)
    setDefaultName(job_name)
    setCurrentPriority(job_priority)
    setIsEdited(true)
  }

  const editJob = () => {
    const newJobs = jobs.map((job) => {
      if (job.id === currentId) {
        job.job_name = newName === '' ? defaultName : newName
        job.job_priority = newPriority === '' ? currentPriority : newPriority
        job.priority_number =
          newPriority === 'Urgent' ? 1 : newPriority === 'Regular' ? 2 : 3
      }
      return job
    })
    localStorage.setItem('jobs', JSON.stringify(newJobs))
    setJobs(newJobs)
    setIsEdited(false)
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
    return jobs.sort(
      (a, b) => a.priority_number - b.priority_number || b.id - a.id,
    )
  }, [jobs, localJobs])

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
                onChange={(event) => setJobPriority(event.target.value)}
              >
                <option value="Trivial">Choose </option>
                <option value="Urgent">Urgent</option>
                <option value="Regular">Regular</option>
                <option value="Trivial">Trivial</option>
              </select>
            </div>
            <button
              className="job-button"
              onClick={() => addJob(jobName, jobPriority)}
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
            <h3>
              {jobs.length}/{localJobs.length}
            </h3>
          </div>
          <div className="search-job-elements">
            <div className="search-job-element">
              <input
                className="job-input-2"
                onChange={(event) => filterJobsName(event.target.value)}
                placeholder="Job Name"
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
                  <li className="select-box__option">
                    <label htmlFor="0" aria-hidden="aria-hidden">
                      All
                    </label>
                  </li>
                  <li className="select-box__option">
                    <label htmlFor="1" aria-hidden="aria-hidden">
                      Urgent
                    </label>
                  </li>
                  <li className="select-box__option">
                    <label htmlFor="2" aria-hidden="aria-hidden">
                      Regular
                    </label>
                  </li>
                  <li className="select-box__option">
                    <label htmlFor="3" aria-hidden="aria-hidden">
                      Trivial
                    </label>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="jobs-container">
            <div className="jobs-title">
              <h4 className="name">Name</h4>
              <h4 className="priority">Priority</h4>
              <h4 className="action">Action</h4>
            </div>
            {currentTableData.map((item) => {
              return (
                <div className="jobs" key={item.id}>
                  <p className="j-name">{item.job_name}</p>
                  <p
                    className="j-priority"
                    style={
                      item.job_priority === 'Urgent'
                        ? { backgroundColor: '#E48285' }
                        : item.job_priority === 'Regular'
                        ? { backgroundColor: '#E1C639' }
                        : { backgroundColor: '#5978A9' }
                    }
                  >
                    {item.job_priority}
                  </p>
                  <button
                    className="action-edit"
                    onClick={() =>
                      requestEdit(
                        item.id,
                        item.job_name,
                        item.job_priority,
                        item.priority_number,
                      )
                    }
                  ></button>
                  <button
                    className="action-remove"
                    onClick={() => requestDelete(item.id)}
                  ></button>
                </div>
              )
            })}
          </div>
        </div>
        <div
          className="pop-up-back"
          style={
            isRemoved || isEdited ? { display: 'grid' } : { display: 'none' }
          }
        ></div>

        <div
          className="popup-container"
          style={isEdited ? { display: 'grid' } : { display: 'none' }}
        >
          <div className="popup-edit">
            <h4 className="edit-title">Job Name</h4>
            <input
              className="edit-input"
              defaultValue={defaultName}
              onChange={(event) => setNewName(event.target.value)}
            ></input>

            <h4 className="edit-title">Job Priority</h4>
            <select
              className="edit-select"
              onChange={(event) => setNewPriority(event.target.value)}
            >
              <option value="">Choose </option>
              <option value="Urgent">Urgent</option>
              <option value="Regular">Regular</option>
              <option value="Trivial">Trivial</option>
            </select>

            <div className="button-container">
              <button
                className="cancel-button"
                onClick={() => setIsEdited(false)}
              >
                Cancel
              </button>
              <button
                className="approve-button"
                onClick={() => editJob(currentId, newName, newPriority)}
              >
                Save
              </button>
            </div>
          </div>
        </div>

        <div
          className="popup-container"
          style={isRemoved ? { display: 'grid' } : { display: 'none' }}
        >
          <div className="popup-remove">
            <div className="confirmation-icon"></div>
            <h3 className="confirmation-text">
              Are you sure you want to delete it?
            </h3>
            <div className="button-container">
              <button
                className="cancel-button"
                onClick={() => setIsRemoved(false)}
              >
                Cancel
              </button>
              <button className="approve-button" onClick={() => removeJob()}>
                Approve
              </button>
            </div>
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
        <p>© 2022 Mustafa S Sakarya</p>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    job: state.job,
  }
}

export default connect(mapStateToProps)(App)
