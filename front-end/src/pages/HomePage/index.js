import React, { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import '../../styles/styles.scss'
import {
    Header,
    Footer,
    Pagination,
    DeleteModal,
    EditModal,
} from '../../components'
import {
    getJobPriority,
    importJob,
    requestJob,
    popUpStatus,
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
    const [isAdded, setIsAdded] = useState(false)

    useEffect(() => {
        axios
            .get('http://localhost:3001/taskdb')
            .then((res) => { props.getJobPriority(res.data) && console.log(res.data) })
            .catch((error) => console.log({ error }))
    }, [])

    const addJob = () => {
        setJobName(jobName)
        setJobPriority(jobPriority)
        const newJobs = JSON.parse(localStorage.getItem('jobs'))
        const job = {
            id: Date.now(),
            job_name: jobName,
            job_priority: jobPriority === '' ? props.priorityList[0].priority_name : jobPriority,
            priority_number:
                jobPriority == ''
                    ? 1
                    : jobPriority == 'Urgent'
                        ? 1
                        : jobPriority == 'Regular'
                            ? 2
                            : 3,
        }
        if (jobName !== '') {
            localStorage.setItem('jobs', JSON.stringify([...newJobs, job]))
            setIsAdded(true)
        } else {
            return alert('Job name is required.')
        }
        setJobs(JSON.parse(localStorage.getItem('jobs')))
        props.importJob(job)
    }

    const onRequestDelete = (item) => {
        props.requestJob(item)
        props.popUpStatus('delete')
    }
    const onRequestEdit = (item) => {
        props.requestJob(item)
        props.popUpStatus('edit')
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

    const sortJobs = () => {
        setIsSorted(!isSorted)
    }

    const orderedJobs = useMemo(() => {
        let finalJobList = props.jobs
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
        props.jobs,
        jobs,
        isAdded,
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
        jobs,
        currentPage,
        pageSize,
        isSorted,
        orderedJobs,
    ])

    return (
        <div className="main-container">
            <Header />
            <DeleteModal />
            <EditModal />
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
                                    value="">Choose</option>
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
                                            <div
                                                key={item.id}
                                                className="select-box__value">
                                                <input
                                                    className="select-box__input"
                                                    type="radio"
                                                    id={item.priority_number}
                                                    name="Cardize"
                                                    onChange={() => setFilterPriority(item.priority_name)}
                                                />
                                                <p className="select-box__input-text">{item.priority_name}</p>
                                            </div>
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
                                            <li
                                                key={item.id}
                                                className="select-box__option">
                                                <label htmlFor={item.priority_number} aria-hidden="aria-hidden">
                                                    {item.priority_name}
                                                </label>
                                            </li>
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
                                        onClick={() => onRequestEdit(item)}
                                    ></button>
                                    <button
                                        className="action-remove"
                                        onClick={() => onRequestDelete(item)}
                                    ></button>
                                </div>
                            )
                        })}
                    </div>
                </div>
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
        popUp: state.popUp,
    }
}

export default connect(mapStateToProps, {
    getJobPriority,
    importJob,
    requestJob,
    popUpStatus,
})(App)
