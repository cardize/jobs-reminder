import React, { useCallback, useRef } from 'react'
import './styles.scss'
import logo from './images/logo.svg'
import { useState, useMemo } from 'react'
import Pagination from './Pagination'
import { connect } from 'react-redux'
import { importJob, deleteJob, updateJob } from './actions/index'

let pageSize = 5

const App = (props) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [jobs, setJobs] = useState(props.jobs)
  const [filteredJobs, setFilteredJobs] = useState('')
  const [isSorted, setIsSorted] = useState(false)
  const [jobName, setJobName] = useState('')
  const [jobPriority, setJobPriority] = useState('')
  const [isRemoved, setIsRemoved] = useState(false)
  const [isEdited, setIsEdited] = useState(false)
  const [requestedId, setRequestedId] = useState()
  const [isAdded, setIsAdded] = useState(false)
  const newName = useRef(null)
  const newPriority = useRef(null)
  const addJob = () => {
    setJobName(jobName)
    setJobPriority(jobPriority)
    const newJobs = JSON.parse(localStorage.getItem('jobs'))
    const job = {
      id: Date.now(),
      job_name: jobName,
      job_priority: jobPriority === '' ? 'Regular' : jobPriority,
      priority_number:
        jobPriority === ''
          ? 2
          : jobPriority === 'Urgent'
          ? 1
          : jobPriority === 'Regular'
          ? 2
          : 3,
    }

    if (jobName !== '') {
      localStorage.setItem('jobs', JSON.stringify([...newJobs, job]))
      setIsAdded(true)
    } else {
      return alert('Job name is required')
    }
    setJobs(JSON.parse(localStorage.getItem('jobs')))
    props.importJob(job)
  }

  const requestDelete = (id) => {
    setRequestedId(id)
    setIsRemoved(true)
  }

  const removeJob = () => {
    const newJobs = jobs.filter((job) => job.id !== requestedId)
    localStorage.setItem('jobs', JSON.stringify(newJobs))
    props.deleteJob(newJobs)
    setJobs(newJobs)
    setIsRemoved(false)
    console.log(props.jobs, newJobs)
  }

  const requestEdit = (item) => {
    setRequestedId(item.id)
    setIsEdited(true)
    document.getElementById(
      'edit-job-input',
    ).innerHTML = document.getElementById('edit-job-input').value
  }

  const editJob = () => {
    const newJobs = jobs.map((job) => {
      if (job.id === requestedId) {
        job.job_name = newName.current.value
        let currentPriority = newPriority.current.value
        job.job_priority = currentPriority === '' ? 'Regular' : currentPriority
        job.priority_number =
          currentPriority === ''
            ? 2
            : currentPriority === 'Urgent'
            ? 1
            : currentPriority === 'Regular'
            ? 2
            : 3
      }
      return job
    })
    props.updateJob(newJobs)
    setJobs(newJobs)
    localStorage.setItem('jobs', JSON.stringify(newJobs))
    setIsEdited(false)
  }

  const popUpModal = useCallback(() => {
    return (
      <>
        <div
          className="pop-up-back"
          style={
            isRemoved || isEdited ? { display: 'flex' } : { display: 'none' }
          }
        ></div>
        <div
          className="popup-container"
          style={isEdited ? { display: 'flex' } : { display: 'none' }}
        >
          <div className="popup-edit">
            <h4 className="edit-title">Job Name</h4>
            <input
              id="edit-job-input"
              className="edit-input"
              ref={newName}
            ></input>

            <h4 className="edit-title">Job Priority</h4>
            <select className="edit-select" ref={newPriority}>
              <option value="Regular">Choose </option>
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
              <button className="approve-button" onClick={() => editJob()}>
                Save
              </button>
            </div>
          </div>
        </div>

        <div
          className="popup-container"
          style={isRemoved ? { display: 'flex' } : { display: 'none' }}
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
      </>
    )
  }, [isRemoved, isEdited, jobs, removeJob, editJob])

  const sortJobs = () => {
    setIsSorted(!isSorted)
    console.log(isSorted)
  }

  const filterJobsPriority = (value) => {
    if (value === 'All') {
      return orderedJobs, setCurrentPage(1)
    } else {
      return (
        orderedJobs.filter((job) => job.job_priority === value),
        setCurrentPage(1)
      )
    }
  }

  const filterJobsName = (value) => {
    if (value === '') {
      return orderedJobs, setCurrentPage(1)
    } else {
      return (
        orderedJobs.filter((job) =>
          job.job_name.toLowerCase().includes(value.toLowerCase()),
        ),
        setCurrentPage(1)
      )
    }
  }

  const orderedJobs = useMemo(() => {
    if (isSorted === true) {
      return props.jobs.sort(
        (a, b) => b.priority_number - a.priority_number || b.id - a.id,
      )
    } else {
      return props.jobs.sort(
        (a, b) => a.priority_number - b.priority_number || b.id - a.id,
      )
    }
  }, [
    isAdded,
    isRemoved,
    isEdited,
    props.jobs,
    jobs,
    currentPage,
    pageSize,
    filteredJobs,
    isSorted,
  ])

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * pageSize
    const lastPageIndex = firstPageIndex + pageSize
    return orderedJobs.slice(firstPageIndex, lastPageIndex)
  }, [
    isAdded,
    isRemoved,
    isEdited,
    props.jobs,
    jobs,
    currentPage,
    pageSize,
    isSorted,
    orderedJobs,
    filterJobsName,
    filterJobsPriority,
  ])

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
                onFocus={(event) => event.target.select()}
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
                <option value="">Choose </option>
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
              {filteredJobs.length === 0 ? jobs.length : filteredJobs.length}/
              {jobs.length}
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
                      onChange={() => filterJobsPriority('All')}
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
              <h4 className="priority" onClick={() => sortJobs()}>
                Priority
              </h4>
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
                    onClick={() => (
                      requestEdit(item),
                      (document.getElementById('edit-job-input').value =
                        item.job_name)
                    )}
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
        {popUpModal()}
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
    jobs: state.jobs,
    filteredJobs: state.filteredJobs,
  }
}

export default connect(mapStateToProps, {
  updateJob,
  importJob,
  deleteJob,
})(App)
