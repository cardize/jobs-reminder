import React, { useCallback, useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import '../../styles/styles.scss'
import {
    Header,
    Footer,
    Pagination,
} from '../../components'
import { connect } from 'react-redux'
import {
    getJobPriority,
    importJob,
    deleteJob,
    updateJob
} from '../../redux/actions'

let pageSize = 5

const App = (props) => {
    const [currentPage, setCurrentPage] = useState(1)
    const [jobs, setJobs] = useState(props.jobs)
    const [isSorted, setIsSorted] = useState(false)
    const [filterPriority, setFilterPriority] = useState('All')
    const [filterName, setFilterName] = useState('')
    const [jobName, setJobName] = useState('')
    const [jobPriority, setJobPriority] = useState('')
    const [isRemoved, setIsRemoved] = useState(false)
    const [isEdited, setIsEdited] = useState(false)
    const [requestedId, setRequestedId] = useState()
    const [isAdded, setIsAdded] = useState(false)
    const [newName, setNewName] = useState('')
    const [newPriority, setNewPriority] = useState('')

    useEffect(() => {
        axios
            .get('http://localhost:3001/taskdb')
            .then((res) => { props.getJobPriority(res.data) && console.log(res.data) })
            .catch((error) => console.log({ error }))
    }, [])

    const addJob = () => {
        console.log(props.priorityList)
        console.log('asdasdas', currentTableData)
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
        setCurrentPage(1)
    }

    const requestEdit = (item) => {
        setRequestedId(item.id)
        setIsEdited(true)
        setNewPriority(item.job_priority)
        setNewName(item.job_name)
    }
    const priorityChanced = (event) => {
        setNewPriority(event.target.value)
    }
    const nameChanged = (event) => {
        setNewName(event.target.value)
    }
    const newJobNameChanged = (event) => {
        setJobName(event.target.value)
    }
    const newJobPriorityChanced = (event) => {
        setJobPriority(event.target.value)
    }
    const filterNameChanged = (event) => {
        setFilterName(event.target.value)
    }

    const editJob = () => {
        const newJobs = jobs.map((job) => {
            if (job.id === requestedId) {
                job.job_name = newName
                console.log(newPriority)
                let currentPriority = newPriority
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
                            value={newName}
                            onChange={nameChanged}
                        ></input>

                        <h4 className="edit-title">Job Priority</h4>
                        <select
                            className="edit-select"
                            onChange={priorityChanced}
                            value={newPriority}
                        >
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
    }

    const orderedJobs = useMemo(() => {
        let finalJobList = jobs
        if (isSorted === true) {
            finalJobList = finalJobList.sort(
                (a, b) => b.priority_number - a.priority_number || b.id - a.id,
            )
        } else {
            finalJobList = finalJobList.sort(
                (a, b) => a.priority_number - b.priority_number || b.id - a.id,
            )
        }
        if (filterName !== '') {
            finalJobList = finalJobList.filter((item) =>
                item.job_name
                    .toLocaleLowerCase('tr-TR')
                    .includes(filterName.toLocaleLowerCase('tr-TR')),
            )

            setCurrentPage(1)
        }
        if (filterPriority !== 'All') {
            finalJobList = finalJobList.filter(
                (item) => item.job_priority === filterPriority,
            )
        }
        return finalJobList
    }, [
        isAdded,
        isRemoved,
        isEdited,
        jobs,
        currentPage,
        pageSize,
        isSorted,
        filterName,
        filterPriority,
    ])

    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * pageSize
        const lastPageIndex = firstPageIndex + pageSize
        return orderedJobs.slice(firstPageIndex, lastPageIndex)
    }, [
        isAdded,
        isRemoved,
        isEdited,
        jobs,
        currentPage,
        pageSize,
        isSorted,
        orderedJobs,
    ])

    return (
        <div className="main-container">
            <Header />
            <div className="body-container">
                <div className="create-job">
                    <h2>Create New Job</h2>
                    <div className="create-job-elements">
                        <div className="create-job-element">
                            <h4>Job Name</h4>
                            <input
                                className="job-input"
                                onFocus={(event) => event.target.select()}
                                value={jobName}
                                onChange={newJobNameChanged}
                                onInput={() => setIsAdded(false)}
                            ></input>
                        </div>
                        <div className="create-job-element">
                            <h4>Job Priority</h4>
                            <select
                                className="select-box__current"
                                name="priority"
                                id="priority"
                                form="priorityform"
                                onChange={newJobPriorityChanced}
                            >
                                <option
                                    className="select-box__option"
                                    value="">Choose </option>
                                {props.priorityList.length == 0 ? null : props.priorityList.map((item) => {
                                    return (
                                        <option
                                            key={item.id}
                                            value={item.priority_name}>{item.priority_name}
                                        </option>
                                    )
                                })}
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
                            {orderedJobs.length}/{jobs.length}
                        </h3>
                    </div>
                    <div className="search-job-elements">
                        <div className="search-job-element">
                            <input
                                className="job-input-2"
                                onChange={filterNameChanged}
                                placeholder="Job Name"
                            ></input>
                        </div>
                        <div className="sort-h">
                            <div className="select-box">
                                <div
                                    className="select-box__current"
                                    tabIndex="1">
                                    <div className="select-box__value">
                                        <input
                                            className="select-box__input"
                                            type="radio"
                                            id="0"
                                            name="Cardize"
                                            defaultChecked="defaulChecked"
                                            onChange={() => setFilterPriority('All')}
                                        />
                                        <p className="select-box__input-text">Priority (All)</p>
                                    </div>
                                    {props.priorityList.length == 0 ? null : props.priorityList.map((item) => {
                                        return (
                                            <>
                                                <div className="select-box__value">
                                                    <input
                                                        className="select-box__input"
                                                        type="radio"
                                                        id={item.priority_number}
                                                        name="Cardize"
                                                        onChange={() => setFilterPriority(item.priority_name)}
                                                    />
                                                    <p className="select-box__input-text">{item.priority_name}</p>
                                                </div>
                                            </>

                                        )
                                    })}
                                </div>
                                <ul className="select-box__list">
                                    <li className="select-box__option">
                                        <label htmlFor="0" aria-hidden="aria-hidden">
                                            All
                                        </label>
                                    </li>
                                    {props.priorityList.length == 0 ? null : props.priorityList.map((item) => {
                                        return (
                                            <>
                                                <li className="select-box__option">
                                                    <label htmlFor={item.priority_number} aria-hidden="aria-hidden">
                                                        {item.priority_name}
                                                    </label>
                                                </li>

                                            </>
                                        )
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="jobs-container">
                        <div className="jobs-title">
                            <h4 className="name">Name</h4>
                            <h4 className="priority" onClick={() => sortJobs()}>
                                Priority⇅
                            </h4>
                            <h4 className="action">Action</h4>
                        </div>
                        {currentTableData.length == 0 && <h1 className='no-task-title'>You don't have any tasks.</h1>}
                        {currentTableData.map((item) => {
                            return (
                                <div
                                    key={item.id}
                                    className="jobs" >
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
                        totalCount={orderedJobs.length}
                        pageSize={pageSize}
                        onPageChange={(page) => setCurrentPage(page)}
                    />
                </div>
            </div>
            <Footer />
        </div >
    )
}

const mapStateToProps = (state) => {
    return {
        priorityList: state.priorityList,
        jobs: state.jobs,
        filteredJobs: state.filteredJobs,
    }
}

export default connect(mapStateToProps, {
    getJobPriority,
    updateJob,
    importJob,
    deleteJob,
})(App)
